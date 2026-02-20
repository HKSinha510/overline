import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  private readonly logger = new Logger(GoogleOAuthGuard.name);

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const from = request.query?.from || request.query?.state || 'user';
    return {
      state: from,
      scope: ['email', 'profile'],
      session: false,
    };
  }

  handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error(`Google OAuth error: ${err.message}`, err.stack);
      return null;
    }
    if (!user) {
      this.logger.warn(`Google OAuth: no user returned. Info: ${JSON.stringify(info)}`);
      return null;
    }
    this.logger.log(`Google OAuth: user authenticated - ${user.email}`);
    return user;
  }
}
