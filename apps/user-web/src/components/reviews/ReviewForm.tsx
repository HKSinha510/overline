import React from 'react';
import { StarRating } from './StarRating';
import { useCreateReview } from '@/hooks';
import { useToast } from '@/components/ui';
import { Button } from '@/components/ui';

interface ReviewFormProps {
  bookingId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = React.useState(0);
  const [staffRating, setStaffRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const createReview = useCreateReview();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      addToast({ type: 'warning', title: 'Please select a rating' });
      return;
    }

    try {
      await createReview.mutateAsync({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
        staffRating: staffRating || undefined,
      });
      addToast({ type: 'success', title: 'Review submitted!', message: 'Thank you for your feedback.' });
      onSuccess?.();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to submit review',
        message: err.response?.data?.message || 'Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating *
        </label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Staff Rating (Optional)
        </label>
        <StarRating rating={staffRating} size="md" interactive onChange={setStaffRating} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment (Optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          rows={3}
        />
      </div>

      <Button type="submit" isLoading={createReview.isPending} disabled={rating === 0}>
        Submit Review
      </Button>
    </form>
  );
}
