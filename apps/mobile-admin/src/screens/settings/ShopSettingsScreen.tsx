import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {useRoute, RouteProp} from '@react-navigation/native';
import {shopApi} from '../../api/client';
import {RootStackParamList, ShopFormData} from '../../types';

type RouteProps = RouteProp<RootStackParamList, 'ShopSettings'>;

export default function ShopSettingsScreen() {
  const route = useRoute<RouteProps>();
  const queryClient = useQueryClient();
  const {shopId} = route.params;

  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {data: shop, isLoading} = useQuery({
    queryKey: ['adminShop', shopId],
    queryFn: () => shopApi.getById(shopId).then(res => res.data),
    enabled: !!shopId,
  });

  useEffect(() => {
    if (shop) {
      setFormData({
        name: shop.name || '',
        description: shop.description || '',
        address: shop.address || '',
        city: shop.city || '',
        phone: shop.phone || '',
        email: shop.email || '',
      });
    }
  }, [shop]);

  const updateMutation = useMutation({
    mutationFn: (data: ShopFormData) => shopApi.update(shopId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['adminShop', shopId]});
      queryClient.invalidateQueries({queryKey: ['adminProfile']});
      Alert.alert('Success', 'Shop details updated');
    },
    onError: (error: any) => {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update shop',
      );
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Shop name is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.form}>
        {/* Shop Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Shop Name *</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={formData.name}
            onChangeText={text => setFormData({...formData, name: text})}
            placeholder="Enter shop name"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={text => setFormData({...formData, description: text})}
            placeholder="Describe your shop and services"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, errors.address && styles.inputError]}
            value={formData.address}
            onChangeText={text => setFormData({...formData, address: text})}
            placeholder="Full street address"
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* City */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={[styles.input, errors.city && styles.inputError]}
            value={formData.city}
            onChangeText={text => setFormData({...formData, city: text})}
            placeholder="City"
          />
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={formData.phone}
            onChangeText={text => setFormData({...formData, phone: text})}
            placeholder="Contact phone number"
            keyboardType="phone-pad"
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={formData.email}
            onChangeText={text => setFormData({...formData, email: text})}
            placeholder="Shop email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Shop Info Display */}
        {shop && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Shop Statistics</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rating</Text>
              <Text style={styles.infoValue}>
                ⭐ {shop.rating?.toFixed(1) || 'N/A'} ({shop.totalReviews || 0}{' '}
                reviews)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text
                style={[
                  styles.infoValue,
                  {color: shop.isActive ? '#10B981' : '#EF4444'},
                ]}>
                {shop.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            updateMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={updateMutation.isPending}>
          {updateMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
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
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
