import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Shop } from '@/types';

interface ShopMapProps {
    shops: Shop[];
    userLocation?: { lat: number; lng: number };
    className?: string;
    zoom?: number;
}

// Dynamically import the inner map component so Leaflet and React-Leaflet
// are only ever loaded on the client side, bypassing Next.js SSR ESM issues
const ShopMapInner = dynamic(
    () => import('./ShopMapInner').then((mod) => mod.ShopMapInner),
    {
        ssr: false,
        loading: () => (
            <div className="w-full bg-lexo-charcoal rounded-[2.5rem] flex items-center justify-center p-8">
                <p className="text-white font-medium animate-pulse">Initializing Map Engine...</p>
            </div>
        )
    }
);

export const ShopMap: React.FC<ShopMapProps> = (props) => {
    return <ShopMapInner {...props} />;
};
