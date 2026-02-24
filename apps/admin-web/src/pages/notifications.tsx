import React from 'react';
import Head from 'next/head';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '@/hooks';
import { Bell, CheckCircle, Clock, Search, ExternalLink } from 'lucide-react';
import { Card, Badge, Button, Loading, Alert } from '@/components/ui';
import { AdminLayout } from '@/components/layout';
import { format } from 'date-fns';
import { Notification } from '@/types';

export default function NotificationsPage() {
    const [filter, setFilter] = React.useState<'ALL' | 'UNREAD'>('ALL');
    const { data: notificationsData, isLoading, error } = useNotifications({
        limit: 50,
        unreadOnly: filter === 'UNREAD',
    });
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    const notifications = notificationsData?.data || [];

    const handleMarkRead = (id: string, isRead: boolean) => {
        if (!isRead && !markRead.isPending) {
            markRead.mutate(id);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'BOOKING_CONFIRMED':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'BOOKING_REMINDER':
                return <Clock className="w-5 h-5 text-amber-500" />;
            default:
                return <Bell className="w-5 h-5 text-indigo-500" />;
        }
    };

    return (
        <AdminLayout>
            <Head>
                <title>Notifications - Admin</title>
            </Head>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        <p className="text-gray-500">View and manage your alerts</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={() => setFilter('ALL')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'ALL'
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('UNREAD')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'UNREAD'
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Unread
                            </button>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => markAllRead.mutate()}
                            isLoading={markAllRead.isPending}
                            disabled={notifications.length === 0}
                        >
                            Mark All Read
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert variant="error">
                        Failed to load notifications. Please try again.
                    </Alert>
                )}

                {/* List */}
                <Card variant="default" padding="none">
                    {isLoading ? (
                        <div className="p-8 pb-12">
                            <Loading text="Loading notifications..." />
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Bell className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                You're all caught up!
                            </h3>
                            <p className="text-gray-500 max-w-sm">
                                There are no new notifications to display right now. Check back later.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => {
                                const isRead = !!notification.readAt;

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 ${!isRead ? 'bg-indigo-50/30' : ''
                                            } cursor-pointer`}
                                        onClick={() => handleMarkRead(notification.id, isRead)}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-1">
                                                <h4
                                                    className={`text-sm font-semibold truncate ${!isRead ? 'text-gray-900' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {notification.title}
                                                </h4>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                                                </span>
                                            </div>
                                            <p className={`text-sm mb-2 ${!isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                                                {notification.body}
                                            </p>

                                            {/* Optional Booking Details Badge */}
                                            {notification.data?.bookingNumber && (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-gray-200 text-xs font-medium text-gray-600">
                                                    <span>Ref: {notification.data.bookingNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                        {!isRead && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </AdminLayout>
    );
}
