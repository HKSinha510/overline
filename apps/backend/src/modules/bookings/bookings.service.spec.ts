import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { QueueService } from '../queue/queue.service';
import { QueueGateway } from '../queue/queue.gateway';
import { SlotEngineService } from '../queue/slot-engine.service';
import { NotificationsService } from '../notifications/notifications.service';
import { BookingStatus, BookingSource } from '@prisma/client';

describe('BookingsService', () => {
    let service: BookingsService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        shop: {
            findUnique: jest.fn(),
        },
        service: {
            findMany: jest.fn(),
        },
        booking: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(mockPrismaService)),
    };

    const mockRedisService = {};
    const mockQueueService = {
        getQueuePosition: jest.fn().mockResolvedValue(0),
        updateQueueStats: jest.fn().mockResolvedValue(true),
        invalidateSlotCache: jest.fn().mockResolvedValue(true),
    };
    const mockQueueGateway = {
        emitQueueUpdate: jest.fn().mockResolvedValue(true),
        emitBookingUpdate: jest.fn().mockResolvedValue(true),
    };
    const mockSlotEngineService = {
        isSlotAvailable: jest.fn().mockResolvedValue(true),
    };
    const mockNotificationsService = {
        sendBookingConfirmation: jest.fn().mockResolvedValue(true),
        send: jest.fn().mockResolvedValue(true),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: RedisService, useValue: mockRedisService },
                { provide: QueueService, useValue: mockQueueService },
                { provide: QueueGateway, useValue: mockQueueGateway },
                { provide: SlotEngineService, useValue: mockSlotEngineService },
                { provide: NotificationsService, useValue: mockNotificationsService },
            ],
        }).compile();

        service = module.get<BookingsService>(BookingsService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create booking', () => {
        it('should calculate totalAmount correctly with multiple services and apply offer codes', async () => {
            // Arrange
            const shopId = 'shop-123';
            const serviceIds = ['srv-1', 'srv-2'];
            const startTime = new Date(Date.now() + 86400000).toISOString(); // Tomorrow

            mockPrismaService.shop.findUnique.mockResolvedValue({ id: shopId, autoAcceptBookings: false });

            mockPrismaService.service.findMany.mockResolvedValue([
                { id: 'srv-1', name: 'Haircut', durationMinutes: 30, price: 500, currency: 'INR' },
                { id: 'srv-2', name: 'Beard Trim', durationMinutes: 15, price: 200, currency: 'INR' },
            ]);

            mockPrismaService.booking.create.mockImplementation((args) => Promise.resolve({
                id: 'booking-1',
                ...args.data,
            }));

            // Act
            const result = await service.create({
                shopId,
                serviceIds,
                startTime,
                customerName: 'Test Customer',
                customerPhone: '1234567890',
            });

            // Assert
            expect(result.totalDurationMinutes).toBe(45);
            expect(result.totalAmount).toBe(700);
            expect(result.status).toBe(BookingStatus.PENDING);
        });

        it('should apply OVERLINE10 offer code correctly (10% off)', async () => {
            const shopId = 'shop-123';
            const serviceIds = ['srv-1'];
            const startTime = new Date(Date.now() + 86400000).toISOString();

            mockPrismaService.shop.findUnique.mockResolvedValue({ id: shopId, autoAcceptBookings: false });

            mockPrismaService.service.findMany.mockResolvedValue([
                { id: 'srv-1', name: 'Premium Service', durationMinutes: 60, price: 1000, currency: 'INR' },
            ]);

            mockPrismaService.booking.create.mockImplementation((args) => Promise.resolve({ ...args.data }));

            const result = await service.create({
                shopId,
                serviceIds,
                startTime,
                customerName: 'Test Customer',
                offerCode: 'OVERLINE10',
            });

            expect(result.totalAmount).toBe(900); // 1000 - 10%
        });
    });
});
