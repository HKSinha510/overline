import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface QueueUpdate {
  shopId: string;
  stats: any;
  queue: any;
  timestamp: string;
}

interface UseQueueSocketOptions {
  shopId?: string;
  onQueueUpdate?: (update: QueueUpdate) => void;
  enabled?: boolean;
}

function getWsUrl(): string {
  if (typeof window === 'undefined') return '';
  const backendUrl = process.env.NEXT_PUBLIC_WS_URL
    || process.env.NEXT_PUBLIC_BACKEND_URL
    || '';
  if (backendUrl) return backendUrl;
  return window.location.origin.replace(/^http/, 'ws');
}

export function useQueueSocket({
  shopId,
  onQueueUpdate,
  enabled = true,
}: UseQueueSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!enabled || !shopId || typeof window === 'undefined') return;

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
      socket.emit('joinShopQueue', { shopId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('queueUpdate', (data: QueueUpdate) => {
      onQueueUpdate?.(data);
    });

    socketRef.current = socket;

    return () => {
      socket.emit('leaveShopQueue', { shopId });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [enabled, shopId]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return { connected };
}
