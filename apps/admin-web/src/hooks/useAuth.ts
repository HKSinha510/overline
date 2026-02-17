import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import type { User, AuthResponse } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

export function useUser() {
  const { isAuthenticated, accessToken } = useAuthStore();

  return useQuery<User>({
    queryKey: ['admin', 'user', 'me'],
    queryFn: async () => {
      const { data } = await api.get('/users/me');
      return data;
    },
    enabled: isAuthenticated && !!accessToken,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { login, setShopId } = useAuthStore();

  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials);
      // Check if user is OWNER, STAFF, or SUPER_ADMIN
      if (data.user.role !== 'OWNER' && data.user.role !== 'STAFF' && data.user.role !== 'SUPER_ADMIN') {
        throw new Error('Access denied. Admin access only.');
      }
      return data;
    },
    onSuccess: async (data) => {
      // Login first to set the token for subsequent API calls
      login(data.user, data.accessToken, data.refreshToken);
      queryClient.setQueryData(['admin', 'user', 'me'], data.user);

      // Fetch shops accessible to this user and auto-set the first one
      try {
        const { data: shops } = await api.get('/admin/my-shops');
        if (shops && shops.length > 0) {
          setShopId(shops[0].id);
          queryClient.setQueryData(['admin', 'my-shops'], shops);
        }
      } catch (err) {
        console.error('Failed to fetch shops:', err);
      }
    },
  });
}

export function useMyShops() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'my-shops'],
    queryFn: async () => {
      const { data } = await api.get('/admin/my-shops');
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      logout();
      queryClient.clear();
    },
  });
}
