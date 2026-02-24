import React from 'react';
import { Users, Clock, WifiOff, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui';
import { useQueueSocket } from '@/hooks';

interface LiveQueueStatusProps {
  shopId: string;
  /** Fallback stats from REST API (shop data) */
  fallbackStats?: {
    waitingCount: number;
    estimatedWaitMinutes: number;
  } | null;
}

export const LiveQueueStatus: React.FC<LiveQueueStatusProps> = ({ shopId, fallbackStats }) => {
  const [stats, setStats] = React.useState<{
    waitingCount: number;
    estimatedWaitMinutes: number;
  } | null>(null);

  const [timedOut, setTimedOut] = React.useState(false);

  const { connected, lastUpdate } = useQueueSocket({
    shopId,
    enabled: !!shopId,
    onQueueUpdate: (update) => {
      setStats({
        waitingCount: update.stats.waitingCount,
        estimatedWaitMinutes: update.stats.estimatedWaitMinutes,
      });
    },
  });

  // Timeout: if WS doesn't connect in 5 seconds, stop waiting
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!connected) {
        setTimedOut(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [connected]);

  // Clear timeout flag if we connect
  React.useEffect(() => {
    if (connected) setTimedOut(false);
  }, [connected]);

  // Use live data > last WS update > REST fallback
  const displayStats = stats || lastUpdate?.stats || fallbackStats;

  // Don't show anything if there's no data and connection timed out
  if (!displayStats && timedOut) {
    return null; // Don't render a stuck widget
  }

  // Still connecting and no fallback data
  if (!displayStats && !timedOut) {
    return null; // Don't show "connecting..." — just skip until data is ready
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100">
      <div className="flex items-center gap-1.5">
        {connected ? (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
        ) : (
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400" />
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 text-indigo-700 font-medium">
          <Users className="w-4 h-4" />
          {displayStats!.waitingCount} in queue
        </span>
        <span className="text-indigo-300">•</span>
        <span className="flex items-center gap-1 text-indigo-600">
          <Clock className="w-4 h-4" />
          ~{displayStats!.estimatedWaitMinutes} min wait
        </span>
      </div>
    </div>
  );
};
