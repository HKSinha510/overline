import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useRoute, RouteProp} from '@react-navigation/native';
import {format} from 'date-fns';
import {bookingsApi} from '../../api/client';
import {RootStackParamList} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'BookingDetail'>;

export default function BookingDetailScreen() {
  const route = useRoute<RouteProps>();
  const queryClient = useQueryClient();
  const {bookingId} = route.params;

  const {data: booking, isLoading} = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsApi.getById(bookingId).then(res => res.data),
  });

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['booking', bookingId]});
      queryClient.invalidateQueries({queryKey: ['myBookings']});
      Alert.alert('Success', 'Booking cancelled successfully');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to cancel booking',
      );
    },
  });

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelMutation.mutate(),
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking not found</Text>
      </View>
    );
  }

  const canCancel = ['PENDING', 'CONFIRMED'].includes(booking.status);
  const isCompleted = booking.status === 'COMPLETED';
  const isCancelled = booking.status === 'CANCELLED';

  const statusColors: Record<string, string> = {
    PENDING: '#F59E0B',
    CONFIRMED: '#10B981',
    IN_PROGRESS: '#3B82F6',
    COMPLETED: '#10B981',
    CANCELLED: '#EF4444',
    NO_SHOW: '#6B7280',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Status Banner */}
      <View
        style={[
          styles.statusBanner,
          {backgroundColor: statusColors[booking.status] || '#6B7280'},
        ]}>
        <Text style={styles.statusText}>{booking.status.replace('_', ' ')}</Text>
        <Text style={styles.bookingNumber}>{booking.bookingNumber}</Text>
      </View>

      {/* Verification Code */}
      {!isCompleted && !isCancelled && (
        <View style={styles.codeSection}>
          <Text style={styles.codeLabel}>Verification Code</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{booking.verificationCode}</Text>
          </View>
          <Text style={styles.codeHint}>
            Show this code at the shop to start your service
          </Text>
        </View>
      )}

      {/* Shop Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop</Text>
        <View style={styles.card}>
          <Text style={styles.shopName}>{booking.shop?.name}</Text>
          <Text style={styles.shopAddress}>{booking.shop?.address}</Text>
          {booking.shop?.phone && (
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>
                📞 {booking.shop.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date & Time */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Date & Time</Text>
        <View style={styles.card}>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeIcon}>📅</Text>
              <View>
                <Text style={styles.dateTimeLabel}>Date</Text>
                <Text style={styles.dateTimeValue}>
                  {format(new Date(booking.startTime), 'EEEE, MMM d, yyyy')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <Text style={styles.dateTimeIcon}>🕐</Text>
              <View>
                <Text style={styles.dateTimeLabel}>Time</Text>
                <Text style={styles.dateTimeValue}>
                  {format(new Date(booking.startTime), 'h:mm a')} -{' '}
                  {format(new Date(booking.endTime), 'h:mm a')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services</Text>
        <View style={styles.card}>
          {booking.services?.map((service: any) => (
            <View key={service.id} style={styles.serviceRow}>
              <View>
                <Text style={styles.serviceName}>{service.serviceName}</Text>
                <Text style={styles.serviceDuration}>
                  {service.durationMinutes} min
                </Text>
              </View>
              <Text style={styles.servicePrice}>₹{service.price}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Payment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Subtotal</Text>
            <Text style={styles.paymentValue}>₹{booking.serviceAmount}</Text>
          </View>
          {Number(booking.freeCashAmount) > 0 && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Free Cash Earned</Text>
              <Text style={styles.freeCashValue}>
                +₹{booking.freeCashAmount}
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{booking.displayAmount}</Text>
          </View>
          <Text style={styles.paymentType}>
            Payment: {booking.paymentType === 'PAY_LATER' ? 'Pay at Store' : booking.paymentType}
          </Text>
        </View>
      </View>

      {/* Cancel Button */}
      {canCancel && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
          disabled={cancelMutation.isPending}>
          {cancelMutation.isPending ? (
            <ActivityIndicator color="#EF4444" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          )}
        </TouchableOpacity>
      )}

      <View style={{height: 40}} />
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  statusBanner: {
    padding: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  bookingNumber: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  codeSection: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  codeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  codeBox: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 12,
  },
  codeHint: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  callButtonText: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  dateTimeRow: {
    marginBottom: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  serviceName: {
    fontSize: 15,
    color: '#111827',
  },
  serviceDuration: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  paymentValue: {
    fontSize: 14,
    color: '#111827',
  },
  freeCashValue: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  paymentType: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  },
});
