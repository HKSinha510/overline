import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Star, Users, Navigation } from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import type { Shop } from '@/types';

interface ShopCardProps {
  shop: Shop;
  queueInfo?: {
    currentWait: number;
    peopleInQueue: number;
  };
  userLocation?: { lat: number; lng: number; address?: string };
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, queueInfo, userLocation }) => {
  const isOpen = true; // TODO: Calculate based on working hours

  // Use server-calculated distance if available
  let distanceKm = shop.distance;
  let travelTime: string | undefined;
  if (distanceKm !== undefined && distanceKm !== null) {
    travelTime = formatTravelTime(distanceKm);
  }

  // Pick the best image: coverUrl > first photoUrl > logoUrl > gradient
  const heroImage = shop.coverUrl || shop.photoUrls?.[0] || shop.logoUrl;

  return (
    <Link href={`/shops/${shop.slug}`}>
      <Card
        variant="bordered"
        padding="none"
        className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        {/* Shop Image */}
        <div className="relative h-44 bg-gray-100 overflow-hidden">
          {heroImage ? (
            <img
              src={heroImage}
              alt={shop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-5xl text-white/80 font-bold">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={isOpen ? 'success' : 'error'}>
              {isOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>

          {/* Distance badge */}
          {distanceKm !== undefined && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                <Navigation className="w-3 h-3 text-primary-500" />
                {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)} km`}
              </div>
            </div>
          )}

          {/* Logo overlay */}
          {shop.logoUrl && heroImage !== shop.logoUrl && (
            <div className="absolute bottom-3 left-3">
              <img
                src={shop.logoUrl}
                alt=""
                className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover"
              />
            </div>
          )}

          {/* Photo count indicator */}
          {shop.photoUrls?.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              +{shop.photoUrls.length - 1} photos
            </div>
          )}
        </div>

        {/* Shop Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {shop.name}
          </h3>

          {shop.description && (
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">{shop.description}</p>
          )}

          <div className="flex items-center text-gray-500 text-sm mb-2 group/address">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0 group-hover/address:text-primary-500 transition-colors" />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.address}, ${shop.city}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate hover:text-primary-600 hover:underline transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {shop.address}, {shop.city}
            </a>
          </div>

          {/* Distance & Travel time */}
          {distanceKm !== undefined && travelTime && (
            <div className="flex items-center gap-2 text-xs text-primary-600 mb-2">
              <span className="flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m away` : `${distanceKm.toFixed(1)} km away`}
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~{travelTime} walk
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span className="font-medium text-gray-900">4.8</span>
              <span className="text-gray-400 text-sm ml-1">(120)</span>
            </div>

            {/* Quick Action Button (Visible on hover of parent card) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-lexo-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                Book next slot
                <Clock className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Queue Info */}
          {shop.queueStats && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{shop.queueStats.waitingCount} in queue</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>~{shop.queueStats.estimatedWaitMinutes} min wait</span>
              </div>
            </div>
          )}
          {queueInfo && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{queueInfo.peopleInQueue} in queue</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-1" />
                <span>~{queueInfo.currentWait} min wait</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

function formatTravelTime(distanceKm: number): string {
  const walkSpeedKmh = 5;
  const minutes = Math.round((distanceKm / walkSpeedKmh) * 60);
  if (minutes < 1) return '< 1 min';
  if (minutes >= 60) return `${Math.round(minutes / 60)}h ${minutes % 60}min`;
  return `${minutes} min`;
}

export { ShopCard };
