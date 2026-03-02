import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {useAuthStore} from '../../stores/authStore';
import {userApi} from '../../api/client';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  referralCode: string;
  walletBalance: number;
  totalBookings: number;
  createdAt: string;
}

export default function ProfileScreen() {
  const {user, logout} = useAuthStore();

  const {data: profile, isLoading} = useQuery<UserProfile>({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile().then(res => res.data),
  });

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleShareReferral = async () => {
    try {
      await Share.share({
        message: `Join Overline and get ₹50 free cash! Use my referral code: ${profile?.referralCode}. Download now: https://overline.app`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleContact = () => {
    Linking.openURL('mailto:support@overline.app');
  };

  const handleAbout = () => {
    Linking.openURL('https://overline.app/about');
  };

  const handleTerms = () => {
    Linking.openURL('https://overline.app/terms');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://overline.app/privacy');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(profile?.name || user?.name || 'U').charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.name || user?.name}</Text>
        <Text style={styles.email}>{profile?.email || user?.email}</Text>
        {profile?.phone && <Text style={styles.phone}>{profile.phone}</Text>}
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>₹{profile?.walletBalance || 0}</Text>
          <Text style={styles.statLabel}>Free Cash</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile?.totalBookings || 0}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>

      {/* Referral Card */}
      {profile?.referralCode && (
        <View style={styles.referralCard}>
          <View style={styles.referralHeader}>
            <Text style={styles.referralTitle}>Invite & Earn</Text>
            <Text style={styles.referralSubtitle}>
              Share your code and get ₹50 when a friend books!
            </Text>
          </View>
          <View style={styles.referralCodeBox}>
            <Text style={styles.referralCode}>{profile.referralCode}</Text>
          </View>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleShareReferral}>
            <Text style={styles.shareButtonText}>Share Referral Code</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Menu Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>Edit Profile</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔔</Text>
          <Text style={styles.menuText}>Notifications</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📍</Text>
          <Text style={styles.menuText}>Saved Addresses</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
          <Text style={styles.menuIcon}>💬</Text>
          <Text style={styles.menuText}>Contact Support</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>❓</Text>
          <Text style={styles.menuText}>FAQs</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⭐</Text>
          <Text style={styles.menuText}>Rate the App</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
          <Text style={styles.menuIcon}>ℹ️</Text>
          <Text style={styles.menuText}>About Overline</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>

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
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  referralCard: {
    backgroundColor: '#4F46E5',
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  referralHeader: {
    marginBottom: 16,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  referralSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  referralCodeBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  referralCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 2,
  },
  shareButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#4F46E5',
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 28,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 24,
  },
});
