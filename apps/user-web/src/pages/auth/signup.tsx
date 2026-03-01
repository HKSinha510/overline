import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { Button, Input, Card, Alert } from '@/components/ui';
import { useSignup } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';

interface SignupForm {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { redirect } = router.query;
  const { isAuthenticated, user, setUser } = useAuthStore();
  const signup = useSignup();

  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [isOtpStep, setIsOtpStep] = React.useState(false);
  const [otpCode, setOtpCode] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>();

  const password = watch('password');

  // Redirect if already authenticated and phone is verified or absent
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.phone && !user.isPhoneVerified) {
        setIsOtpStep(true);
      } else {
        router.push((redirect as string) || '/');
      }
    }
  }, [isAuthenticated, user, redirect, router]);

  const onSubmit = async (data: SignupForm) => {
    setError(null);
    try {
      const res = await signup.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });

      // Show OTP form if phone is provided
      if (data.phone && !res.user.isPhoneVerified) {
        setIsOtpStep(true);
      } else {
        router.push((redirect as string) || '/');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Failed to create account. Please try again.'
      );
    }
  };

  const verifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }

    setError(null);
    setIsVerifying(true);

    try {
      await api.post('/users/me/otp/verify', { code: otpCode });
      if (user) {
        setUser({ ...user, isPhoneVerified: true });
      }
      router.push((redirect as string) || '/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code');
    } finally {
      setIsVerifying(false);
    }
  };

  const skipOtp = () => {
    router.push((redirect as string) || '/');
  };

  if (isOtpStep) {
    return (
      <>
        <Head>
          <title>Verify Phone - Overline</title>
        </Head>
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
          <Card variant="bordered" className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Verify your phone</h1>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We've sent a 6-digit code to your phone number. <br />
                Verifying your phone is required to book slots. (Check app logs for OTP)
              </p>
            </div>

            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            <div className="space-y-6">
              <Input
                label="OTP Code"
                type="text"
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest font-bold"
              />

              <div className="flex flex-col gap-3">
                <Button
                  onClick={verifyOtp}
                  className="w-full"
                  size="lg"
                  isLoading={isVerifying}
                >
                  Verify OTP
                </Button>
                <Button
                  onClick={skipOtp}
                  variant="outline"
                  className="w-full"
                  size="sm"
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Sign Up - Overline</title>
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
        <Card variant="bordered" className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
            <p className="text-gray-500 mt-1">
              Join Overline to book appointments easily
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              leftIcon={<User className="w-5 h-5" />}
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              placeholder="+91 9876543210"
              leftIcon={<Phone className="w-5 h-5" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              leftIcon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isSubmitting || signup.isPending}
            >
              Create Account
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500">or sign up with</span>
            </div>
          </div>

          {/* Google Sign-Up Button */}
          <a
            href={`${BACKEND_URL}/api/v1/auth/google/redirect`}
            className="flex items-center justify-center gap-3 w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Sign up with Google
          </a>

          <p className="text-center text-gray-500 text-sm mt-4">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-700">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-700">
              Privacy Policy
            </Link>
          </p>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{' '}
            <Link
              href={`/auth/login${redirect ? `?redirect=${redirect}` : ''}`}
              className="text-primary-600 font-medium hover:text-primary-700"
            >
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
