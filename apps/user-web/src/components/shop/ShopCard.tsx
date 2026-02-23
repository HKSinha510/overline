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

  // Use server-calculated distance if available, otherwise calculate client-side
  let distanceKm = shop.distance;
  let travelTime: string | undefined;
  if (distanceKm !== undefined && distanceKm !== null) {
    travelTime = formatTravelTime(distanceKm);
  }

  return (
    <Link href={`/shops/${shop.slug}`}>
      <Card
        variant="bordered"
        padding="none"
        className="overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      >
        {/* Shop Image */}
        <div className="relative h-40 bg-gray-100">
          {shop.logoUrl ? (
            <img
              src={shop.logoUrl}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600">
              <span className="text-4xl text-white font-bold">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
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
        </div>

        {/* Shop Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {shop.name}
          </h3>

          <div className="flex items-center text-gray-500 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{shop.address}</span>
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
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current mr-1" />
              <span className="font-medium text-gray-900">4.8</span>
              <span className="text-gray-400 text-sm ml-1">(120)</span>
            </div>
          </div>

          {/* Queue Info */}
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
