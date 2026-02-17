import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface CreatePaymentIntentResponse {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export function useCreatePaymentIntent() {
  return useMutation<CreatePaymentIntentResponse, Error, { bookingId: string }>({
    mutationFn: async ({ bookingId }) => {
      const { data } = await api.post('/payments/create-intent', { bookingId });
      return data;
    },
  });
}

export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: ['payments', paymentId],
    queryFn: async () => {
      const { data } = await api.get(`/payments/${paymentId}`);
      return data;
    },
    enabled: !!paymentId,
  });
}
