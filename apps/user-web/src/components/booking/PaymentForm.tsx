import React, { useState } from 'react';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button, Alert } from '@/components/ui';

const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Lazily initialise the Stripe promise (once)
let stripePromise: ReturnType<typeof loadStripe> | null = null;
function getStripePromise() {
  if (!stripePromise && STRIPE_PK) {
    stripePromise = loadStripe(STRIPE_PK);
  }
  return stripePromise;
}

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
}

/**
 * Inner form that uses Stripe hooks (must be inside <Elements>)
 */
const CheckoutForm: React.FC<{
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError?: (message: string) => void;
}> = ({ amount, currency, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setProcessing(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/bookings?payment=success`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment failed');
      onError?.(confirmError.message || 'Payment failed');
      setProcessing(false);
    } else {
      setSucceeded(true);
      setProcessing(false);
      onSuccess();
    }
  };

  const formatAmount = (amt: number, cur: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: cur.toUpperCase(),
    }).format(amt / 100);
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-500">
          Your payment of {formatAmount(amount, currency)} has been processed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {error && (
        <Alert variant="error">
          <AlertCircle className="w-4 h-4 mr-2 inline" />
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        isLoading={processing}
        className="w-full"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Pay {formatAmount(amount, currency)}
      </Button>

      <p className="text-xs text-center text-gray-400">
        Secured by Stripe. Your card details never touch our servers.
      </p>
    </form>
  );
};

/**
 * Wrapper component that sets up Stripe Elements context
 */
export const PaymentForm: React.FC<PaymentFormProps> = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const stripePromise = getStripePromise();

  if (!STRIPE_PK) {
    return (
      <Alert variant="info">
        <AlertCircle className="w-4 h-4 mr-2 inline" />
        Online payments are not configured yet. You can pay at the counter.
      </Alert>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#6366f1',
            borderRadius: '8px',
          },
        },
      }}
    >
      <CheckoutForm
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};
