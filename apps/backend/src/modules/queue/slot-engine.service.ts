import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { DayOfWeek } from '@prisma/client';

export interface TimeSlot {
  startTime: string; // ISO string
  endTime: string; // ISO string
  available: boolean;
  staffId?: string;
}

export interface SlotQuery {
  shopId: string;
  date: string; // YYYY-MM-DD
  serviceIds: string[];
  duration?: number; // Duration in minutes (used if no serviceIds provided)
  staffId?: string;
}

@Injectable()
export class SlotEngineService {
  private readonly SLOT_INTERVAL_MINUTES = 15; // Slot granularity

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Calculate available time slots for given services on a date
   */
  async getAvailableSlots(query: SlotQuery): Promise<TimeSlot[]> {
    const { shopId, date, serviceIds, duration, staffId } = query;

    // Check cache first
    const cacheKey = `${shopId}:${date}:${serviceIds.sort().join(',')}:${staffId || 'any'}`;
    const cached = await this.redis.getCachedSlots(cacheKey, date);
    if (cached) {
      return JSON.parse(cached as any);
    }

    // Get shop details
    // Use local-noon to avoid UTC midnight shifting the date to the previous day
    // in negative-offset timezones (e.g. PST/EST).
    const [y, m, d] = date.split('-').map(Number);
    const localNoon = new Date(y, m - 1, d, 12, 0, 0);
    const localDateStart = new Date(y, m - 1, d, 0, 0, 0);
    const localDateEnd = new Date(y, m - 1, d, 23, 59, 59, 999);

    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        workingHours: true,
        specialSchedules: {
          where: {
            // Use local midnight boundaries so the date lookup matches regardless of server TZ
            date: { gte: localDateStart, lte: localDateEnd },
          },
        },
      },
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Calculate total duration from services or use provided duration
    let totalDuration = duration || 30;

    if (serviceIds.length > 0) {
      const services = await this.prisma.service.findMany({
        where: {
          id: { in: serviceIds },
          shopId,
          isActive: true,
        },
      });

      if (services.length !== serviceIds.length) {
        throw new NotFoundException('One or more services not found');
      }

      totalDuration = services.reduce((sum, s) => sum + s.durationMinutes, 0);
    }

    // Get working hours for the day
    // Use localNoon (local time) — date-only strings like '2026-03-16' parse as UTC
    // midnight, which shifts to the previous calendar day in US timezones.
    const dayOfWeek = this.getDayOfWeek(localNoon);
    const workingHour = shop.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);
    const specialSchedule = shop.specialSchedules[0];

    // Check if closed
    if (specialSchedule?.isClosed || workingHour?.isClosed || !workingHour) {
      return [];
    }

    // Get open/close times
    const openTime = specialSchedule?.openTime || workingHour.openTime;
    const closeTime = specialSchedule?.closeTime || workingHour.closeTime;
    const breakWindows = (workingHour.breakWindows as any[]) || [];

    // Get existing bookings for the date
    const dateStart = localDateStart;
    const dateEnd = localDateEnd;

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        shopId,
        startTime: { gte: dateStart, lte: dateEnd },
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        ...(staffId ? { staffId } : {}),
      },
      select: {
        startTime: true,
        endTime: true,
        staffId: true,
      },
    });

    // Generate all possible slots
    const slots = this.generateSlots(
      date,
      openTime,
      closeTime,
      breakWindows,
      totalDuration,
      existingBookings,
      shop.maxConcurrentBookings,
    );

    // Cache the result for 5 minutes — only cache non-empty results so that
    // a transient [] (e.g. queried before working hours were set up) is never
    // stored as a permanent stale response.
    if (slots.length > 0) {
      await this.redis.cacheSlots(cacheKey, date, JSON.stringify(slots) as any);
    }

    return slots;
  }

  /**
   * Generate time slots for a day
   */
  private generateSlots(
    date: string,
    openTime: string,
    closeTime: string,
    breakWindows: Array<{ start: string; end: string }>,
    serviceDuration: number,
    existingBookings: Array<{ startTime: Date; endTime: Date; staffId: string | null }>,
    maxConcurrent: number,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);

    const startMinutes = openHour * 60 + openMin;
    const endMinutes = closeHour * 60 + closeMin;

    const now = new Date();
    // Build local YYYY-MM-DD string instead of using toISOString() which is always
    // UTC and produces the wrong date in UTC+ timezones late in the day.
    const pad = (n: number) => String(n).padStart(2, '0');
    const localToday = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const isToday = date === localToday;
    const currentMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0;

    // Generate slots at regular intervals
    for (
      let minutes = startMinutes;
      minutes + serviceDuration <= endMinutes;
      minutes += this.SLOT_INTERVAL_MINUTES
    ) {
      // Skip past slots for today
      if (isToday && minutes < currentMinutes + 30) {
        continue; // Require at least 30 min advance booking
      }

      const slotStart = this.minutesToDateTime(date, minutes);
      const slotEnd = this.minutesToDateTime(date, minutes + serviceDuration);

      // Check if slot is during break
      const isDuringBreak = breakWindows.some((brk) => {
        const [brkStartH, brkStartM] = brk.start.split(':').map(Number);
        const [brkEndH, brkEndM] = brk.end.split(':').map(Number);
        const brkStart = brkStartH * 60 + brkStartM;
        const brkEnd = brkEndH * 60 + brkEndM;
        return minutes < brkEnd && minutes + serviceDuration > brkStart;
      });

      if (isDuringBreak) {
        continue;
      }

      // Check availability (count concurrent bookings at this time)
      const concurrentBookings = existingBookings.filter((booking) => {
        const bookingStart = booking.startTime.getTime();
        const bookingEnd = booking.endTime.getTime();
        const slotStartTime = new Date(slotStart).getTime();
        const slotEndTime = new Date(slotEnd).getTime();

        // Check for overlap
        return slotStartTime < bookingEnd && slotEndTime > bookingStart;
      });

      const available = concurrentBookings.length < maxConcurrent;

      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available,
      });
    }

    return slots;
  }

  /**
   * Get next available slot for a shop
   */
  async getNextAvailableSlot(shopId: string, serviceIds: string[]): Promise<TimeSlot | null> {
    const today = new Date();

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      const slots = await this.getAvailableSlots({
        shopId,
        date: dateStr,
        serviceIds,
      });

      const availableSlot = slots.find((s) => s.available);
      if (availableSlot) {
        return availableSlot;
      }
    }

    return null;
  }

  /**
   * Check if a specific slot is available
   */
  async isSlotAvailable(
    shopId: string,
    startTime: Date,
    endTime: Date,
    staffId?: string,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return false;
    }

    const whereClause: any = {
      shopId,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      OR: [
        {
          AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }],
        },
        {
          AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }],
        },
        {
          AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }],
        },
      ],
    };

    if (excludeBookingId) {
      whereClause.id = { not: excludeBookingId };
    }

    if (staffId) {
      whereClause.staffId = staffId;
    }

    const conflictingBookings = await this.prisma.booking.count({
      where: whereClause,
    });

    // If staff-specific, only one booking allowed
    if (staffId) {
      return conflictingBookings === 0;
    }

    // Otherwise, check against max concurrent
    return conflictingBookings < shop.maxConcurrentBookings;
  }

  /**
   * Calculate estimated wait time for a shop
   */
  async calculateWaitTime(shopId: string): Promise<number> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return 0;
    }

    const now = new Date();

    // Get pending/in-progress bookings
    const activeBookings = await this.prisma.booking.findMany({
      where: {
        shopId,
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
        startTime: { lte: new Date(now.getTime() + 4 * 60 * 60 * 1000) }, // Next 4 hours
      },
      orderBy: { startTime: 'asc' },
    });

    if (activeBookings.length === 0) {
      return 0;
    }

    // Calculate total duration of pending bookings divided by concurrent capacity
    const totalMinutes = activeBookings.reduce((sum, b) => sum + b.totalDurationMinutes, 0);
    return Math.ceil(totalMinutes / shop.maxConcurrentBookings);
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days: DayOfWeek[] = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    return days[date.getDay()];
  }

  private minutesToDateTime(date: string, minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${date}T${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  }
}
