import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Search, MapPin, Scissors, Stethoscope, ArrowRight, Star, Clock,
  Navigation, Loader2, Sparkles, Shield, Zap,
} from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { ShopCard } from '@/components/shop';
import { useShops, useLocation } from '@/hooks';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { location, loading: locationLoading, requestLocation } = useLocation(true);

  // Fetch shops — if location available, send it for distance-based sorting
  const { data: popularShops, isLoading } = useShops({
    limit: 6,
    latitude: location?.lat,
    longitude: location?.lng,
    radiusKm: 50, // Show shops within 50km on homepage
  });

  const categories = [
    {
      name: 'Salons & Barbers',
      icon: Scissors,
      description: 'Haircuts, styling, and grooming',
      href: '/explore?type=SALON',
      gradient: 'from-purple-500 to-pink-500',
      bgLight: 'bg-purple-50',
    },
    {
      name: 'Clinics',
      icon: Stethoscope,
      description: 'Medical consultations and checkups',
      href: '/explore?type=CLINIC',
      gradient: 'from-emerald-500 to-teal-500',
      bgLight: 'bg-emerald-50',
    },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-time Queue',
      description: 'See live wait times and book your slot instantly',
      gradient: 'from-amber-400 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Verified Reviews',
      description: 'Read honest reviews from real customers',
      gradient: 'from-blue-400 to-indigo-500',
    },
    {
      icon: MapPin,
      title: 'Nearby Shops',
      description: 'Find the best places close to you with GPS',
      gradient: 'from-pink-400 to-rose-500',
    },
  ];

  return (
    <>
      <Head>
        <title>Overline - Book Appointments & Skip the Queue</title>
        <meta name="description" content="Find and book appointments at the best salons and clinics near you. See real-time queue status and never wait again." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800" />
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        <div className="relative container-app py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white/90 text-sm px-4 py-1.5 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              Smart Booking Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight">
              Book Appointments.
              <br />
              <span className="bg-gradient-to-r from-amber-300 to-orange-300 bg-clip-text text-transparent">
                Skip the Queue.
              </span>
            </h1>
            <p className="text-primary-100 text-lg md:text-xl max-w-lg mx-auto">
              Find and book at the best salons and clinics near you.
              See real-time queue status and never wait again.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl shadow-primary-900/20">
              <div className="flex-1">
                <Input
                  placeholder="Search for salons, clinics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  className="border-0 focus:ring-0"
                />
              </div>
              <Link href={`/explore?q=${searchQuery}`}>
                <Button size="lg" className="px-6 rounded-xl">Search</Button>
              </Link>
            </div>
          </div>

          {/* Location indicator */}
          {location && (
            <div className="flex items-center justify-center gap-1.5 mt-5 text-primary-200 text-sm animate-fade-in">
              <MapPin className="w-4 h-4" />
              <span>{location.address || 'Location detected'}</span>
            </div>
          )}
          {locationLoading && (
            <div className="flex items-center justify-center gap-1.5 mt-5 text-primary-200 text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting your location...</span>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-14">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-7">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <div className={`relative overflow-hidden rounded-2xl p-6 ${category.bgLight} border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group`}>
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{category.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Shops */}
      <section className="bg-gray-50 py-14">
        <div className="container-app">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {location ? 'Popular Near You' : 'Popular Shops'}
              </h2>
              {location?.address && (
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {location.address}
                </p>
              )}
              {!location && !locationLoading && (
                <button
                  onClick={requestLocation}
                  className="text-sm text-primary-600 mt-1 flex items-center gap-1 hover:text-primary-700"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Enable location for nearby results
                </button>
              )}
            </div>
            <Link
              href="/explore"
              className="text-primary-600 font-medium flex items-center gap-1 hover:text-primary-700 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="h-44 skeleton" />
                  <div className="p-4 space-y-3 bg-white">
                    <div className="h-5 w-2/3 skeleton" />
                    <div className="h-4 w-full skeleton" />
                    <div className="h-4 w-1/3 skeleton" />
                  </div>
                </div>
              ))}
            </div>
          ) : popularShops?.data.length === 0 ? (
            <Card variant="bordered" className="text-center py-10">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No shops found nearby</p>
              <p className="text-gray-400 text-sm mb-4">Try expanding your search area</p>
              <Link href="/explore" className="inline-block">
                <Button variant="outline" size="sm">Explore All Shops</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularShops?.data.map((shop) => (
                <ShopCard key={shop.id} shop={shop} userLocation={location || undefined} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why Choose Overline?
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            We make booking appointments effortless and help you save time with
            real-time queue information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="text-center group">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-app py-12 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-purple-600 text-white text-center py-14 px-8">
          {/* Abstract decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
              Ready to skip the queue?
            </h2>
            <p className="text-primary-100 mb-8 max-w-md mx-auto text-lg">
              Join thousands of users who save time by booking ahead.
            </p>
            <Link href="/explore">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-primary-600 hover:bg-gray-100 font-bold px-8 rounded-xl shadow-lg"
              >
                Explore Shops →
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
