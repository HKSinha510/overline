import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useQuery, useMutation} from '@tanstack/react-query';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {format, addDays, parseISO, isSameDay} from 'date-fns';
import {shopsApi, bookingsApi} from '../../api/client';
import {RootStackParamList, TimeSlot} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'Booking'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BookingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const {shopId, selectedServices = []} = route.params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Get shop info
  const {data: shop} = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopsApi.getById(shopId).then(res => res.data),
  });

  // Get availability for selected date
  const {data: availability, isLoading: loadingSlots} = useQuery({
    queryKey: ['availability', shopId, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () =>
      shopsApi
        .getAvailability(shopId, format(selectedDate, 'yyyy-MM-dd'))
        .then(res => res.data),
  });

  // Generate date options (next 14 days)
  const dateOptions = useMemo(() => {
    return Array.from({length: 14}, (_, i) => addDays(new Date(), i));
  }, []);

  // Create booking mutation
  const createBooking = useMutation({
    mutationFn: (data: {
      shopId: string;
      serviceIds: string[];
      startTime: string;
    }) => bookingsApi.create(data),
    onSuccess: data => {
      navigation.replace('BookingConfirmation', {
        bookingId: data.data.id,
      });
    },
    onError: (error: any) => {
      Alert.alert(
        'Booking Failed',
        error.response?.data?.message || 'Failed to create booking',
      );
    },
  });

  const handleConfirm = () => {
    if (!selectedTime) {
      Alert.alert('Error', 'Please select a time slot');
      return;
    }

    const startTime = `${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00.000Z`;

    createBooking.mutate({
      shopId,
      serviceIds: selectedServices,
      startTime,
    });
  };

  const timeSlots: TimeSlot[] = availability?.slots || [];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}>
            {dateOptions.map(date => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              return (
                <TouchableOpacity
                  key={date.toISOString()}
                  style={[
                    styles.dateCard,
                    isSelected && styles.dateCardSelected,
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}>
                  <Text
                    style={[
                      styles.dateDay,
                      isSelected && styles.dateDaySelected,
                    ]}>
                    {isToday ? 'Today' : format(date, 'EEE')}
                  </Text>
                  <Text
                    style={[
                      styles.dateNum,
                      isSelected && styles.dateNumSelected,
                    ]}>
                    {format(date, 'd')}
                  </Text>
                  <Text
                    style={[
                      styles.dateMonth,
                      isSelected && styles.dateMonthSelected,
                    ]}>
                    {format(date, 'MMM')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>

          {loadingSlots ? (
            <ActivityIndicator
              size="small"
              color="#4F46E5"
              style={{marginTop: 20}}
            />
          ) : timeSlots.length === 0 ? (
            <View style={styles.noSlots}>
              <Text style={styles.noSlotsText}>
                No available slots for this date
              </Text>
            </View>
          ) : (
            <View style={styles.timeGrid}>
              {timeSlots.map(slot => {
                const isSelected = selectedTime === slot.time;
                return (
                  <TouchableOpacity
                    key={slot.time}
                    style={[
                      styles.timeSlot,
                      !slot.available && styles.timeSlotUnavailable,
                      isSelected && styles.timeSlotSelected,
                    ]}
                    onPress={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}>
                    <Text
                      style={[
                        styles.timeText,
                        !slot.available && styles.timeTextUnavailable,
                        isSelected && styles.timeTextSelected,
                      ]}>
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Summary */}
        {shop && selectedServices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Summary</Text>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryShop}>{shop.name}</Text>
              {shop.services
                ?.filter((s: any) => selectedServices.includes(s.id))
                .map((service: any) => (
                  <View key={service.id} style={styles.summaryItem}>
                    <Text style={styles.summaryService}>{service.name}</Text>
                    <Text style={styles.summaryPrice}>₹{service.price}</Text>
                  </View>
                ))}
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotalPrice}>
                  ₹
                  {shop.services
                    ?.filter((s: any) => selectedServices.includes(s.id))
                    .reduce((sum: number, s: any) => sum + Number(s.price), 0)}
                </Text>
              </View>
              <Text style={styles.freeCashNote}>
                + You'll earn Free Cash on this booking!
              </Text>
            </View>
          </View>
        )}

        <View style={{height: 100}} />
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedTime || createBooking.isPending) &&
              styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedTime || createBooking.isPending}>
          {createBooking.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  dateList: {
    paddingRight: 16,
  },
  dateCard: {
    width: 70,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  dateCardSelected: {
    backgroundColor: '#4F46E5',
  },
  dateDay: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateDaySelected: {
    color: '#E0E7FF',
  },
  dateNum: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  dateNumSelected: {
    color: '#fff',
  },
  dateMonth: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dateMonthSelected: {
    color: '#E0E7FF',
  },
  noSlots: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  noSlotsText: {
    fontSize: 15,
    color: '#6B7280',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  timeSlot: {
    width: '23%',
    margin: '1%',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  timeSlotUnavailable: {
    backgroundColor: '#F9FAFB',
    opacity: 0.5,
  },
  timeSlotSelected: {
    backgroundColor: '#4F46E5',
  },
  timeText: {
    fontSize: 14,
    color: '#374151',
  },
  timeTextUnavailable: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  timeTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  summaryShop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryService: {
    fontSize: 14,
    color: '#374151',
  },
  summaryPrice: {
    fontSize: 14,
    color: '#374151',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotalPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  freeCashNote: {
    fontSize: 13,
    color: '#10B981',
    marginTop: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  confirmButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
