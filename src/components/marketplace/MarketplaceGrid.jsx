// src/components/marketplace/MarketplaceGrid.jsx (Enhanced)
import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Search as SearchIcon, Filter } from 'lucide-react';
import VendorCard from './VendorCard';
import FilterBar from './FilterBar';

const MarketplaceGrid = ({ 
  vendors = [],
  userLocation = null,
  userIndustry = null,
  availableIndustries = [],
  initialFilters = {},
  className = ""
}) => {
  const [filters, setFilters] = useState({
    search: '',
    types: [],
    industry: '',
    ...initialFilters // Apply initial filters from URL params
  });

  // Update filters when initialFilters change (from URL params)
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);

  // Enhanced industry to solution type mapping
  const industryToSolutions = {
    real_estate: ['Energy', 'Water', 'Waste', 'Analytics', 'NBS'],
    logistics: ['Energy', 'Analytics', 'Carbon Credits'], 
    manufacturing: ['Energy', 'Water', 'Waste', 'Analytics', 'Compliance'],
    finance: ['Analytics', 'Consulting', 'Compliance', 'Certificates'],
    healthcare: ['Waste', 'Water', 'Analytics', 'Compliance'],
    cement: ['Energy', 'Waste', 'Analytics', 'Carbon Credits'],
    steel: ['Energy', 'Water', 'Waste', 'Carbon Credits'],
    automotive: ['Energy', 'Waste', 'Analytics', 'Carbon Credits'],
    education: ['Energy', 'Waste', 'Analytics', 'Certificates'],
    it_datacenter: ['Energy', 'Water', 'Analytics', 'Compliance']
  };

  // Enhanced filtering logic with new categories
  const filteredVendors = useMemo(() => {
    let filtered = vendors;

    // Location filtering
    if (userLocation) {
      filtered = filtered.filter(vendor => 
        !vendor.targetRegions || 
        vendor.targetRegions.length === 0 || 
        vendor.targetRegions.includes(userLocation.code)
      );
    }

    // Industry filtering
    if (userIndustry) {
      filtered = filtered.filter(vendor => 
        !vendor.targetIndustries || 
        vendor.targetIndustries.length === 0 || 
        vendor.targetIndustries.includes(userIndustry.id)
      );
    }

    // Search filtering
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(vendor => 
        vendor.name.toLowerCase().includes(searchTerm) ||
        vendor.description.toLowerCase().includes(searchTerm) ||
        vendor.solutions?.some(solution => 
          solution.toLowerCase().includes(searchTerm)
        ) ||
        vendor.type.toLowerCase().includes(searchTerm)
      );
    }

    // Solution type filtering (enhanced with new categories)
    if (filters.types.length > 0) {
      filtered = filtered.filter(vendor =>
        filters.types.includes(vendor.type)
      );
    }

    // Industry-specific filtering
    if (filters.industry) {
      filtered = filtered.filter(vendor =>
        !vendor.targetIndustries || 
        vendor.targetIndustries.length === 0 ||
        vendor.targetIndustries.includes(filters.industry)
      );
    }

    // Smart industry-to-solution mapping with enhanced categories
    if (userIndustry && !filters.types.length) {
      const relevantSolutionTypes = industryToSolutions[userIndustry.id] || [];
      if (relevantSolutionTypes.length > 0) {
        filtered = filtered.sort((a, b) => {
          const aRelevant = relevantSolutionTypes.includes(a.type);
          const bRelevant = relevantSolutionTypes.includes(b.type);
          if (aRelevant && !bRelevant) return -1;
          if (!aRelevant && bRelevant) return 1;
          return 0;
        });
      }
    }

    return filtered;
  }, [vendors, userLocation, userIndustry, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Show filter notification if filters are applied from URL
  const hasInitialFilters = Object.keys(initialFilters).length > 0;

  const EmptyState = () => {
    const hasActiveFilters = filters.search || filters.types.length > 0 || filters.industry;
    
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900">
            {hasActiveFilters ? 'No Vendors Found' : 'No Vendors Available'}
          </h3>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? 'Try adjusting your filters to find more relevant sustainability solution providers.'
              : 'Please configure your filters to discover relevant vendors.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => setFilters({ search: '', types: [], industry: '' })}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Solution Providers
            </h1>
            <p className="text-gray-600">
              {filteredVendors.length} solution{filteredVendors.length !== 1 ? 's' : ''} available
              {userLocation && ` in ${userLocation.name}`}
              {userIndustry && ` for ${userIndustry.name}`}
            </p>
          </div>
        </div>

        {/* Enhanced Stats */}
        {vendors.length > 0 && (
          <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
            <div className="text-center">
              <div className="font-semibold text-gray-900">{vendors.length}</div>
              <div>Total Vendors</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {new Set(vendors.map(v => v.type)).size}
              </div>
              <div>Categories</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {new Set(vendors.flatMap(v => v.targetRegions || [])).size}
              </div>
              <div>Regions</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Applied Notification */}
      {hasInitialFilters && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Filter className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-green-900 mb-1">
                Filters Applied from Dashboard
              </h4>
              <p className="text-sm text-green-700">
                Showing results based on your &quot;REDUCE THIS&quot; selection. 
                {filters.types.length > 0 && ` Filtered by: ${filters.types.join(', ')}`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filter Bar */}
      <FilterBar
        onFiltersChange={handleFiltersChange}
        availableIndustries={availableIndustries}
        initialFilters={filters}
      />

      {/* Context Information */}
      {(userLocation || userIndustry) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <SearchIcon className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Smart Filtering Active
              </h4>
              <p className="text-sm text-blue-700">
                Showing vendors relevant to{' '}
                {userLocation && <span className="font-medium">{userLocation.name}</span>}
                {userLocation && userIndustry && ' and '}
                {userIndustry && <span className="font-medium">{userIndustry.name}</span>}.
                {userIndustry && industryToSolutions[userIndustry.id] && (
                  <span className="block mt-1">
                    Recommended: {industryToSolutions[userIndustry.id].join(', ')} solutions.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVendors.map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              className="h-full"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1">
          <EmptyState />
        </div>
      )}

      {/* Load More */}
      {filteredVendors.length > 12 && (
        <div className="flex justify-center pt-8">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Load More Vendors ({filteredVendors.length - 12} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketplaceGrid;
