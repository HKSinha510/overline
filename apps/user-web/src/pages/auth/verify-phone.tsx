import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Phone, CheckCircle } from 'lucide-react';
import { Button, Input, Card, Alert } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';

export default function VerifyPhonePage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [otpCode, setOtpCode] = React.useState('');
  const [isOtpSent, setIsOtpSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    // If user is already verified, bounce back to home
    if (user?.isPhoneVerified) {
      router.replace('/');
    }
  }, [user, router]);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // Step 1: Update the user profile with the requested phone number
      await api.patch('/users/me', { phone });
      
      // Step 2: Trigger OTP to that phone
      await api.post('/users/me/otp/send');
      
      setIsOtpSent(true);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Phone number may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      await api.post('/users/me/otp/verify', { code: otpCode });
      
      if (user) {
        // Update local context
        setUser({ ...user, phone, isPhoneVerified: true });
      }
      // Redirect to home upon success
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Verify Phone - Overline</title>
      </Head>
      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card variant="bordered" className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {isOtpSent ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Phone className="w-8 h-8 text-primary-600" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isOtpSent ? 'Verify your phone' : 'Add your mobile number'}
            </h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              {isOtpSent
                ? `We've sent a 6-digit code via SMS to ${phone}.`
                : 'Phone verification is strictly required for communication and booking appointments.'}
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {!isOtpSent ? (
            <div className="space-y-6">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Button
                onClick={handleSendOtp}
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Input
                label="OTP Code"
                type="text"
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-bold"
              />
              <Button
                onClick={handleVerifyOtp}
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Verify & Continue
              </Button>
              <Button
                onClick={() => setIsOtpSent(false)}
                variant="outline"
                className="w-full"
                size="sm"
                disabled={isLoading}
              >
                Change Phone Number
              </Button>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
