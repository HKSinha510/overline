import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { WalletTransactionType } from '@prisma/client';

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Get current user's wallet balance
   */
  @Get('balance')
  async getBalance(@Request() req: any) {
    return this.walletService.getWalletBalance(req.user.id);
  }

  /**
   * Get wallet details with recent transactions
   */
  @Get()
  async getWallet(@Request() req: any) {
    return this.walletService.getOrCreateWallet(req.user.id);
  }

  /**
   * Get wallet transactions
   */
  @Get('transactions')
  async getTransactions(
    @Request() req: any,
    @Query('take') take?: string,
    @Query('skip') skip?: string,
    @Query('type') type?: WalletTransactionType,
  ) {
    return this.walletService.getTransactions(req.user.id, {
      take: take ? parseInt(take, 10) : 20,
      skip: skip ? parseInt(skip, 10) : 0,
      type,
    });
  }
}
