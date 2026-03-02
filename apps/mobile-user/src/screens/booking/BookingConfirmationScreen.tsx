import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {format} from 'date-fns';
import {bookingsApi} from '../../api/client';
import {RootStackParamList} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'BookingConfirmation'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookingConfirmationScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const {bookingId} = route.params;

  const {data: booking} = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getById(bookingId).then(res => res.data),
  });

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    });
  };

  if (!booking) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.successEmoji}>✓</Text>
        </View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your appointment has been booked successfully
        </Text>

        <View style={styles.bookingCard}>
          <Text style={styles.bookingNumber}>{booking.bookingNumber}</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shop</Text>
            <Text style={styles.detailValue}>{booking.shop?.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {format(new Date(booking.startTime), 'EEEE, MMM d')}
              {'\n'}
              {format(new Date(booking.startTime), 'h:mm a')}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Services</Text>
            <Text style={styles.detailValue}>
              {booking.services?.map((s: any) => s.serviceName).join('\n')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.codeSection}>
            <Text style={styles.codeLabel}>Your Verification Code</Text>
            <View style={styles.codeBox}>
              <Text style={styles.codeText}>{booking.verificationCode}</Text>
            </View>
            <Text style={styles.codeHint}>
              Show this code at the shop to start your service
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{booking.displayAmount}</Text>
          </View>

          {Number(booking.freeCashAmount) > 0 && (
            <Text style={styles.freeCashNote}>
              You'll earn ₹{booking.freeCashAmount} Free Cash after service!
            </Text>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.replace('BookingDetail', {bookingId})}>
          <Text style={styles.viewButtonText}>View Booking Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={goHome}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successEmoji: {
    fontSize: 40,
    color: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 32,
  },
  bookingCard: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  bookingNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  codeSection: {
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  freeCashNote: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    paddingBottom: 36,
  },
  viewButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#6B7280',
    fontSize: 15,
  },
});
