import React from 'react';
import Head from 'next/head';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  UserPlus,
  Play,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { Card, Badge, Button, StatCard, Loading } from '@/components/ui';
import { useDashboard, useAdminBookings, useStartService, useMarkComplete } from '@/hooks';
import { useAuthStore } from '@/stores/auth';
import { LiveTracking } from '@/components/dashboard/LiveTracking';
import { formatTime, formatPrice, cn } from '@/lib/utils';
import { BookingStatus } from '@/types';

/**
 * Trust Score level indicator
 * - Danger: < 10% with > 5 bookings (blacklisted)
 * - Warning: < 40% (high risk - frequent no-shows)
 */
function getTrustLevel(user: any): 'normal' | 'warning' | 'danger' | null {
  if (!user) return null;
  const score = user.trustScore ?? 100;
  const totalBookings = user.totalBookings ?? 0;
  
  if (score < 10 && totalBookings > 5) return 'danger';
  if (score < 40) return 'warning';
  return 'normal';
}

export default function DashboardPage() {
  const { data: dashboard, isLoading: loadingDashboard } = useDashboard();
  const { data: todayBookings, isLoading: loadingBookings } = useAdminBookings({
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  const startService = useStartService();
  const markComplete = useMarkComplete();
  const { shopId } = useAuthStore();

  if (loadingDashboard || loadingBookings) {
    return <Loading text="Loading dashboard..." />;
  }

  const todayStats = dashboard?.todayStats || {
    total: 0,
    completed: 0,
    upcoming: 0,
    inProgress: 0,
    noShow: 0,
    revenue: 0,
  };

  const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'error' | 'default' }> = {
    PENDING: { label: 'Pending', variant: 'warning' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    IN_PROGRESS: { label: 'In Progress', variant: 'info' },
    COMPLETED: { label: 'Completed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'error' },
    NO_SHOW: { label: 'No Show', variant: 'error' },
  };

  return (
    <>
      <Head>
        <title>Dashboard - Overline Admin</title>
      </Head>

      <div>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>

        {/* Stats Grid - Auto-fit for flexible desktop layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Today's Appointments"
            value={todayStats.total}
            icon={Calendar}
            gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <StatCard
            title="In Queue"
            value={todayStats.upcoming + todayStats.inProgress}
            icon={Users}
            gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          />
          <StatCard
            title="Completed"
            value={todayStats.completed}
            icon={Clock}
            gradient="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <StatCard
            title="Today's Revenue"
            value={formatPrice(todayStats.revenue)}
            icon={DollarSign}
            gradient="bg-gradient-to-br from-emerald-500 to-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Today's Queue - takes 8 of 12 columns on desktop */}
          <div className="lg:col-span-8 xl:col-span-8">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Today's Queue</h2>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Walk-in
                </Button>
              </div>

              {todayBookings?.data.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayBookings?.data.slice(0, 8).map((booking) => {
                    const config = statusConfig[booking.status] || statusConfig.PENDING;
                    const trustLevel = getTrustLevel(booking.user);

                    return (
                      <div
                        key={booking.id}
                        className={cn(
                          'flex items-center justify-between p-4 rounded-lg border',
                          booking.status === 'IN_PROGRESS'
                            ? 'border-primary-200 bg-primary-50'
                            : 'border-gray-200'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center min-w-[60px]">
                            <p className="text-lg font-bold text-gray-900">
                              {formatTime(booking.startTime)}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">
                                {booking.user?.name || 'Walk-in'}
                              </p>
                              {/* Trust Score Warning */}
                              {trustLevel === 'danger' && (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs font-medium"
                                  title={`Trust Score: ${booking.user?.trustScore?.toFixed(0)}%`}
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </span>
                              )}
                              {trustLevel === 'warning' && (
                                <span 
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-medium"
                                  title={`Trust Score: ${booking.user?.trustScore?.toFixed(0)}% - High Risk`}
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {booking.services?.map((s) => s.serviceName).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant={config.variant}>{config.label}</Badge>

                          {booking.status === 'CONFIRMED' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startService.mutate(booking.id)}
                              isLoading={startService.isPending}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          )}

                          {booking.status === 'IN_PROGRESS' && (
                            <Button
                              size="sm"
                              onClick={() => markComplete.mutate(booking.id)}
                              isLoading={markComplete.isPending}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Activity - takes 4 of 12 columns on desktop */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">
            {shopId && <LiveTracking shopId={shopId} />}
            {/* Quick Actions */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Walk-in Customer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Block Time Slot
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'New booking', time: '2 min ago', user: 'John Doe' },
                  { action: 'Service completed', time: '15 min ago', user: 'Jane Smith' },
                  { action: 'Booking cancelled', time: '1 hour ago', user: 'Mike Johnson' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 mt-2" />
                    <div>
                      <p className="text-sm text-gray-900">
                        {activity.action}: <span className="font-medium">{activity.user}</span>
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
