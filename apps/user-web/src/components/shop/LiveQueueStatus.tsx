import React from 'react';
import { Users, Clock, Wifi, WifiOff } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import { useQueueSocket } from '@/hooks';

interface LiveQueueStatusProps {
  shopId: string;
}

export const LiveQueueStatus: React.FC<LiveQueueStatusProps> = ({ shopId }) => {
  const [stats, setStats] = React.useState<{
    waitingCount: number;
    estimatedWaitMinutes: number;
  } | null>(null);

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

  // Use live data if available, otherwise fallback
  const displayStats = stats || lastUpdate?.stats;

  return (
    <Card variant="bordered" className="relative overflow-hidden">
      {/* Live indicator */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Live Queue</h3>
        <div className="flex items-center gap-1.5">
          {connected ? (
            <>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Offline</span>
            </>
          )}
        </div>
      </div>

      {displayStats ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {displayStats.waitingCount}
            </div>
            <div className="text-xs text-gray-500">In Queue</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              ~{displayStats.estimatedWaitMinutes}
            </div>
            <div className="text-xs text-gray-500">Min Wait</div>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-sm text-gray-500">
          Connecting to live queue...
        </div>
      )}
    </Card>
  );
};
