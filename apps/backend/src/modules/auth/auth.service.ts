import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '@/common/prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RegisterShopDto } from './dto/register-shop.dto';
import { UserRole, DayOfWeek, TenantType } from '@prisma/client';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  tenantId?: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
    role: UserRole;
    tenantId?: string;
    isEmailVerified?: boolean;
    isPhoneVerified?: boolean;
    createdAt?: Date;
  };
}

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(this.configService.get<string>('google.clientId'));
  }

  async signup(dto: SignupDto): Promise<TokenResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Check if phone already exists (if provided)
    if (dto.phone) {
      const existingPhone = await this.prisma.user.findUnique({
        where: { phone: dto.phone },
      });
      if (existingPhone) {
        throw new ConflictException('Phone number already registered');
      }
    }

    // Hash password
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds') || 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Create user
    let user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        phone: dto.phone,
        hashedPassword,
        role: UserRole.USER,
      },
    });

    // Generate OTP if phone is provided
    if (user.phone) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { otpCode, otpExpiresAt },
      });
      console.log(
        `\n\n=== [OTP SIMULATION] ===\nSent OTP ${otpCode} to ${user.phone}\n========================\n\n`,
      );
    }

    // Generate tokens
    return this.generateTokens(user);
  }

  async registerShop(dto: RegisterShopDto): Promise<TokenResponse> {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = this.configService.get<number>('bcrypt.saltRounds') || 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const slug =
      dto.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    // Create Tenant, Shop, Owner, QueueStats, and WorkingHours in a transaction
    const user = await this.prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: dto.shopName + ' Tenant',
          type: dto.shopType,
        },
      });

      // 2. Create Shop Owner (User)
      const owner = await tx.user.create({
        data: {
          email: dto.email,
          name: dto.ownerName,
          phone: dto.phone,
          hashedPassword,
          role: UserRole.OWNER,
          tenantId: tenant.id,
        },
      });

      // 3. Create Shop
      const shop = await tx.shop.create({
        data: {
          tenantId: tenant.id,
          name: dto.shopName,
          slug,
          address: dto.address,
          city: dto.city,
          state: dto.state,
          postalCode: dto.postalCode,
          phone: dto.phone,
          email: dto.email,
          latitude: dto.latitude,
          longitude: dto.longitude,
          autoAcceptBookings: true,
          maxConcurrentBookings: 1,
        },
      });

      // 4. Create Queue Stats
      await tx.queueStats.create({
        data: {
          shopId: shop.id,
          currentWaitingCount: 0,
          estimatedWaitMinutes: 0,
        },
      });

      // 5. Create Default Working Hours (Mon-Fri 09:00 to 18:00)
      const weekdays = [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY,
      ];

      for (const day of weekdays) {
        await tx.workingHours.create({
          data: {
            shopId: shop.id,
            dayOfWeek: day,
            openTime: '09:00',
            closeTime: '18:00',
            breakWindows: [],
          },
        });
      }

      await tx.workingHours.create({
        data: {
          shopId: shop.id,
          dayOfWeek: DayOfWeek.SATURDAY,
          openTime: '10:00',
          closeTime: '15:00',
          breakWindows: [],
        },
      });

      await tx.workingHours.create({
        data: {
          shopId: shop.id,
          dayOfWeek: DayOfWeek.SUNDAY,
          openTime: '09:00',
          closeTime: '18:00',
          isClosed: true,
          breakWindows: [],
        },
      });

      return owner;
    });

    // Generate tokens for the new owner
    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<TokenResponse> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // If user signed up via Google and has no password
    if (!user.hashedPassword) {
      throw new UnauthorizedException(
        'This account uses Google Sign-In. Please login with Google.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
    return this.generateTokens(user);
  }

  async googleLogin(dto: GoogleLoginDto): Promise<TokenResponse> {
    const googleClientId = this.configService.get<string>('google.clientId');

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: googleClientId,
      });
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new UnauthorizedException('Invalid Google token payload');
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;
    return this.handleGoogleUser(googleId, email, name, picture, email_verified);
  }

  async handleGoogleUser(
    googleId: string,
    email: string,
    name?: string,
    picture?: string,
    emailVerified?: boolean,
  ): Promise<TokenResponse> {
    // Check if user already exists by googleId or email
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (user) {
      // Existing user — link Google account if not already linked
      if (!user.googleId) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            authProvider: user.hashedPassword ? 'local' : 'google',
            isEmailVerified: emailVerified || user.isEmailVerified,
            avatarUrl: user.avatarUrl || picture,
          },
        });
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    } else {
      // New user — create account via Google
      user = await this.prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          googleId,
          authProvider: 'google',
          avatarUrl: picture,
          isEmailVerified: emailVerified || false,
          role: UserRole.USER,
        },
      });
    }

    return this.generateTokens(user);
  }

  async refreshToken(dto: RefreshTokenDto): Promise<TokenResponse> {
    // Find refresh token
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: dto.refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.refreshToken.delete({
        where: { id: tokenRecord.id },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    if (!tokenRecord.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Delete old refresh token
    await this.prisma.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    // Generate new tokens
    return this.generateTokens(tokenRecord.user);
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      // Delete specific refresh token
      await this.prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // Delete all refresh tokens for user
      await this.prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        tenantId: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // If user doesn't have a password (Google-only account), they can't use change-password
    if (!user.hashedPassword) {
      throw new BadRequestException(
        'Cannot change password for Google-only accounts. Set a password first.',
      );
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const saltRounds = this.configService.get<number>('bcrypt.saltRounds') || 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: userId },
      data: { hashedPassword },
    });

    // Invalidate all refresh tokens
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  private async generateTokens(user: any): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId || undefined,
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = uuidv4();
    const refreshExpiration = this.configService.get<string>('jwt.refreshExpiration') || '7d';
    const expiresAt = this.calculateExpiration(refreshExpiration);

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Calculate access token expiration in seconds
    const accessExpiration = this.configService.get<string>('jwt.accessExpiration') || '15m';
    const expiresIn = this.parseExpirationToSeconds(accessExpiration);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone || null,
        role: user.role,
        tenantId: user.tenantId,
        isEmailVerified: user.isEmailVerified ?? false,
        isPhoneVerified: user.isPhoneVerified ?? false,
        createdAt: user.createdAt,
      },
    };
  }

  private calculateExpiration(duration: string): Date {
    const seconds = this.parseExpirationToSeconds(duration);
    return new Date(Date.now() + seconds * 1000);
  }

  private parseExpirationToSeconds(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // Default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 3600;
      case 'd':
        return value * 86400;
      default:
        return 900;
    }
  }
}
