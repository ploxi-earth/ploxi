import { Suspense } from 'react';
import MarketplacePage from '@/components/pages/MarketplacePage';

export const metadata = {
  title: 'Sustainability Marketplace | Ploxi Sustainability Platform',
  description: 'Discover sustainability solution providers, procurement options, and services. From compliance management to nature-based solutions.',
};

// Loading component for Suspense
function MarketplaceLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading marketplace...</p>
      </div>
    </div>
  );
}

export default function MarketplaceRoute() {
  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplacePage />
    </Suspense>
  );
}
