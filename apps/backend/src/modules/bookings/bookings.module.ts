import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { NoShowCron } from './no-show.cron';
import { QueueModule } from '../queue/queue.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, QueueModule, NotificationsModule, UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService, NoShowCron],
  exports: [BookingsService],
})
export class BookingsModule { }
