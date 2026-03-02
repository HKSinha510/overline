import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {format} from 'date-fns';
import {walletApi} from '../../api/client';

interface WalletTransaction {
  id: string;
  type: 'EARNED' | 'SPENT' | 'EXPIRED' | 'REFERRAL';
  amount: number;
  description: string;
  createdAt: string;
  booking?: {
    bookingNumber: string;
    shop?: {
      name: string;
    };
  };
}

interface WalletData {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  transactions: WalletTransaction[];
}

export default function WalletScreen() {
  const {data, isLoading, refetch, isRefetching} = useQuery<WalletData>({
    queryKey: ['wallet'],
    queryFn: () => walletApi.get().then(res => res.data),
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'EARNED':
        return '💰';
      case 'SPENT':
        return '💳';
      case 'EXPIRED':
        return '⏰';
      case 'REFERRAL':
        return '🎁';
      default:
        return '💵';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'EARNED':
      case 'REFERRAL':
        return '#10B981';
      case 'SPENT':
      case 'EXPIRED':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderTransaction = ({item}: {item: WalletTransaction}) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionIcon}>
        <Text style={styles.iconText}>{getTransactionIcon(item.type)}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        {item.booking && (
          <Text style={styles.transactionMeta}>
            {item.booking.shop?.name} • {item.booking.bookingNumber}
          </Text>
        )}
        <Text style={styles.transactionDate}>
          {format(new Date(item.createdAt), 'MMM d, yyyy • h:mm a')}
        </Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          {color: getTransactionColor(item.type)},
        ]}>
        {item.type === 'EARNED' || item.type === 'REFERRAL' ? '+' : '-'}₹
        {item.amount}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceLabel}>Free Cash Balance</Text>
          <Text style={styles.balanceAmount}>₹{data?.balance || 0}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{data?.totalEarned || 0}</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>₹{data?.totalSpent || 0}</Text>
            <Text style={styles.statLabel}>Total Used</Text>
          </View>
        </View>
      </View>

      {/* How it works */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>How Free Cash Works</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✨</Text>
          <Text style={styles.infoText}>
            Earn 2% free cash on every booking
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🎁</Text>
          <Text style={styles.infoText}>
            Get ₹50 for every friend you refer
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>💳</Text>
          <Text style={styles.infoText}>
            Use free cash on your next booking
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>⏰</Text>
          <Text style={styles.infoText}>
            Free cash expires after 90 days
          </Text>
        </View>
      </View>

      {/* Transactions Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
      </View>
    </>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>💰</Text>
      <Text style={styles.emptyTitle}>No Transactions Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start booking to earn free cash rewards!
      </Text>
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
      <FlatList
        data={data?.transactions || []}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    padding: 16,
  },
  balanceCard: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
  },
  balanceHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
  },
  transactionMeta: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 40,
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
  },
});
