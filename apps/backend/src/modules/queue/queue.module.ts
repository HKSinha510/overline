import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';
import { SlotEngineService } from './slot-engine.service';

@Module({
  imports: [PrismaModule],
  controllers: [QueueController],
  providers: [QueueService, SlotEngineService],
  exports: [QueueService, SlotEngineService],
})
export class QueueModule {}
