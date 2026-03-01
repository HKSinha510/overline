import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { RedisModule } from '../../common/redis/redis.module';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { QueueGateway } from './queue.gateway';
import { SlotEngineService } from './slot-engine.service';

import { QueueTrackingService } from './queue-tracking.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [QueueController],
  providers: [QueueService, QueueGateway, SlotEngineService, QueueTrackingService],
  exports: [QueueService, QueueGateway, SlotEngineService, QueueTrackingService],
})
export class QueueModule {}
