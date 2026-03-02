import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {format, isPast} from 'date-fns';
import {bookingsApi} from '../../api/client';
import {RootStackParamList, Booking} from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = 'upcoming' | 'past';

export default function MyBookingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const {data: bookings = [], isLoading, refetch, isRefetching} = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => bookingsApi.getMy().then(res => res.data),
  });

  const upcomingBookings = bookings.filter(
    (b: Booking) =>
      !isPast(new Date(b.startTime)) &&
      !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status),
  );

  const pastBookings = bookings.filter(
    (b: Booking) =>
      isPast(new Date(b.startTime)) ||
      ['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status),
  );

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const statusColors: Record<string, string> = {
    PENDING: '#F59E0B',
    CONFIRMED: '#10B981',
    IN_PROGRESS: '#3B82F6',
    COMPLETED: '#10B981',
    CANCELLED: '#EF4444',
    NO_SHOW: '#6B7280',
  };

  const renderBooking = ({item}: {item: Booking}) => (
    <TouchableOpacity
      style={styles.bookingCard}
      onPress={() => navigation.navigate('BookingDetail', {bookingId: item.id})}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.shopName}>{item.shop?.name}</Text>
          <Text style={styles.bookingNumber}>{item.bookingNumber}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {backgroundColor: (statusColors[item.status] || '#6B7280') + '20'},
          ]}>
          <Text
            style={[
              styles.statusText,
              {color: statusColors[item.status] || '#6B7280'},
            ]}>
            {item.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>
            {format(new Date(item.startTime), 'EEE, MMM d, yyyy')}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🕐</Text>
          <Text style={styles.detailText}>
            {format(new Date(item.startTime), 'h:mm a')}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.servicesText}>
          {item.services?.length || 0} service(s)
        </Text>
        <Text style={styles.totalText}>₹{item.displayAmount}</Text>
      </View>

      {activeTab === 'upcoming' && (
        <View style={styles.verificationSection}>
          <Text style={styles.verificationLabel}>Code:</Text>
          <Text style={styles.verificationCode}>{item.verificationCode}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={styles.emptyTitle}>
        {activeTab === 'upcoming' ? 'No Upcoming Bookings' : 'No Past Bookings'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'upcoming'
          ? 'Book a service to get started'
          : 'Your completed bookings will appear here'}
      </Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={() => navigation.navigate('HomeTab' as any)}>
          <Text style={styles.exploreButtonText}>Explore Shops</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}>
            Upcoming ({upcomingBookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}>
            Past ({pastBookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={displayBookings}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={['#4F46E5']}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  bookingNumber: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  servicesText: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  verificationLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 8,
  },
  verificationCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
    letterSpacing: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
