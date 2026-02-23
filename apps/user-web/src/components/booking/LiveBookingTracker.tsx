import React, { useEffect, useState, useRef } from 'react';
import { MapPin, MessageCircle, Send, Navigation } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/api';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
    id: string;
    senderId: string;
    senderType: 'USER' | 'SHOP';
    content: string;
    createdAt: string;
}

export const LiveBookingTracker = ({ bookingId, shopId, startTime }: { bookingId: string; shopId: string; startTime: string }) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSharingLocation, setIsSharingLocation] = useState(false);
    const [trackingError, setTrackingError] = useState('');

    // Determine if we should start tracking
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const checkActive = () => {
            const now = new Date();
            const start = new Date(startTime);
            const diffMins = (start.getTime() - now.getTime()) / 60000;
            // Active if within 20 mins to start, or already started (diff <= 20)
            if (diffMins <= 20) {
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        };
        checkActive();
        const intv = setInterval(checkActive, 60000);
        return () => clearInterval(intv);
    }, [startTime]);

    useEffect(() => {
        if (!isActive) return;

        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:3001';
        const skt = io(`${wsUrl}/queue`);
        setSocket(skt);

        skt.on('connect', () => {
            skt.emit('trackBooking', { bookingId });
        });

        skt.on('chatMessage', (msg: ChatMessage) => {
            setMessages((prev) => [...prev, msg]);
        });

        api.get(`/queue/tracking/${bookingId}/messages`).then(({ data }) => setMessages(data || []));

        // Start geolocation watch
        let watchId: number;
        if ('geolocation' in navigator) {
            setIsSharingLocation(true);
            watchId = navigator.geolocation.watchPosition(
                (pos) => {
                    skt.emit('updateLocation', {
                        bookingId,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                },
                (err) => {
                    setTrackingError('Failed to get location. Please enable location permissions.');
                    setIsSharingLocation(false);
                },
                { enableHighAccuracy: true, maximumAge: 10000 }
            );
        }

        return () => {
            skt.disconnect();
            if (watchId) navigator.geolocation.clearWatch(watchId);
        };
    }, [isActive, bookingId]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !socket || !user) return;

        api.post(`/queue/tracking/${bookingId}/messages`, {
            senderId: user.id,
            senderType: 'USER',
            content: chatInput,
        }).then(() => {
            socket.emit('sendMessage', {
                bookingId,
                senderId: user.id,
                senderType: 'USER',
                content: chatInput,
            });
            setChatInput('');
        });
    };

    if (!isActive) {
        return (
            <Card variant="bordered" className="bg-gray-50 border-dashed">
                <div className="text-center py-4">
                    <Navigation className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <h3 className="font-medium text-gray-700">Live Journey Tracking</h3>
                    <p className="text-sm text-gray-500">Live tracking and chat will be available 20 minutes before your appointment starts.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card variant="bordered" className="border-primary-200">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
                <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-primary-500" />
                        Live Journey & Chat
                    </h3>
                    {isSharingLocation ? (
                        <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            Sharing your live location with the shop
                        </p>
                    ) : trackingError ? (
                        <p className="text-xs text-red-500 mt-1">{trackingError}</p>
                    ) : (
                        <p className="text-xs text-gray-500 mt-1">Waiting for location permission...</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col h-64 bg-gray-50 rounded-lg border overflow-hidden">
                <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-center">
                            <div>
                                <MessageCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400">If you are running late or have queries,<br />chat directly with the shop owner.</p>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-2 rounded-lg text-sm max-w-[85%] ${msg.senderType === 'USER' ? 'bg-primary-500 text-white flex-row-reverse' : 'bg-white border text-gray-800'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="p-2 bg-white border-t flex gap-2 w-full">
                    <Input
                        className="flex-1 text-sm bg-gray-50 border-gray-200"
                        placeholder="Type a message..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <Button type="submit" size="sm" className="px-3 min-w-[40px]"><Send className="w-4 h-4" /></Button>
                </form>
            </div>
        </Card>
    );
};
