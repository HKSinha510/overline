import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TrustScoreService } from './trust-score.service';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, TrustScoreService],
  exports: [UsersService, TrustScoreService],
})
export class UsersModule { }
