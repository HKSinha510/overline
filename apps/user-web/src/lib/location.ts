// Utility for calculating distance and travel time
// Haversine formula for distance between two lat/lng points

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate travel time (walking, 5km/h)
export function estimateTravelTime(distanceKm: number): string {
  const speedKmh = 5;
  const hours = distanceKm / speedKmh;
  const minutes = Math.round(hours * 60);
  return `${minutes} min`;
}
