import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class TrustScoreService {
  private readonly logger = new Logger(TrustScoreService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Recalculates the trust score for a specific user based on their historical bookings.
   * Trust Score Formula:
   * (Completed*1.0 + Cancelled*0.5 + NoShow*0.0) / Total Bookings * 100
   *
   * @param userId The ID of the user to recalculate
   */
  async recalculateTrustScore(userId: string): Promise<void> {
    try {
      // 1. Fetch all bookings for the user to calculate aggregates
      const bookings = await this.prisma.booking.findMany({
        where: { userId },
        select: { status: true },
      });

      if (bookings.length === 0) {
        return; // Nothing to calculate if no bookings exist
      }

      const totalBookings = bookings.length;
      let completedBookings = 0;
      let cancelledBookings = 0;
      let noShowBookings = 0;

      for (const b of bookings) {
        if (b.status === BookingStatus.COMPLETED) completedBookings++;
        if (b.status === BookingStatus.CANCELLED) cancelledBookings++;
        if (b.status === BookingStatus.NO_SHOW) noShowBookings++;
      }

      // 2. Apply Weighting Formula
      const completionWeight = 1.0;
      const cancellationWeight = 0.5; // Cancellations are heavily penalized but better than no-shows

      const weightedScore =
        (completedBookings * completionWeight + cancelledBookings * cancellationWeight) /
        totalBookings;

      const trustScore = Math.max(0, Math.min(100, Math.round(weightedScore * 100)));

      // 3. Update User Record
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          trustScore,
          totalBookings,
          completedBookings,
          cancelledBookings,
          noShowBookings,
        },
      });

      this.logger.debug(`Updated trust score for User ${userId}: ${trustScore}%`);
    } catch (error) {
      this.logger.error(`Failed to recalculate trust score for user ${userId}`, error);
    }
  }
}
