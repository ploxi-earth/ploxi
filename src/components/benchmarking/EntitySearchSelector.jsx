// src/components/benchmarking/EntitySearchSelector.jsx
'use client'

import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Building2, Users, MapPin, Tag } from 'lucide-react';

const EntitySearchSelector = ({ 
  entities = [], 
  selectedEntities = [], 
  onAddEntity, 
  onRemoveEntity, 
  entityType = 'companies' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    esgScore: '',
    type: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique filter options
  const filterOptions = useMemo(() => {
    const industries = [...new Set(entities.map(e => e.industry).filter(Boolean))];
    const regions = [...new Set(entities.map(e => e.region).filter(Boolean))];
    const types = [...new Set(entities.map(e => e.type).filter(Boolean))];
    
    return { industries, regions, types };
  }, [entities]);

  // Filter and search entities
  const filteredEntities = useMemo(() => {
    return entities.filter(entity => {
      const matchesSearch = !searchQuery || 
        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (entity.industry && entity.industry.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesIndustry = !filters.industry || entity.industry === filters.industry;
      const matchesRegion = !filters.region || entity.region === filters.region;
      const matchesType = !filters.type || entity.type === filters.type;
      
      const matchesEsgScore = !filters.esgScore || (() => {
        if (filters.esgScore === 'high') return entity.esgScore >= 80;
        if (filters.esgScore === 'medium') return entity.esgScore >= 60 && entity.esgScore < 80;
        if (filters.esgScore === 'low') return entity.esgScore < 60;
        return true;
      })();

      return matchesSearch && matchesIndustry && matchesRegion && matchesType && matchesEsgScore;
    });
  }, [entities, searchQuery, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      region: '',
      esgScore: '',
      type: ''
    });
  };

  const isSelected = (entity) => selectedEntities.some(e => e.id === entity.id);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${entityType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`
            inline-flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors
            ${showFilters 
              ? 'bg-green-100 text-green-700 border-2 border-green-200' 
              : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200'
            }
          `}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Filter Options</h4>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Industry Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <div className="space-y-1">
                {filterOptions.industries.map((industry) => (
                  <label key={industry} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.industry === industry}
                      onChange={() => handleFilterChange('industry', industry)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <div className="space-y-1">
                {filterOptions.regions.map((region) => (
                  <label key={region} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.region === region}
                      onChange={() => handleFilterChange('region', region)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter (for vendors) */}
            {entityType === 'vendors' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Solution Type</label>
                <div className="space-y-1">
                  {filterOptions.types.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={filters.type === type}
                        onChange={() => handleFilterChange('type', type)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ESG Score Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ESG Performance</label>
              <div className="space-y-1">
                {[
                  { value: 'high', label: 'High (80+)', color: 'text-green-700' },
                  { value: 'medium', label: 'Medium (60-79)', color: 'text-yellow-700' },
                  { value: 'low', label: 'Low (<60)', color: 'text-red-700' }
                ].map((score) => (
                  <label key={score.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.esgScore === score.value}
                      onChange={() => handleFilterChange('esgScore', score.value)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className={`text-sm ${score.color}`}>{score.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900">
            Available {entityType.charAt(0).toUpperCase() + entityType.slice(1)} ({filteredEntities.length})
          </h4>
          {searchQuery && (
            <span className="text-sm text-gray-600">
              Showing results for &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {filteredEntities.map((entity) => (
            <div
              key={entity.id}
              className={`
                p-4 border-2 rounded-lg transition-all duration-200 cursor-pointer
                ${isSelected(entity)
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-green-200 hover:bg-green-25'
                }
              `}
              onClick={() => isSelected(entity) ? onRemoveEntity(entity.id) : onAddEntity(entity)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h5 className="font-semibold text-gray-900 mb-1">{entity.name}</h5>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      {entityType === 'companies' ? (
                        <Building2 className="w-3 h-3" />
                      ) : (
                        <Users className="w-3 h-3" />
                      )}
                      <span>{entity.industry}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{entity.region}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  className={`
                    p-1 rounded-full transition-colors
                    ${isSelected(entity)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-green-600 hover:text-white'
                    }
                  `}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Key Metrics Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">ESG Score</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold ${
                      entity.esgScore >= 80 ? 'text-green-600' :
                      entity.esgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {entity.esgScore}
                    </span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          entity.esgScore >= 80 ? 'bg-green-500' :
                          entity.esgScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${entity.esgScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {entityType === 'companies' && entity.renewableEnergy && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Renewable Energy</span>
                    <span className="text-xs font-medium text-green-600">{entity.renewableEnergy}%</span>
                  </div>
                )}

                {entityType === 'vendors' && entity.pricing && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-600">Pricing</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      entity.pricing === 'Premium' ? 'bg-red-100 text-red-700' :
                      entity.pricing === 'Mid-range' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {entity.pricing}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredEntities.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">🔍</div>
            <p className="text-gray-600">No {entityType} found matching your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearFilters();
              }}
              className="text-green-600 hover:text-green-700 text-sm font-medium mt-2"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntitySearchSelector;
