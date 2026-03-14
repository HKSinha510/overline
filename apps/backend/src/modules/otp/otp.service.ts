import { Injectable, Logger, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/prisma/prisma.service';
import { RedisService } from '@/common/redis/redis.service';
import { AuthService, TokenResponse } from '../auth/auth.service';
import { Twilio } from 'twilio';

export const OTP_CONFIG = {
  LENGTH: 6, // 6-digit OTP
  EXPIRY_MINUTES: 10, // OTP expires in 10 minutes
  MAX_ATTEMPTS: 3, // Max verification attempts
  RESEND_COOLDOWN_SECONDS: 60, // Cooldown before resending OTP
};

export type OtpPurpose = 'LOGIN' | 'REGISTER' | 'VERIFY_PHONE';

@Injectable()
export class OtpService {
  private readonly logger = new Logger(OtpService.name);
  private twilioClient: Twilio | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private redis: RedisService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {
    // Initialize Twilio client if credentials are provided
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (accountSid && authToken && accountSid !== 'ACxxx') {
      this.twilioClient = new Twilio(accountSid, authToken);
      this.logger.log('Twilio SMS client initialized');
    } else {
      this.logger.warn('Twilio credentials not configured - SMS will be logged only');
    }
  }

  /**
   * Generate a random OTP
   */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP to phone number
   */
  async sendOtp(phone: string, purpose: OtpPurpose): Promise<{ message: string; expiresAt: Date; devOtp?: string }> {
    // Validate phone format (Indian format)
    if (!this.isValidIndianPhone(phone)) {
      throw new BadRequestException('Invalid phone number format. Use +91XXXXXXXXXX');
    }

    // Check cooldown
    const cooldownKey = `otp:cooldown:${phone}`;
    const isInCooldown = await this.redis.get(cooldownKey);
    if (isInCooldown) {
      const remainingSeconds = await this.redis.ttl(cooldownKey);
      throw new BadRequestException(
        `Please wait ${remainingSeconds} seconds before requesting another OTP`,
      );
    }

    // Generate OTP
    const otp = this.generateOtp();
    const expiresAt = new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000);

    // Invalidate previous OTPs for this phone
    await this.prisma.otpVerification.updateMany({
      where: {
        phone,
        isVerified: false,
        expiresAt: { gt: new Date() },
      },
      data: { expiresAt: new Date() }, // Expire immediately
    });

    // Create new OTP record
    await this.prisma.otpVerification.create({
      data: {
        phone,
        otp,
        purpose,
        expiresAt,
      },
    });

    // Set cooldown
    await this.redis.set(cooldownKey, 'active', OTP_CONFIG.RESEND_COOLDOWN_SECONDS);

    // Send SMS via Twilio or log in dev mode
    await this.sendSms(phone, `Your Overline verification code is: ${otp}. Valid for ${OTP_CONFIG.EXPIRY_MINUTES} minutes.`);

    const response: { message: string; expiresAt: Date; devOtp?: string } = {
      message: `OTP sent to ${phone}`,
      expiresAt,
    };

    // In development mode, include OTP in response for testing
    if (process.env.NODE_ENV === 'development') {
      response.devOtp = otp;
      this.logger.warn(`[DEV] OTP for ${phone}: ${otp} (included in API response)`);
    }

    return response;
  }

  /**
   * Verify OTP
   */
  async verifyOtp(
    phone: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<{ verified: boolean; userId?: string }> {
    const verification = await this.prisma.otpVerification.findFirst({
      where: {
        phone,
        purpose,
        isVerified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new BadRequestException('OTP expired or not found. Please request a new one.');
    }

    if (verification.attempts >= OTP_CONFIG.MAX_ATTEMPTS) {
      throw new BadRequestException(
        'Maximum verification attempts exceeded. Please request a new OTP.',
      );
    }

    // Increment attempts
    await this.prisma.otpVerification.update({
      where: { id: verification.id },
      data: { attempts: { increment: 1 } },
    });

    if (verification.otp !== otp) {
      const remainingAttempts = OTP_CONFIG.MAX_ATTEMPTS - verification.attempts - 1;
      throw new BadRequestException(`Invalid OTP. ${remainingAttempts} attempts remaining.`);
    }

    // Mark as verified
    await this.prisma.otpVerification.update({
      where: { id: verification.id },
      data: { isVerified: true },
    });

    // Update user's phone verification status if user exists
    const user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isPhoneVerified: true },
      });
    }

    this.logger.log(`OTP verified for phone ${phone}, purpose: ${purpose}`);

    return {
      verified: true,
      userId: user?.id,
    };
  }

  /**
   * Login with OTP — verifies OTP and returns JWT tokens
   */
  async loginWithOtp(phone: string, otp: string): Promise<TokenResponse> {
    const result = await this.verifyOtp(phone, otp, 'LOGIN');

    if (!result.verified) {
      throw new BadRequestException('OTP verification failed');
    }

    // Find or create user
    let user = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (!user) {
      // Auto-create user for OTP login
      user = await this.prisma.user.create({
        data: {
          phone,
          name: `User ${phone.slice(-4)}`,
          email: `${phone.slice(3)}@phone.overline.app`, // Placeholder email
          authProvider: 'phone',
          isPhoneVerified: true,
        },
      });
      this.logger.log(`Created new user via OTP login: ${user.id}`);
    }

    // Generate and return JWT tokens
    return this.authService.generateTokens(user);
  }

  /**
   * Validate Indian phone number format
   */
  private isValidIndianPhone(phone: string): boolean {
    // Accept formats: +91XXXXXXXXXX, 91XXXXXXXXXX, XXXXXXXXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) return true;
    if (cleaned.length === 12 && cleaned.startsWith('91')) return true;
    return false;
  }

  /**
   * Normalize phone number to +91 format
   */
  normalizePhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    return phone;
  }

  /**
   * Send SMS via Twilio
   */
  private async sendSms(phone: string, message: string): Promise<void> {
    // Always log OTP in development for testing
    if (process.env.NODE_ENV === 'development' || !this.twilioClient) {
      this.logger.warn(`[DEV MODE] SMS to ${phone}: ${message}`);
    }

    // Send actual SMS if Twilio is configured
    if (this.twilioClient) {
      try {
        const twilioPhone = this.configService.get<string>('TWILIO_PHONE_NUMBER');
        if (!twilioPhone) {
          this.logger.error('TWILIO_PHONE_NUMBER not configured');
          return;
        }

        const result = await this.twilioClient.messages.create({
          body: message,
          from: twilioPhone,
          to: phone,
        });

        this.logger.log(`SMS sent successfully. SID: ${result.sid}`);
      } catch (error: any) {
        this.logger.error(`Failed to send SMS: ${error.message}`);
        // Don't throw - allow OTP flow to continue even if SMS fails
        // The OTP is still stored and can be used for testing
      }
    }
  }
}
