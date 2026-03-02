import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi, otpApi} from '../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // OTP state
  otpPhone: string | null;
  otpSent: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  completeOtpLogin: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  otpPhone: null,
  otpSent: false,

  login: async (email, password) => {
    try {
      set({isLoading: true, error: null});
      const {data} = await authApi.login(email, password);
      await AsyncStorage.setItem('accessToken', data.accessToken);
      if (data.refreshToken) {
        await AsyncStorage.setItem('refreshToken', data.refreshToken);
      }
      set({user: data.user, isAuthenticated: true, isLoading: false});
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please try again.';
      set({error: message, isLoading: false});
      throw error;
    }
  },

  signup: async data => {
    try {
      set({isLoading: true, error: null});
      const {data: response} = await authApi.signup(data);
      await AsyncStorage.setItem('accessToken', response.accessToken);
      if (response.refreshToken) {
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
      }
      set({user: response.user, isAuthenticated: true, isLoading: false});
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Signup failed. Please try again.';
      set({error: message, isLoading: false});
      throw error;
    }
  },

  sendOtp: async (phone: string) => {
    try {
      set({error: null});
      await otpApi.send(phone, 'LOGIN');
      set({otpPhone: phone, otpSent: true});
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Failed to send OTP. Please try again.';
      set({error: message});
      throw error;
    }
  },

  completeOtpLogin: (user: User) => {
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
      otpPhone: null,
      otpSent: false,
    });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    }
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    set({
      user: null,
      isAuthenticated: false,
      otpPhone: null,
      otpSent: false,
    });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        set({isLoading: false});
        return;
      }
      const {data} = await authApi.me();
      set({user: data, isAuthenticated: true, isLoading: false});
    } catch {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      set({isLoading: false, isAuthenticated: false, user: null});
    }
  },

  clearError: () => set({error: null}),
}));
