import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  ArrowLeft, MapPin, Clock, Star, Phone, Globe, Share2,
  MessageSquare, ChevronLeft, ChevronRight, X, Camera, UserPlus,
} from 'lucide-react';
import { Button, Badge, Loading, Alert, Card, Input } from '@/components/ui';
import { ServiceList, StaffPicker, LiveQueueStatus } from '@/components/shop';
import { DatePicker, SlotPicker, BookingSummary } from '@/components/booking';
import { ReviewList } from '@/components/reviews';
import { useShop, useShopQueueStats, useAvailableSlots, useCreateBooking, useShopRatingStats } from '@/hooks';
import { useBookingStore } from '@/stores/booking';
import { useAuthStore } from '@/stores/auth';
import { format } from 'date-fns';

type BookingStep = 'services' | 'staff' | 'datetime' | 'confirm';

const STEP_LABELS: Record<BookingStep, string> = {
  services: 'Select Services',
  staff: 'Choose Staff',
  datetime: 'Pick a Time',
  confirm: 'Confirm',
};

export default function ShopDetailPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated } = useAuthStore();

  const [step, setStep] = React.useState<BookingStep>('services');
  const [error, setError] = React.useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = React.useState(false);
  const [galleryIndex, setGalleryIndex] = React.useState(0);

  const { data: shop, isLoading: loadingShop } = useShop(slug as string);
  const { data: queueStats } = useShopQueueStats(shop?.id || '');
  const { data: ratingStats } = useShopRatingStats(shop?.id || '');

  const {
    selectedServices,
    selectedStaff,
    selectedDate,
    selectedSlot,
    notes,
    setShop,
    toggleService,
    setStaff,
    setDate,
    setSlot,
    setNotes,
    offerCode,
    bookingForOther,
    customerName,
    customerPhone,
    setBookingForOther,
    setCustomerName,
    setCustomerPhone,
    getTotalDuration,
    reset,
  } = useBookingStore();

  // Fetch available slots when date is selected
  const { data: slots, isLoading: loadingSlots } = useAvailableSlots({
    shopId: shop?.id || '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    staffId: selectedStaff?.id,
    serviceIds: selectedServices.map((s) => s.id),
  });

  const createBooking = useCreateBooking();

  // Set shop when loaded
  React.useEffect(() => {
    if (shop) {
      setShop(shop);
    }
  }, [shop, setShop]);

  // Reset on unmount
  React.useEffect(() => {
    return () => reset();
  }, [reset]);

  // Gather all photos for gallery
  const allPhotos = React.useMemo(() => {
    if (!shop) return [];
    const photos: string[] = [];
    if (shop.coverUrl) photos.push(shop.coverUrl);
    if (shop.photoUrls?.length) photos.push(...shop.photoUrls);
    return photos;
  }, [shop]);

  const handleNextStep = () => {
    const steps: BookingStep[] = ['services', 'staff', 'datetime', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const steps: BookingStep[] = ['services', 'staff', 'datetime', 'confirm'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    } else {
      router.back();
    }
  };

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/shops/${slug}`);
      return;
    }

    if (!shop || !selectedDate || !selectedSlot || selectedServices.length === 0) {
      setError('Please complete all booking steps');
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        shopId: shop.id,
        serviceIds: selectedServices.map((s) => s.id),
        staffId: selectedStaff?.id,
        scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
        scheduledTime: selectedSlot.startTime,
        notes,
        ...(offerCode ? { offerCode } : {}),
        ...(bookingForOther && customerName ? {
          customerName,
          customerPhone: customerPhone || undefined,
        } : {}),
      });

      router.push(`/bookings/${booking.id}?success=true`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 'services':
        return selectedServices.length > 0;
      case 'staff':
        return true; // Staff is optional
      case 'datetime':
        return selectedDate && selectedSlot;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  if (loadingShop) {
    return <Loading text="Loading shop details..." />;
  }

  if (!shop) {
    return (
      <div className="container-app py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Shop not found</h1>
        <p className="text-gray-500 mb-4">
          The shop you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => router.push('/explore')}>Explore Shops</Button>
      </div>
    );
  }

  const heroImage = shop.coverUrl || shop.photoUrls?.[0] || shop.logoUrl;

  return (
    <>
      <Head>
        <title>{shop.name} - Overline</title>
        <meta name="description" content={shop.description || `Book an appointment at ${shop.name}`} />
      </Head>

      {/* Photo Gallery Lightbox */}
      {galleryOpen && allPhotos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setGalleryIndex((i) => (i > 0 ? i - 1 : allPhotos.length - 1))}
            className="absolute left-4 p-2 text-white/80 hover:text-white"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={allPhotos[galleryIndex]}
            alt={`Photo ${galleryIndex + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />

          <button
            onClick={() => setGalleryIndex((i) => (i < allPhotos.length - 1 ? i + 1 : 0))}
            className="absolute right-4 p-2 text-white/80 hover:text-white"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 text-white/80 text-sm">
            {galleryIndex + 1} / {allPhotos.length}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container-app flex items-center justify-between h-14">
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">
                {step === 'services' ? 'Back' : 'Previous'}
              </span>
            </button>

            {/* Progress Steps */}
            <div className="flex items-center gap-1.5">
              {(['services', 'staff', 'datetime', 'confirm'] as BookingStep[]).map((s, i) => {
                const stepIndex = ['services', 'staff', 'datetime', 'confirm'].indexOf(step);
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i <= stepIndex
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                        }`}
                    >
                      {i + 1}
                    </div>
                    {i < 3 && (
                      <div className={`w-6 h-0.5 ${i < stepIndex ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            <span className="text-sm font-medium text-gray-600 hidden sm:block">
              {STEP_LABELS[step]}
            </span>
          </div>
        </div>

        <div className="container-app py-6">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Shop Header with Hero Image (only on first step) */}
              {step === 'services' && (
                <div className="mb-6">
                  {/* Cover Image / Gallery */}
                  <div
                    className="relative h-48 md:h-72 rounded-2xl overflow-hidden mb-5 cursor-pointer group"
                    onClick={() => {
                      if (allPhotos.length > 0) {
                        setGalleryIndex(0);
                        setGalleryOpen(true);
                      }
                    }}
                  >
                    {heroImage ? (
                      <img
                        src={heroImage}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 via-primary-500 to-purple-600 flex items-center justify-center">
                        <span className="text-7xl text-white/60 font-bold">
                          {shop.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Open badge */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="success">Open Now</Badge>
                    </div>

                    {/* Photo count + View all */}
                    {allPhotos.length > 1 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/60 text-white text-sm px-3 py-1.5 rounded-full">
                        <Camera className="w-4 h-4" />
                        View all {allPhotos.length} photos
                      </div>
                    )}
                  </div>

                  {/* Photo Thumbnails */}
                  {allPhotos.length > 1 && (
                    <div className="flex gap-2 mb-5 overflow-x-auto hide-scrollbar pb-1">
                      {allPhotos.slice(0, 5).map((url, i) => (
                        <button
                          key={i}
                          onClick={() => { setGalleryIndex(i); setGalleryOpen(true); }}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-transparent hover:border-primary-400 transition-colors"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                      {allPhotos.length > 5 && (
                        <button
                          onClick={() => { setGalleryIndex(5); setGalleryOpen(true); }}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium"
                        >
                          +{allPhotos.length - 5}
                        </button>
                      )}
                    </div>
                  )}

                  {/* Shop Info */}
                  <div className="flex items-start gap-4 mb-4">
                    {shop.logoUrl && (
                      <img
                        src={shop.logoUrl}
                        alt={shop.name}
                        className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                        {shop.name}
                      </h1>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {shop.address}, {shop.city}
                        </span>
                        {ratingStats && (
                          <span className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium text-gray-900">
                              {ratingStats.averageRating?.toFixed(1) || 'New'}
                            </span>
                            <span className="text-gray-400">({ratingStats.totalReviews || 0})</span>
                          </span>
                        )}
                        {queueStats && (
                          <span className="flex items-center gap-1 text-primary-600">
                            <Clock className="w-4 h-4" />
                            ~{queueStats.estimatedWaitMinutes} min wait
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {shop.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{shop.description}</p>
                  )}

                  {/* Quick Info Row */}
                  <div className="flex flex-wrap gap-3 mb-2">
                    {shop.phone && (
                      <a
                        href={`tel:${shop.phone}`}
                        className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {shop.phone}
                      </a>
                    )}
                    {shop.website && (
                      <a
                        href={shop.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        Website
                      </a>
                    )}
                    <button className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                      Share
                    </button>
                  </div>
                </div>
              )}

              {/* Step Content */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                {step === 'services' && (
                  <>
                    {/* Inline Queue Banner */}
                    {shop?.id && (
                      <div className="mb-4">
                        <LiveQueueStatus
                          shopId={shop.id}
                          fallbackStats={queueStats ? {
                            waitingCount: queueStats.waitingCount,
                            estimatedWaitMinutes: queueStats.estimatedWaitMinutes,
                          } : null}
                        />
                      </div>
                    )}

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Services
                    </h2>
                    {shop.services && shop.services.length > 0 ? (
                      <ServiceList
                        services={shop.services}
                        selectedServices={selectedServices}
                        onToggleService={toggleService}
                      />
                    ) : (
                      <p className="text-gray-500">No services available</p>
                    )}
                  </>
                )}

                {step === 'services' && shop && (
                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Reviews
                    </h2>
                    <ReviewList shopId={shop.id} />
                  </div>
                )}

                {step === 'staff' && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Choose Staff (Optional)
                    </h2>
                    {shop.staff && shop.staff.length > 0 ? (
                      <StaffPicker
                        staff={shop.staff}
                        selectedStaff={selectedStaff}
                        onSelectStaff={setStaff}
                      />
                    ) : (
                      <p className="text-gray-500">
                        Staff selection not available for this shop
                      </p>
                    )}
                  </>
                )}

                {step === 'datetime' && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Select Date
                    </h2>
                    <DatePicker
                      selectedDate={selectedDate}
                      onSelectDate={setDate}
                    />

                    {selectedDate && (
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Available Times
                        </h3>
                        <SlotPicker
                          slots={slots || []}
                          selectedSlot={selectedSlot}
                          onSelectSlot={setSlot}
                          isLoading={loadingSlots}
                        />
                      </div>
                    )}
                  </>
                )}

                {step === 'confirm' && (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Confirm Booking
                    </h2>

                    {error && (
                      <Alert variant="error" className="mb-4">
                        {error}
                      </Alert>
                    )}

                    <div className="space-y-4">
                      {/* Booking For Someone Else */}
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={bookingForOther}
                            onChange={(e) => setBookingForOther(e.target.checked)}
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                          />
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              Booking for someone else?
                            </span>
                          </div>
                        </label>

                        {bookingForOther && (
                          <div className="mt-4 space-y-3 pl-7">
                            <Input
                              label="Their Name"
                              value={customerName}
                              onChange={(e) => setCustomerName(e.target.value)}
                              placeholder="Enter their full name"
                              required
                            />
                            <Input
                              label="Their Phone (optional)"
                              type="tel"
                              value={customerPhone}
                              onChange={(e) => setCustomerPhone(e.target.value)}
                              placeholder="+91 XXXXX XXXXX"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special requests or notes for your appointment..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={3}
                        />
                      </div>

                      {!isAuthenticated && (
                        <Alert variant="info">
                          You'll need to login to complete your booking
                        </Alert>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handlePrevStep}>
                  {step === 'services' ? 'Cancel' : 'Back'}
                </Button>

                {step !== 'confirm' ? (
                  <Button onClick={handleNextStep} disabled={!canProceed()}>
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleConfirmBooking}
                    isLoading={createBooking.isPending}
                    disabled={!canProceed()}
                  >
                    {isAuthenticated ? 'Confirm Booking' : 'Login to Book'}
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar - Booking Summary */}
            <div className="hidden lg:block space-y-4">
              <BookingSummary />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
