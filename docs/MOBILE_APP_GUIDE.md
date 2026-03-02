# Overline Mobile App Development Guide

This guide covers building **two separate mobile apps** using React Native:
1. **User App** - For customers to book appointments
2. **Admin App** - For shop owners/staff to manage bookings

Both apps connect to the same backend API already deployed.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [User App Features](#user-app-features)
5. [Admin App Features](#admin-app-features)
6. [API Integration](#api-integration)
7. [Authentication Flow](#authentication-flow)
8. [Push Notifications](#push-notifications)
9. [Building & Deployment](#building--deployment)

---

## Prerequisites

### Install Required Tools

```bash
# Install Node.js 18+ (already have)
# Install Watchman (macOS)
brew install watchman

# Install Java JDK 17 for Android
brew install openjdk@17
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc

# Install Android Studio
# Download from: https://developer.android.com/studio
# After install, open Android Studio > Settings > SDK Manager
# Install: Android SDK Platform 34, Android SDK Build-Tools

# Set Android environment variables
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/emulator' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc
source ~/.zshrc

# For iOS (optional, macOS only)
xcode-select --install
sudo gem install cocoapods
```

---

## Project Structure

Add mobile apps to your monorepo:

```
Overline/
├── apps/
│   ├── backend/           # Existing NestJS backend
│   ├── admin-web/         # Existing admin web
│   ├── user-web/          # Existing user web
│   ├── mobile-user/       # NEW: React Native User App
│   └── mobile-admin/      # NEW: React Native Admin App
├── packages/
│   └── shared/            # Shared types (reuse in mobile)
└── pnpm-workspace.yaml
```

---

## Setup Instructions

### Step 1: Create User Mobile App

```bash
cd /Users/manrajgupta/Overline

# Create React Native app with TypeScript
npx react-native@latest init OverlineUser --template react-native-template-typescript

# Move to apps folder
mv OverlineUser apps/mobile-user

# Navigate to app
cd apps/mobile-user

# Install essential dependencies
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install @tanstack/react-query axios
npm install react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install date-fns
npm install zustand  # State management (same as web)

# For iOS
cd ios && pod install && cd ..
```

### Step 2: Create Admin Mobile App

```bash
cd /Users/manrajgupta/Overline

# Create Admin app
npx react-native@latest init OverlineAdmin --template react-native-template-typescript

mv OverlineAdmin apps/mobile-admin

cd apps/mobile-admin

# Install same dependencies
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-gesture-handler react-native-reanimated
npm install @tanstack/react-query axios
npm install react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install date-fns zustand socket.io-client

cd ios && pod install && cd ..
```

### Step 3: Update pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'apps/mobile-user'
  - 'apps/mobile-admin'
```

---

## User App Features

### Screens to Build

| Screen | Route | Description |
|--------|-------|-------------|
| Splash | `/` | App loading with logo |
| Login | `/login` | Phone/email login |
| Register | `/register` | Create account |
| Home | `/home` | Nearby shops, search |
| Shop Details | `/shop/:id` | Services, reviews, book |
| Booking | `/book/:shopId` | Select service, time, confirm |
| My Bookings | `/bookings` | Upcoming/past bookings |
| Booking Details | `/booking/:id` | Status, verification code |
| Profile | `/profile` | User settings, wallet |
| Wallet | `/wallet` | Free cash balance, history |

### User App File Structure

```
apps/mobile-user/
├── src/
│   ├── api/
│   │   └── client.ts         # Axios instance
│   ├── components/
│   │   ├── ShopCard.tsx
│   │   ├── ServiceItem.tsx
│   │   ├── BookingCard.tsx
│   │   └── TimeSlotPicker.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useShops.ts
│   │   └── useBookings.ts
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── ShopDetailScreen.tsx
│   │   ├── booking/
│   │   │   ├── BookingScreen.tsx
│   │   │   └── BookingDetailScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── WalletScreen.tsx
│   ├── stores/
│   │   └── authStore.ts
│   └── types/
│       └── index.ts          # Copy from packages/shared
├── App.tsx
└── index.js
```

### Example: API Client (apps/mobile-user/src/api/client.ts)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api/v1'  // Dev
  : 'https://your-production-api.com/api/v1';  // Prod

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      await AsyncStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

// API functions
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  signup: (data: { name: string; email: string; password: string; phone: string }) =>
    api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
};

export const shopsApi = {
  list: (params?: { city?: string; lat?: number; lng?: number }) =>
    api.get('/shops', { params }),
  getById: (id: string) => api.get(`/shops/${id}`),
  getServices: (shopId: string) => api.get(`/shops/${shopId}/services`),
  getAvailability: (shopId: string, date: string) =>
    api.get(`/shops/${shopId}/availability`, { params: { date } }),
};

export const bookingsApi = {
  create: (data: { shopId: string; serviceIds: string[]; startTime: string }) =>
    api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};

export const walletApi = {
  getBalance: () => api.get('/wallet/balance'),
  getHistory: () => api.get('/wallet/history'),
};
```

### Example: Auth Store (apps/mobile-user/src/stores/authStore.ts)

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/client';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await authApi.login(email, password);
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        set({ isLoading: false });
        return;
      }
      const { data } = await authApi.me();
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
```

### Example: Home Screen (apps/mobile-user/src/screens/home/HomeScreen.tsx)

```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { shopsApi } from '../../api/client';
import { useNavigation } from '@react-navigation/native';

interface Shop {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  distance?: number;
}

export function HomeScreen() {
  const navigation = useNavigation();
  
  const { data: shops, isLoading, refetch } = useQuery({
    queryKey: ['shops'],
    queryFn: () => shopsApi.list().then(res => res.data.data),
  });

  const renderShop = ({ item }: { item: Shop }) => (
    <TouchableOpacity
      style={styles.shopCard}
      onPress={() => navigation.navigate('ShopDetail', { shopId: item.id })}
    >
      <Text style={styles.shopName}>{item.name}</Text>
      <Text style={styles.shopAddress}>{item.address}</Text>
      <View style={styles.ratingRow}>
        <Text>⭐ {item.rating?.toFixed(1) || 'New'}</Text>
        <Text style={styles.reviews}>({item.reviewCount || 0} reviews)</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Salons</Text>
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={renderShop}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 16 },
  list: { padding: 16, paddingTop: 0 },
  shopCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  shopName: { fontSize: 18, fontWeight: '600' },
  shopAddress: { color: '#666', marginTop: 4 },
  ratingRow: { flexDirection: 'row', marginTop: 8 },
  reviews: { color: '#666', marginLeft: 8 },
});
```

---

## Admin App Features

### Screens to Build

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/login` | Owner/staff login |
| Dashboard | `/dashboard` | Today's stats, queue |
| Queue | `/queue` | Live queue management |
| Bookings | `/bookings` | All bookings list |
| Verify Code | `/verify` | Enter customer code |
| Services | `/services` | Manage services |
| Staff | `/staff` | Manage staff |
| Settings | `/settings` | Shop settings |
| Notifications | `/notifications` | Alerts, updates |

### Admin App File Structure

```
apps/mobile-admin/
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── BookingCard.tsx
│   │   ├── QueueItem.tsx
│   │   ├── StatsCard.tsx
│   │   └── VerifyCodeInput.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useBookings.ts
│   │   └── useQueueSocket.ts
│   ├── navigation/
│   │   └── RootNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   └── LoginScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── bookings/
│   │   │   ├── BookingsScreen.tsx
│   │   │   └── VerifyCodeScreen.tsx
│   │   ├── services/
│   │   │   └── ServicesScreen.tsx
│   │   └── settings/
│   │       └── SettingsScreen.tsx
│   ├── stores/
│   │   └── authStore.ts
│   └── types/
│       └── index.ts
├── App.tsx
└── index.js
```

### Example: Admin API Client

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3001/api/v1'
  : 'https://your-production-api.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Admin-specific API endpoints
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (period: string) => 
    api.get('/admin/analytics', { params: { period } }),

  // Bookings
  getBookings: (params?: { status?: string; date?: string }) =>
    api.get('/admin/bookings', { params }),
  verifyCode: (bookingId: string, code: string) =>
    api.post(`/bookings/${bookingId}/verify-code`, { code }),
  completeService: (bookingId: string) =>
    api.post(`/bookings/${bookingId}/complete`),
  
  // Services
  getServices: () => api.get('/admin/services'),
  createService: (data: any) => api.post('/admin/services', data),
  updateService: (id: string, data: any) => api.patch(`/admin/services/${id}`, data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`),

  // Staff
  getStaff: () => api.get('/admin/staff'),
  createStaff: (data: any) => api.post('/admin/staff', data),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.patch('/admin/settings', data),
};
```

### Example: Dashboard Screen

```typescript
import React from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../api/client';

export function DashboardScreen() {
  const { data: dashboard, isLoading, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => adminApi.getDashboard().then(res => res.data),
    refetchInterval: 30000, // Auto-refresh every 30s
  });

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
    >
      <Text style={styles.header}>Today's Overview</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboard?.todayBookings || 0}</Text>
          <Text style={styles.statLabel}>Bookings Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboard?.queueLength || 0}</Text>
          <Text style={styles.statLabel}>In Queue</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>₹{dashboard?.todayRevenue || 0}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dashboard?.completedToday || 0}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      <Text style={styles.sectionHeader}>Upcoming Bookings</Text>
      {dashboard?.upcomingBookings?.map((booking: any) => (
        <View key={booking.id} style={styles.bookingCard}>
          <Text style={styles.bookingTime}>
            {new Date(booking.startTime).toLocaleTimeString()}
          </Text>
          <Text style={styles.bookingName}>{booking.customerName || booking.user?.name}</Text>
          <Text style={styles.bookingService}>
            {booking.services?.map((s: any) => s.serviceName).join(', ')}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { fontSize: 24, fontWeight: 'bold', padding: 16 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 8 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: '#4F46E5' },
  statLabel: { color: '#666', marginTop: 4 },
  sectionHeader: { fontSize: 18, fontWeight: '600', padding: 16, paddingBottom: 8 },
  bookingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
  },
  bookingTime: { fontSize: 16, fontWeight: '600' },
  bookingName: { marginTop: 4 },
  bookingService: { color: '#666', marginTop: 4 },
});
```

### Example: Verify Code Screen

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { adminApi } from '../../api/client';

export function VerifyCodeScreen() {
  const [bookingNumber, setBookingNumber] = useState('');
  const [code, setCode] = useState('');
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const lookupBooking = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/bookings/lookup/${bookingNumber}`);
      setBooking(data);
    } catch (error) {
      Alert.alert('Error', 'Booking not found');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!booking) return;
    try {
      setIsLoading(true);
      await adminApi.verifyCode(booking.id, code);
      Alert.alert('Success', 'Service started! Code verified.');
      setBooking({ ...booking, serviceStatus: 'IN_SERVICE' });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid code');
    } finally {
      setIsLoading(false);
    }
  };

  const completeService = async () => {
    if (!booking) return;
    try {
      setIsLoading(true);
      await adminApi.completeService(booking.id);
      Alert.alert('Success', 'Service completed! Free cash credited.');
      setBooking(null);
      setCode('');
      setBookingNumber('');
    } catch (error) {
      Alert.alert('Error', 'Failed to complete service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Verify Customer</Text>

      {!booking ? (
        <>
          <Text style={styles.label}>Booking Number</Text>
          <TextInput
            style={styles.input}
            placeholder="OL-XXXXXXXX-XXXX"
            value={bookingNumber}
            onChangeText={setBookingNumber}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={styles.button}
            onPress={lookupBooking}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Find Booking</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.bookingInfo}>
            <Text style={styles.customerName}>
              {booking.customerName || booking.user?.name}
            </Text>
            <Text>{booking.services?.map((s: any) => s.serviceName).join(', ')}</Text>
            <Text style={styles.amount}>₹{booking.totalAmount}</Text>
            <Text style={styles.status}>Status: {booking.serviceStatus}</Text>
          </View>

          {booking.serviceStatus === 'AWAITING_CODE' && (
            <>
              <Text style={styles.label}>Enter 4-Digit Code</Text>
              <TextInput
                style={[styles.input, styles.codeInput]}
                placeholder="0000"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={4}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={verifyCode}
                disabled={isLoading || code.length !== 4}
              >
                <Text style={styles.buttonText}>Start Service</Text>
              </TouchableOpacity>
            </>
          )}

          {booking.serviceStatus === 'IN_SERVICE' && (
            <TouchableOpacity
              style={[styles.button, styles.completeButton]}
              onPress={completeService}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Complete Service</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => { setBooking(null); setCode(''); }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  label: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  codeInput: { fontSize: 32, textAlign: 'center', letterSpacing: 8 },
  button: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: { backgroundColor: '#10B981' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bookingInfo: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  customerName: { fontSize: 20, fontWeight: '600' },
  amount: { fontSize: 24, fontWeight: 'bold', marginTop: 8 },
  status: { color: '#666', marginTop: 8 },
  cancelButton: { marginTop: 16, alignItems: 'center' },
  cancelText: { color: '#666' },
});
```

---

## API Integration

Your existing backend already supports all needed endpoints:

### User App Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | Register user |
| `/auth/login` | POST | Login |
| `/auth/me` | GET | Get current user |
| `/shops` | GET | List shops |
| `/shops/:id` | GET | Shop details |
| `/shops/:id/availability` | GET | Time slots |
| `/bookings` | POST | Create booking |
| `/bookings/my` | GET | User's bookings |
| `/bookings/:id/cancel` | PATCH | Cancel booking |
| `/wallet/balance` | GET | Free cash balance |

### Admin App Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Owner/staff login |
| `/admin/dashboard` | GET | Dashboard stats |
| `/admin/bookings` | GET | Shop bookings |
| `/bookings/:id/verify-code` | POST | Verify customer code |
| `/bookings/:id/complete` | POST | Complete service |
| `/admin/services` | GET/POST | Manage services |
| `/admin/staff` | GET/POST | Manage staff |
| `/admin/settings` | GET/PATCH | Shop settings |

---

## Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   App Start  │────>│ Check Token  │────>│ Valid Token? │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                          ┌───────────────────────┼───────────────────────┐
                          │ No                    │                   Yes │
                          ▼                       ▼                       ▼
                   ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
                   │ Login Screen │       │ Call /auth/me│       │  Home Screen │
                   └──────┬───────┘       └──────┬───────┘       └──────────────┘
                          │                      │
                          ▼                      ▼
                   ┌──────────────┐       ┌──────────────┐
                   │ POST /login  │       │ Store User   │
                   └──────┬───────┘       └──────┬───────┘
                          │                      │
                          ▼                      ▼
                   ┌──────────────┐       ┌──────────────┐
                   │ Store Tokens │──────>│  Home Screen │
                   └──────────────┘       └──────────────┘
```

---

## Push Notifications

Install Firebase for push notifications:

```bash
# In both mobile apps
npm install @react-native-firebase/app @react-native-firebase/messaging

# iOS
cd ios && pod install && cd ..
```

### Setup Firebase
1. Create project at https://console.firebase.google.com
2. Add Android app (package: com.overlineuser / com.overlineadmin)
3. Download `google-services.json` → `android/app/`
4. Add iOS app
5. Download `GoogleService-Info.plist` → `ios/OverlineUser/`

### Notification Handler

```typescript
// src/services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';

export async function requestNotificationPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  
  if (enabled) {
    const token = await messaging().getToken();
    // Send token to backend
    await api.post('/users/push-token', { token, platform: 'android' });
    await AsyncStorage.setItem('pushToken', token);
  }
  return enabled;
}

export function setupNotificationHandlers() {
  // Foreground messages
  messaging().onMessage(async (message) => {
    console.log('Notification:', message);
    // Show local notification
  });

  // Background/quit state
  messaging().setBackgroundMessageHandler(async (message) => {
    console.log('Background notification:', message);
  });
}
```

---

## Building & Deployment

### Development

```bash
# Run User App
cd apps/mobile-user
npx react-native start
# In another terminal:
npx react-native run-android
# OR for iOS:
npx react-native run-ios

# Run Admin App
cd apps/mobile-admin
npx react-native start --port 8082
npx react-native run-android
```

### Production Build - Android

```bash
cd apps/mobile-user/android

# Generate release keystore (once)
keytool -genkeypair -v -storetype PKCS12 -keystore overline-user.keystore -alias overline-user -keyalg RSA -keysize 2048 -validity 10000

# Add to gradle.properties
MYAPP_UPLOAD_STORE_FILE=overline-user.keystore
MYAPP_UPLOAD_KEY_ALIAS=overline-user
MYAPP_UPLOAD_STORE_PASSWORD=your-password
MYAPP_UPLOAD_KEY_PASSWORD=your-password

# Build APK
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Production Build - iOS

```bash
cd apps/mobile-user/ios

# Open in Xcode
open OverlineUser.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device" as target
# 2. Product > Archive
# 3. Distribute App > App Store Connect
```

### Play Store Submission
1. Create app at https://play.google.com/console
2. Upload AAB file
3. Fill store listing, screenshots
4. Submit for review

### App Store Submission
1. Create app at https://appstoreconnect.apple.com
2. Upload via Xcode or Transporter
3. Fill metadata, screenshots
4. Submit for review

---

## Quick Start Commands

```bash
# 1. Create apps
cd /Users/manrajgupta/Overline
npx react-native@latest init OverlineUser --template react-native-template-typescript
mv OverlineUser apps/mobile-user

npx react-native@latest init OverlineAdmin --template react-native-template-typescript  
mv OverlineAdmin apps/mobile-admin

# 2. Install deps (run in each app folder)
cd apps/mobile-user
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated @tanstack/react-query axios @react-native-async-storage/async-storage zustand date-fns

# 3. Run
npx react-native start
npx react-native run-android
```

---

## Summary

| App | Target Users | Key Features |
|-----|-------------|--------------|
| **User App** | Customers | Browse shops, book services, view wallet, manage bookings |
| **Admin App** | Shop owners/staff | Dashboard, verify codes, manage queue, services, settings |

Both apps use the **same backend API** at `https://your-domain.com/api/v1`.

The shared `packages/shared` types can be copied or linked to mobile apps for type safety.
