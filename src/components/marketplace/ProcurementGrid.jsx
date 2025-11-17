// src/components/marketplace/ProcurementGrid.jsx
'use client'

import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Filter, 
  Search, 
  Package, 
  Monitor, 
  Users, 
  IndianRupee,
  Star,
  Award,
  Leaf,
  X
} from 'lucide-react';

const ProcurementGrid = ({ items = [], vendors = [] }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priceRange: '',
    supplier: ''
  });

  const categories = [
    { id: 'software', label: 'Software', icon: Monitor, color: 'text-blue-600' },
    { id: 'consulting', label: 'Consulting', icon: Users, color: 'text-purple-600' },
    { id: 'equipment', label: 'Equipment', icon: Package, color: 'text-orange-600' }
  ];

  const priceRanges = [
    { id: 'budget', label: 'Under ₹1L', min: 0, max: 100000 },
    { id: 'mid', label: '₹1L - ₹10L', min: 100000, max: 1000000 },
    { id: 'premium', label: 'Above ₹10L', min: 1000000, max: Infinity }
  ];

  // Filter items
  const filteredItems = useMemo(() => {
    let filtered = items;

    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.supplier.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.supplier) {
      filtered = filtered.filter(item => item.supplier === filters.supplier);
    }

    if (filters.priceRange) {
      const range = priceRanges.find(r => r.id === filters.priceRange);
      if (range) {
        filtered = filtered.filter(item => {
          const itemPrice = item.price.min;
          return itemPrice >= range.min && itemPrice <= range.max;
        });
      }
    }

    return filtered;
  }, [items, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? '' : value
    }));
  };

  const clearAllFilters = () => {
    setFilters({ search: '', category: '', priceRange: '', supplier: '' });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');

  const ProcurementCard = ({ item }) => {
    const categoryInfo = categories.find(c => c.id === item.category);
    const CategoryIcon = categoryInfo?.icon || Package;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <CategoryIcon className={`w-6 h-6 ${categoryInfo?.color || 'text-gray-600'}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                {item.name}
              </h3>
              <p className="text-sm text-gray-600">{item.type}</p>
            </div>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {categoryInfo?.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {item.description}
        </p>

        {/* Price */}
        <div className="bg-green-50 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IndianRupee className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Pricing</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-900">
                ₹{item.price.min.toLocaleString()} - ₹{item.price.max.toLocaleString()}
              </div>
              <div className="text-xs text-green-700">{item.price.unit}</div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-gray-900">Key Specifications</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sustainability Benefits */}
        <div className="bg-green-50 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Leaf className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Sustainability Impact</span>
          </div>
          <div className="space-y-1">
            {Object.entries(item.sustainability).slice(0, 2).map(([key, value]) => (
              <div key={key} className="text-xs text-green-800">
                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
              </div>
            ))}
          </div>
        </div>

        {/* Supplier & Certifications */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-600">
                {item.supplier.charAt(0)}
              </span>
            </div>
            <span className="font-medium text-gray-900">{item.supplier}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3 text-yellow-500" />
            <span className="text-xs text-gray-600">
              {item.certifications.length} certs
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
          Request Quote
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ShoppingCart className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Procurement Catalog
            </h2>
            <p className="text-gray-600">
              {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} and service{filteredItems.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.label}</option>
            ))}
          </select>

          {/* Price Range Filter */}
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Price Ranges</option>
            {priceRanges.map(range => (
              <option key={range.id} value={range.id}>{range.label}</option>
            ))}
          </select>

          {/* Supplier Filter */}
          <select
            value={filters.supplier}
            onChange={(e) => handleFilterChange('supplier', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Suppliers</option>
            {[...new Set(items.map(item => item.supplier))].map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
            {filters.search && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                <span>Search: &quot;{filters.search}&quot;</span>
                <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                <span>Category: {categories.find(c => c.id === filters.category)?.label}</span>
                <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <ProcurementCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters to find more procurement options.
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProcurementGrid;
