import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Image,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {shopsApi} from '../../api/client';
import {Shop, RootStackParamList} from '../../types';
import {SafeAreaView} from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: shopsData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['shops', searchQuery],
    queryFn: () =>
      shopsApi.list({search: searchQuery || undefined}).then(res => res.data),
  });

  const shops: Shop[] = shopsData?.data || [];

  const renderShop = ({item}: {item: Shop}) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate('ShopDetail', {shopId: item.id})}
      activeOpacity={0.8}>
      <View style={styles.shopImageContainer}>
        {item.coverPhotoUrl ? (
          <Image
            source={{uri: item.coverPhotoUrl}}
            style={styles.shopImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.shopImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.isOpen && (
          <View style={styles.openBadge}>
            <Text style={styles.openBadgeText}>Open</Text>
          </View>
        )}
      </View>

      <View style={styles.shopInfo}>
        <Text style={styles.shopName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.shopAddress} numberOfLines={1}>
          {item.address}
        </Text>

        <View style={styles.shopMeta}>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>⭐</Text>
            <Text style={styles.ratingText}>
              {item.rating?.toFixed(1) || 'New'}
            </Text>
            <Text style={styles.reviewCount}>({item.reviewCount || 0})</Text>
          </View>

          {item.distance !== undefined && (
            <Text style={styles.distance}>
              {item.distance < 1
                ? `${(item.distance * 1000).toFixed(0)}m`
                : `${item.distance.toFixed(1)}km`}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>
          Find salons & spas near you
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search salons, services..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={shops}
        keyExtractor={item => item.id}
        renderItem={renderShop}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={['#4F46E5']}
            tintColor="#4F46E5"
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No salons found</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'No salons available in your area'}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    fontSize: 16,
    color: '#9CA3AF',
    padding: 4,
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  shopCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  shopImageContainer: {
    position: 'relative',
  },
  shopImage: {
    width: '100%',
    height: 160,
  },
  placeholderImage: {
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  openBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  shopInfo: {
    padding: 16,
  },
  shopName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  shopAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  shopMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingStar: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  reviewCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
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
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
