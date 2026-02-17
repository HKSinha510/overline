import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth';

interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month';
}

export function useAnalytics(params: AnalyticsParams = {}) {
  const { shopId } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'analytics', shopId, params],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/shops/${shopId}/summary`, {
        params,
      });
      return data;
    },
    enabled: !!shopId,
  });
}

export function useDailyMetrics(params: { startDate?: string; endDate?: string } = {}) {
  const { shopId } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'analytics', 'daily', shopId, params],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/shops/${shopId}/daily`, {
        params,
      });
      return data;
    },
    enabled: !!shopId,
  });
}

export function usePopularServices() {
  const { shopId } = useAuthStore();

  return useQuery({
    queryKey: ['admin', 'analytics', 'popular-services', shopId],
    queryFn: async () => {
      const { data } = await api.get(`/analytics/shops/${shopId}/services`);
      return data;
    },
    enabled: !!shopId,
  });
}
