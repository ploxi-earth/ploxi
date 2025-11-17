import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const FilterBar = ({ 
  onFiltersChange,
  availableIndustries = [],
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  // Solution types with colors
  const solutionTypes = [
    { id: 'Energy', label: 'Energy', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'Water', label: 'Water', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'Waste', label: 'Waste', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'Analytics', label: 'Analytics', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'Consulting', label: 'Consulting', color: 'bg-gray-100 text-gray-700 border-gray-200' }
  ];

  // Handle search with debounce effect
  React.useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleFiltersUpdate();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Update filters when other values change immediately
  React.useEffect(() => {
    handleFiltersUpdate();
  }, [selectedTypes, selectedIndustry]);

  const handleFiltersUpdate = () => {
    if (onFiltersChange) {
      onFiltersChange({
        search: searchTerm,
        types: selectedTypes,
        industry: selectedIndustry
      });
    }
  };

  const handleTypeToggle = (typeId) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleIndustrySelect = (industryId) => {
    setSelectedIndustry(industryId);
    setShowIndustryDropdown(false);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedIndustry('');
    setShowIndustryDropdown(false);
  };

  const hasActiveFilters = searchTerm || selectedTypes.length > 0 || selectedIndustry;

  return (
    <div className={`bg-white rounded-xl p-6 shadow-soft border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Filter Solutions
          </h2>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name or solution..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Solution Type Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">Solution Types</h3>
          <div className="flex flex-wrap gap-2">
            {solutionTypes.map(type => {
              const isSelected = selectedTypes.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => handleTypeToggle(type.id)}
                  className={`
                    inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                    border transition-all duration-200 ease-in-out
                    ${isSelected 
                      ? `${type.color} border-current shadow-sm` 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  {type.label}
                  {isSelected && (
                    <X className="w-3 h-3 ml-2 opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Industry Filter */}
        {availableIndustries.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Industry Focus</h3>
            <div className="relative">
              <button
                onClick={() => setShowIndustryDropdown(!showIndustryDropdown)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 
                  border border-gray-300 rounded-lg bg-white
                  hover:border-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500
                  transition-colors text-left
                  ${selectedIndustry ? 'text-gray-900' : 'text-gray-500'}
                `}
              >
                <span>
                  {selectedIndustry 
                    ? availableIndustries.find(ind => ind.id === selectedIndustry)?.name || selectedIndustry
                    : 'Select Industry'
                  }
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showIndustryDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showIndustryDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  <button
                    onClick={() => handleIndustrySelect('')}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 text-gray-600"
                  >
                    All Industries
                  </button>
                  {availableIndustries.map(industry => (
                    <button
                      key={industry.id}
                      onClick={() => handleIndustrySelect(industry.id)}
                      className={`
                        w-full px-4 py-3 text-left hover:bg-gray-50
                        ${selectedIndustry === industry.id ? 'bg-green-50 text-green-900' : 'text-gray-900'}
                      `}
                    >
                      {industry.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                 <span>Search: &quot;{searchTerm}&quot;</span>

                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedTypes.map(typeId => {
                const type = solutionTypes.find(t => t.id === typeId);
                return (
                  <div
                    key={typeId}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    <span>Type: {type?.label}</span>
                    <button
                      onClick={() => handleTypeToggle(typeId)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}

              {selectedIndustry && (
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                  <span>
                    Industry: {availableIndustries.find(ind => ind.id === selectedIndustry)?.name || selectedIndustry}
                  </span>
                  <button
                    onClick={() => setSelectedIndustry('')}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showIndustryDropdown && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowIndustryDropdown(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default FilterBar;
