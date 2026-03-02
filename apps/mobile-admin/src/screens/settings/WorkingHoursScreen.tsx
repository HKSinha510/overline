import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useRoute, RouteProp} from '@react-navigation/native';
import {shopApi} from '../../api/client';
import {RootStackParamList, WorkingHours, DayHours} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'WorkingHours'>;

const DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

const TIME_SLOTS = [
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

const defaultDayHours: DayHours = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '21:00',
};

export default function WorkingHoursScreen() {
  const route = useRoute<RouteProps>();
  const queryClient = useQueryClient();
  const {shopId} = route.params;

  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: {...defaultDayHours},
    tuesday: {...defaultDayHours},
    wednesday: {...defaultDayHours},
    thursday: {...defaultDayHours},
    friday: {...defaultDayHours},
    saturday: {...defaultDayHours},
    sunday: {...defaultDayHours, isOpen: false},
  });
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const {data: shopData, isLoading} = useQuery({
    queryKey: ['adminShopHours', shopId],
    queryFn: () => shopApi.getWorkingHours(shopId).then(res => res.data),
    enabled: !!shopId,
  });

  useEffect(() => {
    if (shopData) {
      setWorkingHours(shopData);
    }
  }, [shopData]);

  const updateMutation = useMutation({
    mutationFn: async (hours: WorkingHours) => {
      // Update each day individually as the API expects per-day updates
      const promises = DAYS.map(day => {
        const dayHours = hours[day as keyof WorkingHours];
        if (dayHours) {
          return shopApi.updateWorkingHours(
            shopId,
            day.toUpperCase(),
            dayHours,
          );
        }
        return Promise.resolve();
      });
      await Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['adminShop', shopId]});
      Alert.alert('Success', 'Working hours updated');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update working hours',
      );
    },
  });

  const handleToggleDay = (day: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WorkingHours],
        isOpen: !prev[day as keyof WorkingHours]?.isOpen,
      },
    }));
  };

  const handleTimeChange = (
    day: string,
    field: 'openTime' | 'closeTime',
    time: string,
  ) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day as keyof WorkingHours],
        [field]: time,
      },
    }));
  };

  const handleSave = () => {
    updateMutation.mutate(workingHours);
  };

  const formatDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Set your shop's operating hours for each day of the week
          </Text>

          {DAYS.map(day => {
            const dayHours = workingHours[day as keyof WorkingHours];
            const isExpanded = expandedDay === day;

            return (
              <View key={day} style={styles.dayCard}>
                <TouchableOpacity
                  style={styles.dayHeader}
                  onPress={() => setExpandedDay(isExpanded ? null : day)}>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayName}>{formatDay(day)}</Text>
                    <Text style={styles.dayHours}>
                      {dayHours?.isOpen
                        ? `${formatTime(dayHours.openTime)} - ${formatTime(
                            dayHours.closeTime,
                          )}`
                        : 'Closed'}
                    </Text>
                  </View>
                  <View style={styles.dayToggle}>
                    <Switch
                      value={dayHours?.isOpen}
                      onValueChange={() => handleToggleDay(day)}
                      trackColor={{false: '#E5E7EB', true: '#C7D2FE'}}
                      thumbColor={dayHours?.isOpen ? '#4F46E5' : '#9CA3AF'}
                    />
                  </View>
                </TouchableOpacity>

                {isExpanded && dayHours?.isOpen && (
                  <View style={styles.dayDetails}>
                    <View style={styles.timeSection}>
                      <Text style={styles.timeLabel}>Opens at</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.timeScroll}>
                        {TIME_SLOTS.map(time => (
                          <TouchableOpacity
                            key={`open-${time}`}
                            style={[
                              styles.timeChip,
                              dayHours.openTime === time &&
                                styles.timeChipSelected,
                            ]}
                            onPress={() =>
                              handleTimeChange(day, 'openTime', time)
                            }>
                            <Text
                              style={[
                                styles.timeChipText,
                                dayHours.openTime === time &&
                                  styles.timeChipTextSelected,
                              ]}>
                              {formatTime(time)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    <View style={styles.timeSection}>
                      <Text style={styles.timeLabel}>Closes at</Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.timeScroll}>
                        {TIME_SLOTS.filter(
                          time => time > (dayHours.openTime || '00:00'),
                        ).map(time => (
                          <TouchableOpacity
                            key={`close-${time}`}
                            style={[
                              styles.timeChip,
                              dayHours.closeTime === time &&
                                styles.timeChipSelected,
                            ]}
                            onPress={() =>
                              handleTimeChange(day, 'closeTime', time)
                            }>
                            <Text
                              style={[
                                styles.timeChipText,
                                dayHours.closeTime === time &&
                                  styles.timeChipTextSelected,
                              ]}>
                              {formatTime(time)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            updateMutation.isPending && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Working Hours</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center',
  },
  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  dayHours: {
    fontSize: 14,
    color: '#6B7280',
  },
  dayToggle: {
    // Empty
  },
  dayDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  timeSection: {
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  timeScroll: {
    flexDirection: 'row',
  },
  timeChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  timeChipSelected: {
    backgroundColor: '#4F46E5',
  },
  timeChipText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  timeChipTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
