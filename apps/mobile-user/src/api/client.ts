import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// Configure API base URL
const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const API_BASE_URL = __DEV__
  ? `http://${DEV_HOST}:3001/api/v1` // Local dev server
  : 'https://overline-backend.up.railway.app/api/v1'; // Production

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      // Navigation to login will be handled by auth state
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
};

// Shops API
export const shopsApi = {
  list: (params?: { city?: string; lat?: number; lng?: number; search?: string }) =>
    api.get('/shops', { params }),
  getById: (id: string) => api.get(`/shops/${id}`),
  getServices: (shopId: string) => api.get(`/shops/${shopId}/services`),
  getAvailability: (shopId: string, date: string) =>
    api.get(`/shops/${shopId}/availability`, { params: { date } }),
  getReviews: (shopId: string) => api.get(`/shops/${shopId}/reviews`),
};

// Bookings API
export const bookingsApi = {
  create: (data: { shopId: string; serviceIds: string[]; startTime: string }) =>
    api.post('/bookings', data),
  createGuest: (data: {
    shopId: string;
    serviceIds: string[];
    startTime: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
  }) => api.post('/bookings/guest', data),
  getMy: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings/my', { params }),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
  lookup: (bookingNumber: string) =>
    api.get(`/bookings/lookup/${bookingNumber}`),
};

// Wallet API
export const walletApi = {
  get: () => api.get('/wallet'),
  getBalance: () => api.get('/wallet/balance'),
  getHistory: (params?: { page?: number; limit?: number }) =>
    api.get('/wallet/history', { params }),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: { name?: string; phone?: string }) =>
    api.patch('/users/profile', data),
  updatePushToken: (token: string, platform: string) =>
    api.post('/users/push-token', { token, platform }),
};
