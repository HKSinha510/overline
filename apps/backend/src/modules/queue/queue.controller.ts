import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { QueueService } from './queue.service';
import { SlotEngineService } from './slot-engine.service';
import { QueueTrackingService } from './queue-tracking.service';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('queue')
@Controller('queue')
export class QueueController {
  constructor(
    private readonly queueService: QueueService,
    private readonly slotEngine: SlotEngineService,
    private readonly queueTrackingService: QueueTrackingService,
  ) {}

  @Get('slots/:shopId')
  @Public()
  @ApiOperation({ summary: 'Get available time slots for booking' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiQuery({ name: 'date', required: true, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'serviceIds', required: false, description: 'Comma-separated service IDs' })
  @ApiQuery({
    name: 'duration',
    required: false,
    description: 'Duration in minutes (used if no serviceIds)',
  })
  @ApiQuery({ name: 'staffId', required: false, description: 'Optional specific staff member' })
  @ApiResponse({ status: 200, description: 'List of available time slots' })
  async getSlots(
    @Param('shopId') shopId: string,
    @Query('date') date: string,
    @Query('serviceIds') serviceIds?: string,
    @Query('duration') duration?: number,
    @Query('staffId') staffId?: string,
  ) {
    const serviceIdArray = serviceIds ? serviceIds.split(',').filter(Boolean) : [];
    return this.slotEngine.getAvailableSlots({
      shopId,
      date,
      serviceIds: serviceIdArray,
      duration: duration || 30,
      staffId,
    });
  }

  @Get('next-slot/:shopId')
  @Public()
  @ApiOperation({ summary: 'Get next available slot for booking' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  @ApiQuery({ name: 'serviceIds', required: true, description: 'Comma-separated service IDs' })
  @ApiResponse({ status: 200, description: 'Next available time slot' })
  async getNextSlot(@Param('shopId') shopId: string, @Query('serviceIds') serviceIds: string) {
    const serviceIdArray = serviceIds.split(',').filter(Boolean);
    const slot = await this.slotEngine.getNextAvailableSlot(shopId, serviceIdArray);
    return { slot };
  }

  @Get('position/:bookingId')
  @ApiOperation({ summary: 'Get queue position for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  @ApiResponse({ status: 200, description: 'Queue position number' })
  async getPosition(@Param('bookingId') bookingId: string) {
    const position = await this.queueService.getQueuePosition(bookingId);
    return { position };
  }

  // --- Tracking & Chat Endpoints ---

  @Get('tracking/:shopId')
  @ApiOperation({ summary: 'Get trackable current/next bookings for shop' })
  @ApiParam({ name: 'shopId', description: 'Shop ID' })
  async getTrackableBookings(@Param('shopId') shopId: string) {
    return this.queueTrackingService.getTrackableBookings(shopId);
  }

  @Get('tracking/:bookingId/messages')
  @ApiOperation({ summary: 'Get chat history for a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async getMessages(@Param('bookingId') bookingId: string) {
    return this.queueTrackingService.getMessages(bookingId);
  }

  @Post('tracking/:bookingId/messages')
  @ApiOperation({ summary: 'Post a chat message to a booking' })
  @ApiParam({ name: 'bookingId', description: 'Booking ID' })
  async postMessage(
    @Param('bookingId') bookingId: string,
    @Body() data: { senderId: string; senderType: 'USER' | 'SHOP'; content: string },
  ) {
    return this.queueTrackingService.createMessage(
      bookingId,
      data.senderId,
      data.senderType,
      data.content,
    );
  }
}
