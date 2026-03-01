import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Button, Input, Card } from '@/components/ui';
import { useRegisterShop } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import type { TenantType } from '@/types';

interface RegisterForm {
    ownerName: string;
    email: string;
    password: string;
    shopName: string;
    shopType: 'SALON' | 'CLINIC' | 'BARBER' | 'SPA' | 'OTHER';
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const registerShop = useRegisterShop();

    const [step, setStep] = React.useState(1);
    const [error, setError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        defaultValues: {
            shopType: 'SALON',
        },
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isAuthenticated, router]);

    const onNextStep = async () => {
        let isValid = false;
        if (step === 1) {
            isValid = await trigger(['ownerName', 'email', 'password']);
        } else if (step === 2) {
            isValid = await trigger(['shopName', 'shopType', 'phone']);
        }

        if (isValid) {
            setStep((prev) => prev + 1);
        }
    };

    const onPrevStep = () => {
        setStep((prev) => prev - 1);
    };

    const onSubmit = async (data: RegisterForm) => {
        setError(null);
        try {
            await registerShop.mutateAsync(data);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        }
    };

    return (
        <>
            <Head>
                <title>Register Shop - Overline Admin</title>
            </Head>

            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-lg">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">O</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Create your Shop</h1>
                        <p className="text-gray-500 mt-1">Join Overline and manage your bookings</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-8">
                        {[1, 2, 3].map((i) => (
                            <React.Fragment key={i}>
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-600'
                                        }`}
                                >
                                    {i}
                                </div>
                                {i < 3 && (
                                    <div
                                        className={`w-12 h-1 transition-colors ${step > i ? 'bg-primary-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Owner Details</h2>
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
                                    error={errors.ownerName?.message}
                                    {...register('ownerName', { required: 'Name is required' })}
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="john@example.com"
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
                                    label="Password"
                                    type="password"
                                    placeholder="••••••••"
                                    error={errors.password?.message}
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must be at least 8 characters',
                                        },
                                    })}
                                />
                                <Button type="button" className="w-full mt-6" onClick={onNextStep}>
                                    Next: Shop Details
                                </Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Shop Details</h2>
                                <Input
                                    label="Shop Name"
                                    placeholder="My Awesome Salon"
                                    error={errors.shopName?.message}
                                    {...register('shopName', { required: 'Shop Name is required' })}
                                />

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Shop Entity Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                                        {...register('shopType', { required: 'Selecting a type is required' })}
                                    >
                                        <option value="SALON">Salon</option>
                                        <option value="CLINIC">Clinic</option>
                                        <option value="BARBER">Barber</option>
                                        <option value="SPA">Spa</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>

                                <Input
                                    label="Business Phone"
                                    placeholder="+91 9876543210"
                                    error={errors.phone?.message}
                                    {...register('phone', { required: 'Phone is required' })}
                                />

                                <div className="flex gap-4 mt-6">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onPrevStep}>
                                        Back
                                    </Button>
                                    <Button type="button" className="flex-1" onClick={onNextStep}>
                                        Next: Location
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <h2 className="text-lg font-semibold mb-4 border-b pb-2">Location Details</h2>

                                <Input
                                    label="Street Address"
                                    placeholder="123 Main St"
                                    error={errors.address?.message}
                                    {...register('address', { required: 'Address is required' })}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="City"
                                        placeholder="Mumbai"
                                        error={errors.city?.message}
                                        {...register('city', { required: 'City is required' })}
                                    />
                                    <Input
                                        label="State"
                                        placeholder="MH (Optional)"
                                        {...register('state')}
                                    />
                                </div>

                                <Input
                                    label="Postal Code / Zip"
                                    placeholder="400001 (Optional)"
                                    {...register('postalCode')}
                                />

                                <div className="flex gap-4 mt-6">
                                    <Button type="button" variant="outline" className="flex-1" onClick={onPrevStep} disabled={isSubmitting || registerShop.isPending}>
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        isLoading={isSubmitting || registerShop.isPending}
                                    >
                                        Finish Registration
                                    </Button>
                                </div>
                            </div>
                        )}
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-6 pt-4 border-t">
                        Already have a shop account?{' '}
                        <span
                            onClick={() => router.push('/login')}
                            className="text-primary-600 hover:text-primary-700 cursor-pointer font-medium"
                        >
                            Sign In
                        </span>
                    </p>
                </Card>
            </div>
        </>
    );
}
