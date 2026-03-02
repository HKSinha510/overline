import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL - update this for production
const BASE_URL = __DEV__
  ? 'http://10.0.2.2:3001/api/v1' // Android emulator
  : 'https://your-production-url.com/api/v1';

// Create axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('admin_token');
      // Navigate to login will be handled by auth store
    }
    return Promise.reject(error);
  },
);

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/admin/auth/login', {email, password}),
  verifyOtp: (email: string, otp: string) =>
    apiClient.post('/admin/auth/verify-otp', {email, otp}),
  getProfile: () => apiClient.get('/admin/profile'),
  logout: () => apiClient.post('/admin/auth/logout'),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: (shopId?: string) =>
    apiClient.get('/admin/dashboard/stats', {params: {shopId}}),
  getRecentBookings: (shopId?: string, limit = 10) =>
    apiClient.get('/admin/dashboard/recent-bookings', {
      params: {shopId, limit},
    }),
  getTodayBookings: (shopId?: string) =>
    apiClient.get('/admin/dashboard/today-bookings', {params: {shopId}}),
};

// Bookings APIs
export const bookingsApi = {
  getAll: (params?: {
    shopId?: string;
    status?: string;
    date?: string;
    page?: number;
    limit?: number;
  }) => apiClient.get('/admin/bookings', {params}),
  getById: (id: string) => apiClient.get(`/admin/bookings/${id}`),
  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/admin/bookings/${id}/status`, {status}),
  verifyCode: (shopId: string, code: string) =>
    apiClient.post('/admin/bookings/verify', {shopId, code}),
  startService: (bookingId: string) =>
    apiClient.post(`/admin/bookings/${bookingId}/start`),
  completeService: (bookingId: string) =>
    apiClient.post(`/admin/bookings/${bookingId}/complete`),
  cancelBooking: (bookingId: string, reason?: string) =>
    apiClient.post(`/admin/bookings/${bookingId}/cancel`, {reason}),
  markNoShow: (bookingId: string) =>
    apiClient.post(`/admin/bookings/${bookingId}/no-show`),
};

// Services APIs
export const servicesApi = {
  getAll: (shopId: string) =>
    apiClient.get('/admin/services', {params: {shopId}}),
  create: (data: {
    shopId: string;
    name: string;
    price: number;
    durationMinutes: number;
    description?: string;
  }) => apiClient.post('/admin/services', data),
  update: (
    id: string,
    data: {
      name?: string;
      price?: number;
      durationMinutes?: number;
      description?: string;
      isActive?: boolean;
    },
  ) => apiClient.patch(`/admin/services/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/services/${id}`),
  toggleActive: (id: string) =>
    apiClient.post(`/admin/services/${id}/toggle-active`),
};

// Shop APIs
export const shopApi = {
  getMyShops: () => apiClient.get('/admin/shops/mine'),
  getById: (id: string) => apiClient.get(`/admin/shops/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/admin/shops/${id}`, data),
  updateWorkingHours: (id: string, workingHours: any) =>
    apiClient.patch(`/admin/shops/${id}/working-hours`, {workingHours}),
  uploadPhoto: (id: string, formData: FormData) =>
    apiClient.post(`/admin/shops/${id}/photos`, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
    }),
  deletePhoto: (shopId: string, photoId: string) =>
    apiClient.delete(`/admin/shops/${shopId}/photos/${photoId}`),
};

// Staff APIs
export const staffApi = {
  getAll: (shopId: string) => apiClient.get('/admin/staff', {params: {shopId}}),
  create: (data: {
    shopId: string;
    name: string;
    email: string;
    role: string;
  }) => apiClient.post('/admin/staff', data),
  update: (id: string, data: any) => apiClient.patch(`/admin/staff/${id}`, data),
  delete: (id: string) => apiClient.delete(`/admin/staff/${id}`),
};

// Analytics APIs
export const analyticsApi = {
  getRevenue: (shopId: string, period: 'day' | 'week' | 'month' | 'year') =>
    apiClient.get('/admin/analytics/revenue', {params: {shopId, period}}),
  getBookingStats: (shopId: string, period: 'day' | 'week' | 'month' | 'year') =>
    apiClient.get('/admin/analytics/bookings', {params: {shopId, period}}),
  getTopServices: (shopId: string, limit = 5) =>
    apiClient.get('/admin/analytics/top-services', {params: {shopId, limit}}),
  getPeakHours: (shopId: string) =>
    apiClient.get('/admin/analytics/peak-hours', {params: {shopId}}),
};

export default apiClient;
