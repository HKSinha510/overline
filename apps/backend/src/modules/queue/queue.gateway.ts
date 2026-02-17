import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { QueueService } from './queue.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/queue',
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(QueueGateway.name);

  constructor(private readonly queueService: QueueService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Client subscribes to queue updates for a specific shop
   */
  @SubscribeMessage('joinShopQueue')
  handleJoinShopQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { shopId: string },
  ) {
    const room = `shop:${data.shopId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room ${room}`);
    return { event: 'joined', room };
  }

  /**
   * Client unsubscribes from a shop queue
   */
  @SubscribeMessage('leaveShopQueue')
  handleLeaveShopQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { shopId: string },
  ) {
    const room = `shop:${data.shopId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
    return { event: 'left', room };
  }

  /**
   * Client subscribes to updates for their specific booking
   */
  @SubscribeMessage('trackBooking')
  handleTrackBooking(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookingId: string },
  ) {
    const room = `booking:${data.bookingId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} tracking booking ${data.bookingId}`);
    return { event: 'tracking', room };
  }

  /**
   * Emit queue stats update to all clients watching a shop
   */
  async emitQueueUpdate(shopId: string) {
    try {
      const [stats, todayQueue] = await Promise.all([
        this.queueService.getQueueStats(shopId),
        this.queueService.getTodayQueue(shopId),
      ]);

      this.server.to(`shop:${shopId}`).emit('queueUpdate', {
        shopId,
        stats,
        queue: todayQueue,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error(`Failed to emit queue update for shop ${shopId}`, error);
    }
  }

  /**
   * Emit booking status change to clients tracking that booking
   */
  emitBookingUpdate(bookingId: string, update: any) {
    this.server.to(`booking:${bookingId}`).emit('bookingUpdate', {
      bookingId,
      ...update,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Emit queue position update for a specific booking
   */
  emitPositionUpdate(bookingId: string, position: number) {
    this.server.to(`booking:${bookingId}`).emit('positionUpdate', {
      bookingId,
      position,
      timestamp: new Date().toISOString(),
    });
  }
}
