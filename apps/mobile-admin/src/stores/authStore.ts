import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../api/client';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'SHOP_OWNER' | 'SHOP_STAFF';
  shops?: Array<{
    id: string;
    name: string;
  }>;
}

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedShopId: string | null;
  pendingEmail: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setSelectedShop: (shopId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  selectedShopId: null,
  pendingEmail: null,

  login: async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);

      if (response.data.requiresOtp) {
        // OTP required - store email for verification
        set({pendingEmail: email});
        return;
      }

      // Direct login (if OTP is disabled)
      const {token, user} = response.data;
      await AsyncStorage.setItem('admin_token', token);

      // Set default selected shop
      const defaultShopId = user.shops?.[0]?.id || null;

      set({
        user,
        isAuthenticated: true,
        selectedShopId: defaultShopId,
        pendingEmail: null,
      });
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (otp: string) => {
    const {pendingEmail} = get();
    if (!pendingEmail) {
      throw new Error('No pending email for OTP verification');
    }

    try {
      const response = await authApi.verifyOtp(pendingEmail, otp);
      const {token, user} = response.data;

      await AsyncStorage.setItem('admin_token', token);

      // Set default selected shop
      const defaultShopId = user.shops?.[0]?.id || null;

      set({
        user,
        isAuthenticated: true,
        selectedShopId: defaultShopId,
        pendingEmail: null,
      });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout API errors - still clear local state
      console.log('Logout API error:', error);
    }

    await AsyncStorage.removeItem('admin_token');
    set({
      user: null,
      isAuthenticated: false,
      selectedShopId: null,
      pendingEmail: null,
    });
  },

  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('admin_token');

      if (!token) {
        set({isAuthenticated: false, isLoading: false});
        return;
      }

      const response = await authApi.getProfile();
      const user = response.data;

      // Restore selected shop from storage or use first shop
      const storedShopId = await AsyncStorage.getItem('selected_shop_id');
      const defaultShopId =
        storedShopId && user.shops?.some((s: any) => s.id === storedShopId)
          ? storedShopId
          : user.shops?.[0]?.id || null;

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        selectedShopId: defaultShopId,
      });
    } catch {
      await AsyncStorage.removeItem('admin_token');
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  setSelectedShop: async (shopId: string) => {
    await AsyncStorage.setItem('selected_shop_id', shopId);
    set({selectedShopId: shopId});
  },
}));
