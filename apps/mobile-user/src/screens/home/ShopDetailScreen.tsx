import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {shopsApi} from '../../api/client';
import {Service, RootStackParamList} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'ShopDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ShopDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const {shopId} = route.params;

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const {data: shop, isLoading} = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopsApi.getById(shopId).then(res => res.data),
  });

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const selectedTotal = (shop?.services || [])
    .filter((s: Service) => selectedServices.includes(s.id))
    .reduce((sum: number, s: Service) => sum + Number(s.price), 0);

  const selectedDuration = (shop?.services || [])
    .filter((s: Service) => selectedServices.includes(s.id))
    .reduce((sum: number, s: Service) => sum + s.durationMinutes, 0);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Shop not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          {shop.coverPhotoUrl ? (
            <Image
              source={{uri: shop.coverPhotoUrl}}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.coverImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>
                {shop.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Shop Info */}
        <View style={styles.infoSection}>
          <Text style={styles.shopName}>{shop.name}</Text>
          <Text style={styles.shopAddress}>{shop.address}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.ratingText}>
                {shop.rating?.toFixed(1) || 'New'}
              </Text>
              <Text style={styles.reviewCount}>
                ({shop.reviewCount || 0} reviews)
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {backgroundColor: shop.isOpen ? '#10B981' : '#EF4444'},
              ]}>
              <Text style={styles.statusText}>
                {shop.isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          {shop.description && (
            <Text style={styles.description}>{shop.description}</Text>
          )}
        </View>

        {/* Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Services</Text>

          {(shop.services || []).map((service: Service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedServices.includes(service.id) && styles.serviceSelected,
              ]}
              onPress={() => toggleService(service.id)}
              activeOpacity={0.7}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                {service.description && (
                  <Text style={styles.serviceDesc} numberOfLines={2}>
                    {service.description}
                  </Text>
                )}
                <Text style={styles.serviceDuration}>
                  {service.durationMinutes} min
                </Text>
              </View>
              <View style={styles.servicePriceContainer}>
                <Text style={styles.servicePrice}>₹{service.price}</Text>
                <View
                  style={[
                    styles.checkbox,
                    selectedServices.includes(service.id) &&
                      styles.checkboxChecked,
                  ]}>
                  {selectedServices.includes(service.id) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spacer for bottom button */}
        <View style={{height: 100}} />
      </ScrollView>

      {/* Book Button */}
      {selectedServices.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>
              {selectedServices.length} service
              {selectedServices.length > 1 ? 's' : ''}
            </Text>
            <Text style={styles.totalAmount}>
              ₹{selectedTotal} • {selectedDuration} min
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() =>
              navigation.navigate('Booking', {
                shopId,
                selectedServices,
              })
            }>
            <Text style={styles.bookButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
  },
  imageContainer: {
    width: '100%',
    height: 220,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoSection: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    fontSize: 16,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  servicesSection: {
    backgroundColor: '#fff',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  serviceSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  serviceDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  serviceDuration: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  servicePriceContainer: {
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  bookButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
