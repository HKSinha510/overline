import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BookingsService } from './bookings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, NotificationType, NotificationChannel } from '@prisma/client';

@Injectable()
export class NoShowCron {
  private readonly logger = new Logger(NoShowCron.name);

  // A grace period of 15 minutes. If a booking is still CONFIRMED 15 mins after startTime, it's a no-show.
  private readonly GRACE_PERIOD_MS = 15 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly bookingsService: BookingsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleGracePeriodExpirations() {
    this.logger.debug('Running No-Show evaluation job...');
    const now = new Date();
    const cutoffTime = new Date(now.getTime() - this.GRACE_PERIOD_MS);

    try {
      // Find all bookings that are CONFIRMED but their start time was over 15 minutes ago
      const expiredBookings = await this.prisma.booking.findMany({
        where: {
          status: BookingStatus.CONFIRMED,
          startTime: {
            lt: cutoffTime,
          },
        },
        include: {
          shop: { select: { id: true, name: true } },
        },
      });

      if (expiredBookings.length === 0) {
        return;
      }

      this.logger.log(
        `Found ${expiredBookings.length} expired bookings. Auto-skipping to NO_SHOW.`,
      );

      // For each expired booking, we use the bookingsService to safely update status
      // This ensures queue stats are updated, caches are invalidated,
      // websockets fire, and the trust score is recalculated.
      for (const booking of expiredBookings) {
        await this.bookingsService.updateStatus(booking.id, BookingStatus.NO_SHOW);
        this.logger.log(`Booking ${booking.bookingNumber} auto-marked as NO_SHOW.`);

        // Notify the next person in the queue that their turn is sooner
        await this.notifyNextInQueue(booking.shopId, booking.shop?.name || 'Shop');
      }
    } catch (error) {
      this.logger.error('Error executing No-Show grace period cron job', error);
    }
  }

  /**
   * Queue Reallocation: Notify the next person that the person ahead didn't arrive,
   * so their turn is now or coming up sooner.
   */
  private async notifyNextInQueue(shopId: string, shopName: string) {
    try {
      // Find the next CONFIRMED booking for this shop
      const nextBooking = await this.prisma.booking.findFirst({
        where: {
          shopId,
          status: BookingStatus.CONFIRMED,
          startTime: { gte: new Date() },
        },
        orderBy: { startTime: 'asc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      });

      if (!nextBooking) {
        return; // No one else in queue
      }

      const customerName = nextBooking.user?.name || nextBooking.customerName || 'Customer';

      // Send in-app notification if user exists
      if (nextBooking.userId) {
        await this.notificationsService.send({
          userId: nextBooking.userId,
          bookingId: nextBooking.id,
          type: NotificationType.QUEUE_UPDATE,
          title: 'Your turn is sooner!',
          body: `The person ahead of you at ${shopName} didn't arrive. Your appointment may start earlier!`,
          data: {
            bookingNumber: nextBooking.bookingNumber,
            shopName,
          },
          channels: [NotificationChannel.PUSH],
        });
      }

      this.logger.log(
        `Notified next customer (${customerName}) about queue advancement at shop ${shopId}`,
      );
    } catch (error) {
      this.logger.error(`Failed to notify next in queue for shop ${shopId}`, error);
    }
  }
}
