
'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Settings, 
  Home, 
  BarChart3,
  Building2,
  MapPin,
  FileText,
  Users,
  Loader2
} from 'lucide-react';

import EnhancedDashboardGrid from '@/components/dashboard/EnhancedDashboardGrid';
import MarketplaceGrid from '@/components/marketplace/MarketplaceGrid';
import { generateSampleMetrics } from '@/utils/generateSampleMetrics';

// Import data
import industriesData from '@/data/industries.json';

const DashboardContent = ({ config, params }) => {
  const router = useRouter();
  const { location, industry, framework, vendors } = config;
  
  const [metrics, setMetrics] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [loading, setLoading] = useState({
    metrics: true,
    vendors: true
  });
  const [error, setError] = useState({
    metrics: null,
    vendors: null
  });

  // Generate metrics on mount
  useEffect(() => {
    const generateMetrics = async () => {
      try {
        setLoading(prev => ({ ...prev, metrics: true }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const generatedMetrics = generateSampleMetrics(industry.id, framework.id);
        setMetrics(generatedMetrics);
        setLoading(prev => ({ ...prev, metrics: false }));
      } catch (err) {
        setError(prev => ({ ...prev, metrics: 'Failed to generate metrics' }));
        setLoading(prev => ({ ...prev, metrics: false }));
      }
    };

    generateMetrics();
  }, [industry.id, framework.id]);

  // Filter vendors on mount
  useEffect(() => {
    const filterVendors = async () => {
      try {
        setLoading(prev => ({ ...prev, vendors: true }));
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        let filtered = vendors;

        // Filter by location
        if (location) {
          filtered = filtered.filter(vendor => 
            !vendor.targetRegions || 
            vendor.targetRegions.length === 0 || 
            vendor.targetRegions.includes(location.code)
          );
        }

        // Filter by industry
        if (industry) {
          filtered = filtered.filter(vendor =>
            !vendor.targetIndustries || 
            vendor.targetIndustries.length === 0 ||
            vendor.targetIndustries.includes(industry.id)
          );
        }

        setFilteredVendors(filtered);
        setLoading(prev => ({ ...prev, vendors: false }));
      } catch (err) {
        setError(prev => ({ ...prev, vendors: 'Failed to load vendors' }));
        setLoading(prev => ({ ...prev, vendors: false }));
      }
    };

    filterVendors();
  }, [location, industry, vendors]);

  const handleEditConfiguration = () => {
    // Save current configuration to localStorage
    localStorage.setItem('dashboardConfig', JSON.stringify({ location, industry, framework }));
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Logo and Title */}
            <div className="flex items-center space-x-4">
              <img
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi Consults"
                className="h-10 w-10 object-contain rounded-md"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Sustainability Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  {industry.name} • {location.name} • {framework.name}
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleEditConfiguration}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Configuration</span>
              </button>
              
              <Link 
                href="/"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-green-600 font-medium">Dashboard</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{location?.name}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700">{industry?.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Configuration Summary */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-soft border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">{location.name}</div>
                  <div className="text-sm text-blue-700">Geographic Location</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium text-purple-900">{industry.name}</div>
                  <div className="text-sm text-purple-700">Industry Sector</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">{framework.name}</div>
                  <div className="text-sm text-green-700">Reporting Framework</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Metrics Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-6 h-6 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Sustainability Metrics</h2>
                <p className="text-gray-600">
                  {framework.fullName} metrics for {industry.name} sector
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {metrics.length} metrics loaded
            </div>
          </div>

          {loading.metrics ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-soft border border-gray-200 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error.metrics ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-200">
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Metrics</div>
              <p className="text-gray-600 mb-4">{error.metrics}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <EnhancedDashboardGrid
              selectedFramework={framework}
              selectedIndustry={industry}
              metrics={metrics}
            />
          )}
        </section>

        {/* Marketplace Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solution Providers</h2>
                <p className="text-gray-600">
                  Verified vendors for {industry.name} organizations in {location.name}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {loading.vendors ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading vendors...</span>
                </div>
              ) : (
                `${filteredVendors.length} vendors available`
              )}
            </div>
          </div>

          {loading.vendors ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 animate-pulse">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error.vendors ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-200">
              <div className="text-red-500 text-lg font-medium mb-2">Error Loading Vendors</div>
              <p className="text-gray-600 mb-4">{error.vendors}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Loading
              </button>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-soft border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Vendors Available
              </h3>
              <p className="text-gray-600 mb-6">
                No solution providers found for {industry.name} organizations in {location.name}.
                Try expanding your search criteria.
              </p>
              <button
                onClick={handleEditConfiguration}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Modify Configuration
              </button>
            </div>
          ) : (
            <MarketplaceGrid
              vendors={filteredVendors}
              userLocation={location}
              userIndustry={industry}
              availableIndustries={industriesData.industries}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <img
                src="https://i.postimg.cc/QM8fvftG/IMG-20250819-WA0002.jpg"
                alt="Ploxi Consults"
                className="h-8 w-8 object-contain rounded"
              />
              <span className="text-gray-600">
                © 2025 Ploxi Consults. Sustainability consulting platform.
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Dashboard: {location.name} • {industry.name} • {framework.name}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DashboardContent;