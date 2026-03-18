import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService, TokenResponse } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { RegisterShopDto } from './dto/register-shop.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Extract request context for fraud detection
   */
  private getRequestContext(req: any) {
    return {
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async signup(@Body() dto: SignupDto, @Req() req: any): Promise<TokenResponse> {
    return this.authService.signup(dto, this.getRequestContext(req));
  }

  @Post('register-shop')
  @ApiOperation({ summary: 'Register a new shop owner and provision their shop' })
  @ApiResponse({ status: 201, description: 'Shop and owner registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async registerShop(@Body() dto: RegisterShopDto, @Req() req: any): Promise<TokenResponse> {
    return this.authService.registerShop(dto, this.getRequestContext(req));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto, @Req() req: any): Promise<TokenResponse> {
    return this.authService.login(dto, this.getRequestContext(req));
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login or signup with Google (ID token)' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 401, description: 'Invalid Google token' })
  async googleLogin(@Body() dto: GoogleLoginDto): Promise<TokenResponse> {
    return this.authService.googleLogin(dto);
  }

  @Get('google/redirect')
  @ApiOperation({ summary: 'Redirect to Google for OAuth login' })
  async googleRedirect(@Req() req: any, @Res() res: Response, @Query('from') from?: string) {
    const clientId = this.configService.get<string>('google.clientId');
    if (!clientId) {
      return res.redirect('/auth/login?error=google_not_configured');
    }

    const backendUrl = this.configService.get<string>('backendUrl') || 'http://localhost:3001';
    const redirectUri = `${backendUrl}/api/v1/auth/google/callback`;
    const state = from || 'user';

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      state,
      prompt: 'consent',
    });

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    return res.redirect(googleAuthUrl);
  }

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(
    @Req() req: any,
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
  ) {
    const isAdmin = state === 'admin';
    const frontendUrl = isAdmin
      ? this.configService.get<string>('frontendUrls.admin') || 'http://localhost:3002'
      : this.configService.get<string>('frontendUrls.user') || 'http://localhost:3000';
    const loginPath = isAdmin ? '/login' : '/auth/login';

    if (error || !code) {
      return res.redirect(`${frontendUrl}${loginPath}?error=google_auth_failed`);
    }

    try {
      const clientId = this.configService.get<string>('google.clientId');
      const clientSecret = this.configService.get<string>('google.clientSecret');

      if (!clientId || !clientSecret) {
        console.error('[GoogleCallback] Missing Google OAuth credentials in environment');
        return res.redirect(`${frontendUrl}${loginPath}?error=google_not_configured`);
      }

      const backendUrl = this.configService.get<string>('backendUrl') || 'http://localhost:3001';
      const redirectUri = `${backendUrl}/api/v1/auth/google/callback`;

      // Exchange code for tokens
      const tokenParams = new URLSearchParams();
      tokenParams.append('code', code);
      tokenParams.append('client_id', clientId);
      tokenParams.append('client_secret', clientSecret);
      tokenParams.append('redirect_uri', redirectUri);
      tokenParams.append('grant_type', 'authorization_code');

      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: tokenParams.toString(),
      });

      const tokenData = (await tokenResponse.json()) as {
        access_token?: string;
        [key: string]: any;
      };

      if (!tokenResponse.ok) {
        console.error('[GoogleCallback] Token exchange failed:', JSON.stringify(tokenData));
        console.error('[GoogleCallback] Status:', tokenResponse.status);
        return res.redirect(`${frontendUrl}${loginPath}?error=google_auth_failed`);
      }

      // Get user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const userInfo = (await userInfoResponse.json()) as {
        id: string;
        email: string;
        name: string;
        picture?: string;
        verified_email?: boolean;
        [key: string]: any;
      };

      if (!userInfo.id || !userInfo.email) {
        console.error('[GoogleCallback] Invalid user info:', JSON.stringify(userInfo));
        return res.redirect(`${frontendUrl}${loginPath}?error=google_auth_failed`);
      }

      console.log('[GoogleCallback] User info retrieved:', {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        verified: userInfo.verified_email,
      });

      const tokens = await this.authService.handleGoogleUser(
        userInfo.id,
        userInfo.email,
        userInfo.name,
        userInfo.picture,
        userInfo.verified_email,
      );

      const redirectParams = new URLSearchParams({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: String(tokens.expiresIn),
        user: JSON.stringify(tokens.user),
      });

      return res.redirect(`${frontendUrl}/auth/google/callback?${redirectParams.toString()}`);
    } catch (err: any) {
      console.error('[GoogleCallback] Error:', err.message);
      console.error('[GoogleCallback] Stack:', err.stack);
      console.error('[GoogleCallback] Full error:', JSON.stringify(err, null, 2));
      return res.redirect(`${frontendUrl}${loginPath}?error=google_auth_failed`);
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenResponse> {
    return this.authService.refreshToken(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate refresh tokens' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  async logout(
    @Req() req: any,
    @Body() body: { refreshToken?: string },
  ): Promise<{ message: string }> {
    await this.authService.logout(req.user.id, body.refreshToken);
    return { message: 'Logged out successfully' };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(req.user.id, dto.currentPassword, dto.newPassword);
    return { message: 'Password changed successfully' };
  }
}
