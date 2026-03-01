import { Injectable, NotFoundException, BadRequestException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { QueueService } from '../queue/queue.service';
import { QueueGateway } from '../queue/queue.gateway';
import { SlotEngineService } from '../queue/slot-engine.service';
import { NotificationsService } from '../notifications/notifications.service';
import { TrustScoreService } from '../users/trust-score.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingStatus, BookingSource, NotificationChannel, NotificationType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private queueService: QueueService,
    @Inject(forwardRef(() => QueueGateway))
    private queueGateway: QueueGateway,
    private slotEngine: SlotEngineService,
    private notificationsService: NotificationsService,
    private trustScoreService: TrustScoreService,
  ) { }

  /**
   * Create a new booking
   */
  async create(dto: CreateBookingDto, userId?: string) {
    const { shopId, serviceIds, startTime, staffId, customerName, customerPhone, customerEmail, notes, source = BookingSource.WEB, offerCode } = dto;

    // Get shop
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Get services and calculate total duration and price
    const services = await this.prisma.service.findMany({
      where: {
        id: { in: serviceIds },
        shopId,
        isActive: true,
      },
    });

    if (services.length !== serviceIds.length) {
      throw new NotFoundException('One or more services not found or inactive');
    }

    const totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
    let totalAmount = services.reduce((sum, s) => sum + Number(s.price), 0);
    const currency = services[0]?.currency || 'INR';

    // Apply offer code discount
    if (offerCode) {
      if (offerCode.toUpperCase() === 'OVERLINE10') {
        totalAmount = totalAmount * 0.9;
      } else if (offerCode.toUpperCase() === 'OVERLINE20') {
        totalAmount = totalAmount * 0.8;
      } else if (offerCode.toUpperCase() === 'WELCOME50') {
        totalAmount = Math.max(0, totalAmount - 50);
      }
    }

    const bookingStartTime = new Date(startTime);
    const bookingEndTime = new Date(bookingStartTime.getTime() + totalDuration * 60 * 1000);

    // Validate slot is in the future
    if (bookingStartTime <= new Date()) {
      throw new BadRequestException('Cannot book a slot in the past');
    }

    // --- SPAM PREVENTION & CONCURRENCY RULE ---
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      if (!user.phone || !user.isPhoneVerified) {
        throw new BadRequestException('A verified phone number is required to book an appointment.');
      }
    }

    // A single user (by userId or phone) can only hold ONE active booking across the platform
    const activeBookingConditions: any[] = [{ status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS] } }];
    if (userId) {
      activeBookingConditions.push({ userId });
    } else if (customerPhone) {
      activeBookingConditions.push({ customerPhone });
    }

    if (activeBookingConditions.length > 1) {
      const existingActiveBooking = await this.prisma.booking.findFirst({
        where: {
          AND: activeBookingConditions,
        },
      });

      if (existingActiveBooking) {
        throw new ConflictException('You already have an active appointment. Please complete or cancel it before booking another.');
      }
    }
    // --- END SPAM PREVENTION ---

    // Check slot availability using transaction for consistency
    const booking = await this.prisma.$transaction(async (tx) => {
      // Double-check availability within transaction
      const isAvailable = await this.slotEngine.isSlotAvailable(
        shopId,
        bookingStartTime,
        bookingEndTime,
        staffId,
      );

      if (!isAvailable) {
        throw new ConflictException('Selected time slot is no longer available');
      }

      // Generate booking number
      const bookingNumber = this.generateBookingNumber();

      // Determine initial status
      const status = shop.autoAcceptBookings ? BookingStatus.CONFIRMED : BookingStatus.PENDING;

      // Get queue position
      const queuePosition = await this.queueService.getQueuePosition(shopId);

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          bookingNumber,
          userId,
          shopId,
          staffId,
          startTime: bookingStartTime,
          endTime: bookingEndTime,
          totalDurationMinutes: totalDuration,
          totalAmount,
          currency,
          status,
          source,
          customerName: userId ? undefined : customerName,
          customerPhone: userId ? undefined : customerPhone,
          customerEmail: userId ? undefined : customerEmail,
          notes,
          queuePosition: queuePosition + 1,
          services: {
            create: services.map((service) => ({
              serviceId: service.id,
              serviceName: service.name,
              durationMinutes: service.durationMinutes,
              price: service.price,
            })),
          },
        },
        include: {
          services: true,
          shop: {
            select: {
              name: true,
              address: true,
              phone: true,
            },
          },
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return newBooking;
    });

    // Update queue stats asynchronously
    this.queueService.updateQueueStats(shopId).catch(console.error);

    // Invalidate slot cache
    this.queueService.invalidateSlotCache(shopId, bookingStartTime).catch(console.error);

    // Emit real-time queue update
    this.queueGateway.emitQueueUpdate(shopId).catch(console.error);

    // Send booking confirmation notification to customer
    this.notificationsService.sendBookingConfirmation(booking.id).catch(console.error);

    // Send in-app notification to shop owner/admin
    this.sendAdminBookingNotification(booking, shop).catch(console.error);

    return booking;
  }

  /**
   * Send notification to shop admin about new booking
   */
  private async sendAdminBookingNotification(booking: any, shop: any) {
    // Find all admin/owner users for this shop's tenant
    const adminUsers = await this.prisma.user.findMany({
      where: {
        tenantId: shop.tenantId,
        role: { in: ['ADMIN', 'OWNER', 'SUPER_ADMIN'] as any },
        isActive: true,
      },
      select: { id: true },
    });

    const customerName = booking.user?.name || booking.customerName || 'Guest';
    const serviceNames = booking.services?.map((s: any) => s.serviceName).join(', ') || 'Service';
    const startTime = new Date(booking.startTime);
    const timeStr = startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    for (const admin of adminUsers) {
      await this.notificationsService.send({
        userId: admin.id,
        bookingId: booking.id,
        type: NotificationType.BOOKING_CONFIRMED,
        title: `New Booking from ${customerName}`,
        body: `${customerName} booked ${serviceNames} at ${timeStr}. Booking #${booking.bookingNumber}`,
        data: {
          bookingNumber: booking.bookingNumber,
          customerName,
          services: serviceNames,
          time: timeStr,
        },
        channels: [NotificationChannel.EMAIL],
      });
    }
  }

  /**
   * Get booking by ID
   */
  async findById(bookingId: string, userId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        services: {
          include: {
            service: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // If userId provided, verify ownership (unless admin)
    if (userId && booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    // Get current queue position
    const queuePosition = await this.queueService.getQueuePosition(bookingId);

    return {
      ...booking,
      currentQueuePosition: queuePosition,
    };
  }

  /**
   * Get booking by booking number
   */
  async findByBookingNumber(bookingNumber: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingNumber },
      include: {
        services: true,
        shop: {
          select: {
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Get user's bookings
   */
  async findByUser(userId: string, status?: string, page = 1, limit = 20) {
    // Ensure page and limit are numbers
    page = Number(page) || 1;
    limit = Number(limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (status) {
      const now = new Date();
      if (status === 'upcoming') {
        // Upcoming = future bookings that are not completed/cancelled
        where.startTime = { gte: now };
        where.status = { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] };
      } else if (status === 'past') {
        // Past = completed, cancelled, no-show, or past start time
        where.OR = [
          { status: { in: [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW] } },
          { startTime: { lt: now } },
        ];
      } else if (Object.values(BookingStatus).includes(status as BookingStatus)) {
        where.status = status;
      }
      // If status is invalid and not a virtual filter, ignore it
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startTime: 'desc' },
        include: {
          services: true,
          shop: {
            select: {
              id: true,
              name: true,
              slug: true,
              address: true,
            },
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update booking status
   */
  async updateStatus(bookingId: string, status: BookingStatus, userId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate status transition
    this.validateStatusTransition(booking.status, status);

    // User can only cancel their own bookings
    if (userId && status === BookingStatus.CANCELLED) {
      if (booking.userId !== userId) {
        throw new NotFoundException('Booking not found');
      }

      // Check cancellation policy (e.g., 1 hour before)
      const now = new Date();
      const oneHourBefore = new Date(booking.startTime.getTime() - 60 * 60 * 1000);
      if (now > oneHourBefore) {
        throw new BadRequestException('Cannot cancel booking less than 1 hour before start time');
      }
    }

    const updateData: any = { status };

    // Set timestamps based on status
    switch (status) {
      case BookingStatus.IN_PROGRESS:
        updateData.arrivedAt = new Date();
        updateData.startedAt = new Date();
        break;
      case BookingStatus.COMPLETED:
        updateData.completedAt = new Date();
        break;
      case BookingStatus.CANCELLED:
        updateData.cancelledAt = new Date();
        break;
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: {
        services: true,
        shop: {
          select: {
            name: true,
          },
        },
      },
    });

    // Update queue stats
    this.queueService.updateQueueStats(booking.shopId).catch(console.error);

    // Invalidate slot cache if cancelled or completed
    if (status === BookingStatus.CANCELLED || status === BookingStatus.COMPLETED) {
      this.queueService.invalidateSlotCache(booking.shopId, booking.startTime).catch(console.error);
    }

    // Emit real-time updates
    this.queueGateway.emitQueueUpdate(booking.shopId).catch(console.error);
    this.queueGateway.emitBookingUpdate(bookingId, {
      status,
      updatedAt: new Date().toISOString(),
    });

    // --- TRUST SCORE CALCULATION ---
    const scoreTriggerStatuses: BookingStatus[] = [BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.NO_SHOW];
    if (updatedBooking.userId && scoreTriggerStatuses.includes(status)) {
      this.trustScoreService.recalculateTrustScore(updatedBooking.userId).catch(console.error);
    }

    return updatedBooking;
  }

  /**
   * Cancel booking
   */
  async cancel(bookingId: string, userId?: string) {
    return this.updateStatus(bookingId, BookingStatus.CANCELLED, userId);
  }

  /**
   * Reschedule booking
   */
  async reschedule(bookingId: string, newStartTime: Date, userId?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { services: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (userId && booking.userId !== userId) {
      throw new NotFoundException('Booking not found');
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw new BadRequestException('Only pending or confirmed bookings can be rescheduled');
    }

    const newEndTime = new Date(newStartTime.getTime() + booking.totalDurationMinutes * 60 * 1000);

    // Check new slot availability
    const isAvailable = await this.slotEngine.isSlotAvailable(
      booking.shopId,
      newStartTime,
      newEndTime,
      booking.staffId || undefined,
      bookingId,
    );

    if (!isAvailable) {
      throw new ConflictException('Selected time slot is not available');
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        startTime: newStartTime,
        endTime: newEndTime,
      },
      include: {
        services: true,
        shop: {
          select: { name: true },
        },
      },
    });

    // Invalidate caches for both old and new dates
    this.queueService.invalidateSlotCache(booking.shopId, booking.startTime).catch(console.error);
    this.queueService.invalidateSlotCache(booking.shopId, newStartTime).catch(console.error);
    this.queueService.updateQueueStats(booking.shopId).catch(console.error);

    // Emit real-time updates
    this.queueGateway.emitQueueUpdate(booking.shopId).catch(console.error);
    this.queueGateway.emitBookingUpdate(bookingId, {
      status: 'RESCHEDULED',
      newStartTime: newStartTime.toISOString(),
    });

    return updatedBooking;
  }

  private validateStatusTransition(currentStatus: BookingStatus, newStatus: BookingStatus): void {
    const allowedTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [BookingStatus.CONFIRMED, BookingStatus.REJECTED, BookingStatus.CANCELLED],
      [BookingStatus.CONFIRMED]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED, BookingStatus.NO_SHOW],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.NO_SHOW]: [],
      [BookingStatus.REJECTED]: [],
    };

    if (!allowedTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private generateBookingNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = uuidv4().slice(0, 4).toUpperCase();
    return `OL-${timestamp}-${random}`;
  }
}
