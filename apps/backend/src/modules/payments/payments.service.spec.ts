import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PaymentStatus } from '@prisma/client';

describe('PaymentsService', () => {
    let service: PaymentsService;

    const mockPrismaService = {
        booking: {
            findUnique: jest.fn(),
        },
        payment: {
            upsert: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn((cb) => cb(mockPrismaService)),
    };

    const mockConfigService = {
        get: jest.fn().mockImplementation((key) => {
            // Mock stripe key so service initializes stripe correctly
            if (key === 'STRIPE_SECRET_KEY') return 'sk_test_123';
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<PaymentsService>(PaymentsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createPaymentIntent', () => {
        it('should throw if booking does not exist', async () => {
            mockPrismaService.booking.findUnique.mockResolvedValue(null);
            await expect(service.createPaymentIntent({ bookingId: 'b-1' }, 'user-1'))
                .rejects.toThrow(NotFoundException);
        });

        it('should throw if payment already completed', async () => {
            mockPrismaService.booking.findUnique.mockResolvedValue({
                id: 'b-1',
                userId: 'user-1',
                payment: { status: PaymentStatus.COMPLETED },
            });
            await expect(service.createPaymentIntent({ bookingId: 'b-1' }, 'user-1'))
                .rejects.toThrow(BadRequestException);
        });
    });
});
