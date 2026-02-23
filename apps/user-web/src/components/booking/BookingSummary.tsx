import React from 'react';
import { Calendar, Clock, MapPin, User, CreditCard } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatDate, formatTime, formatPrice, formatDuration, getEndTime } from '@/lib/utils';
import { useBookingStore } from '@/stores/booking';

interface BookingSummaryProps {
  showPrice?: boolean;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ showPrice = true }) => {
  const {
    shop,
    selectedServices,
    selectedStaff,
    selectedDate,
    selectedSlot,
    offerCode,
    setOfferCode,
    getTotalDuration,
    getTotalPrice,
  } = useBookingStore();

  const [localCode, setLocalCode] = React.useState('');
  const [offerStatus, setOfferStatus] = React.useState<'idle' | 'success' | 'invalid'>('idle');

  const handleApplyOffer = () => {
    const validCodes = ['OVERLINE10', 'OVERLINE20', 'WELCOME50'];
    if (validCodes.includes(localCode.toUpperCase())) {
      setOfferCode(localCode.toUpperCase());
      setOfferStatus('success');
    } else {
      setOfferStatus('invalid');
      setOfferCode(null);
    }
  };

  const totalDuration = getTotalDuration();
  const totalPrice = getTotalPrice();

  if (!shop) return null;

  return (
    <Card variant="bordered" className="sticky top-4">
      <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>

      {/* Shop Info */}
      <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
          {shop.logoUrl ? (
            <img
              src={shop.logoUrl}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-500 text-white font-bold">
              {shop.name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{shop.name}</h4>
          <p className="text-sm text-gray-500 flex items-center mt-0.5">
            <MapPin className="w-3 h-3 mr-1" />
            {shop.address}
          </p>
        </div>
      </div>

      {/* Selected Services */}
      {selectedServices.length > 0 && (
        <div className="py-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Services</h4>
          <div className="space-y-2">
            {selectedServices.map((service) => (
              <div key={service.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{service.name}</span>
                <span className="text-gray-500">{formatDuration(service.durationMinutes)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff */}
      {selectedStaff && (
        <div className="py-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Staff</h4>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{selectedStaff.name}</span>
          </div>
        </div>
      )}

      {/* Date & Time */}
      {selectedDate && selectedSlot && (
        <div className="py-4 border-b border-gray-100">
          <h4 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h4>
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{formatDate(selectedDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              {formatTime(selectedSlot.startTime)} -{' '}
              {formatTime(getEndTime(selectedSlot.startTime, totalDuration))}
            </span>
          </div>
        </div>
      )}

      {/* Total & Offers */}
      {showPrice && selectedServices.length > 0 && (
        <div className="pt-4">

          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Offer Code</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={localCode}
                onChange={(e) => {
                  setLocalCode(e.target.value);
                  if (offerStatus !== 'idle') setOfferStatus('idle');
                }}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none focus:border-primary-500 uppercase"
                placeholder="PROMO CODE"
              />
              <button
                onClick={handleApplyOffer}
                className="px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
            {offerStatus === 'invalid' && <p className="text-xs text-red-500 mt-1">Invalid code</p>}
            {offerStatus === 'success' && <p className="text-xs text-emerald-600 mt-1 flex gap-1 items-center">✨ Promo code applied</p>}
          </div>

          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-900">Total</span>
            <div className="text-right">
              {offerCode && (
                <span className="text-sm text-gray-400 line-through block -mb-1">
                  {formatPrice(selectedServices.reduce((acc, s) => acc + Number(s.price || 0), 0))}
                </span>
              )}
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Duration: {formatDuration(totalDuration)}
          </p>
        </div>
      )}
    </Card>
  );
};

export { BookingSummary };
