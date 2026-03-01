import React from 'react';
import { X, Clock, User, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from './Button';
import { formatTime } from '@/lib/utils';
import { format } from 'date-fns';

interface BookingApprovalModalProps {
  booking: {
    id: string;
    bookingNumber: string;
    customerName?: string;
    startTime: string;
    services?: { serviceName: string }[];
    user?: { name: string; phone?: string; trustScore?: number };
  };
  onApprove: (bookingId: string) => void;
  onDeny: (bookingId: string) => void;
  onClose: () => void;
  isApproving?: boolean;
  isDenying?: boolean;
}

export function BookingApprovalModal({
  booking,
  onApprove,
  onDeny,
  onClose,
  isApproving,
  isDenying,
}: BookingApprovalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">New Booking Request</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Booking Number Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-700 font-medium">
              <Calendar className="w-4 h-4" />
              #{booking.bookingNumber}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {booking.user?.name || booking.customerName || 'Walk-in Customer'}
                </p>
                {booking.user?.phone && (
                  <p className="text-sm text-gray-500">{booking.user.phone}</p>
                )}
              </div>
              {booking.user?.trustScore !== undefined && (
                <div 
                  className={`ml-auto px-2 py-1 rounded text-xs font-medium ${
                    booking.user.trustScore >= 70 
                      ? 'bg-green-100 text-green-700' 
                      : booking.user.trustScore >= 40 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-red-100 text-red-700'
                  }`}
                >
                  Trust: {booking.user.trustScore.toFixed(0)}%
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">
                {format(new Date(booking.startTime), 'MMM d')} at{' '}
                <span className="font-medium">{formatTime(booking.startTime)}</span>
              </span>
            </div>

            {booking.services && booking.services.length > 0 && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Services</p>
                <p className="text-sm text-gray-900">
                  {booking.services.map((s) => s.serviceName).join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t bg-gray-50 rounded-b-2xl">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => onDeny(booking.id)}
            isLoading={isDenying}
            disabled={isApproving || isDenying}
          >
            <XCircle className="w-4 h-4" />
            Deny
          </Button>
          <Button
            className="flex-1 gap-2"
            onClick={() => onApprove(booking.id)}
            isLoading={isApproving}
            disabled={isApproving || isDenying}
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  );
}
