import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface QueueStats {
  waitingCount: number;
  estimatedWaitMinutes: number;
  nextSlot: string | null;
}

interface QueueUpdate {
  shopId: string;
  stats: QueueStats;
  queue: any;
  timestamp: string;
}

interface BookingUpdate {
  bookingId: string;
  status: string;
  updatedAt: string;
}

interface PositionUpdate {
  bookingId: string;
  position: number;
  timestamp: string;
}

interface UseQueueSocketOptions {
  shopId?: string;
  bookingId?: string;
  onQueueUpdate?: (update: QueueUpdate) => void;
  onBookingUpdate?: (update: BookingUpdate) => void;
  onPositionUpdate?: (update: PositionUpdate) => void;
  enabled?: boolean;
}

// Resolve the WebSocket URL from the API URL
function getWsUrl(): string {
  if (typeof window === 'undefined') return '';

  // In production, backend is proxied via /api => use the real backend origin
  const backendUrl = process.env.NEXT_PUBLIC_WS_URL
    || process.env.NEXT_PUBLIC_BACKEND_URL
    || '';

  if (backendUrl) return backendUrl;

  // Fallback: same origin (dev)
  return window.location.origin.replace(/^http/, 'ws');
}

export function useQueueSocket({
  shopId,
  bookingId,
  onQueueUpdate,
  onBookingUpdate,
  onPositionUpdate,
  enabled = true,
}: UseQueueSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<QueueUpdate | null>(null);

  const connect = useCallback(() => {
    if (!enabled || typeof window === 'undefined') return;

    const wsUrl = getWsUrl();
    if (!wsUrl) return;

    const socket = io(`${wsUrl}/queue`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      setConnected(true);

      // Join shop room if shopId is provided
      if (shopId) {
        socket.emit('joinShopQueue', { shopId });
      }

      // Track booking if bookingId is provided
      if (bookingId) {
        socket.emit('trackBooking', { bookingId });
      }
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('queueUpdate', (data: QueueUpdate) => {
      setLastUpdate(data);
      onQueueUpdate?.(data);
    });

    socket.on('bookingUpdate', (data: BookingUpdate) => {
      onBookingUpdate?.(data);
    });

    socket.on('positionUpdate', (data: PositionUpdate) => {
      onPositionUpdate?.(data);
    });

    socketRef.current = socket;

    return () => {
      if (shopId) {
        socket.emit('leaveShopQueue', { shopId });
      }
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, shopId, bookingId]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return {
    connected,
    lastUpdate,
    socket: socketRef.current,
  };
}
