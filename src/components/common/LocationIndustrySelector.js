'use client'

import React, { useState, useEffect } from 'react';
import { ChevronDown, CheckCircle } from 'lucide-react';

// Mock data imports
const mockLocations = [
  { id: "india", name: "India", code: "IN", reportingFrameworks: ["BRSR", "GRI"] },
  { id: "usa", name: "United States", code: "US", reportingFrameworks: ["SASB", "GRI", "TCFD"] },
  { id: "eu", name: "European Union", code: "EU", reportingFrameworks: ["TCFD", "ESRS", "GRI"] },
  { id: "uae", name: "United Arab Emirates", code: "AE", reportingFrameworks: ["GRI", "TCFD"] }
];

const mockIndustries = [
  { id: "healthcare", name: "Healthcare" },
  { id: "real_estate", name: "Real Estate" },
  { id: "cement", name: "Cement" },
  { id: "steel", name: "Steel" },
  { id: "manufacturing", name: "Manufacturing" },
  { id: "logistics", name: "Logistics" },
  { id: "automotive", name: "Automotive" },
  { id: "education", name: "Education" },
  { id: "finance", name: "Finance" },
  { id: "it_datacenter", name: "IT / Data Center" }
];

const allFrameworks = [
  { id: "brsr", name: "BRSR", fullName: "Business Responsibility and Sustainability Reporting" },
  { id: "gri", name: "GRI", fullName: "Global Reporting Initiative" },
  { id: "sasb", name: "SASB", fullName: "Sustainability Accounting Standards Board" },
  { id: "tcfd", name: "TCFD", fullName: "Task Force on Climate-related Financial Disclosures" },
  { id: "esrs", name: "ESRS", fullName: "European Sustainability Reporting Standards" }
];

const LocationIndustrySelector = ({ onSelectionChange, className = "" }) => {
  // State management
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [selectedFramework, setSelectedFramework] = useState(null);
  const [availableFrameworks, setAvailableFrameworks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState(null);

  // Load saved configuration on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('dashboardConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        if (config.location) setSelectedLocation(config.location);
        if (config.industry) setSelectedIndustry(config.industry);
        if (config.framework) setSelectedFramework(config.framework);
      } catch (err) {
        console.error('Failed to load saved config:', err);
      }
    }
  }, []);

  // Update available frameworks when location changes
  useEffect(() => {
    if (selectedLocation) {
      setIsLoading(true);
      setTimeout(() => {
        const location = mockLocations.find(loc => loc.id === selectedLocation.id);
        const frameworks = allFrameworks.filter(framework => 
          location.reportingFrameworks.includes(framework.name)
        );
        setAvailableFrameworks(frameworks);
        setIsLoading(false);
      }, 300);
    } else {
      setAvailableFrameworks([]);
      setSelectedFramework(null);
    }
  }, [selectedLocation]);

  // Handle selection
  const handleSelect = (type, item) => {
    let newLocation = selectedLocation;
    let newIndustry = selectedIndustry;
    let newFramework = selectedFramework;

    switch (type) {
      case 'location':
        newLocation = item;
        setSelectedLocation(item);
        setSelectedFramework(null);
        newFramework = null;
        break;
      case 'industry':
        newIndustry = item;
        setSelectedIndustry(item);
        break;
      case 'framework':
        newFramework = item;
        setSelectedFramework(item);
        break;
      default:
        break;
    }

    setOpenDropdown(null);

    // Call parent callback
    if (onSelectionChange) {
      onSelectionChange({
        location: newLocation,
        industry: newIndustry,
        framework: newFramework
      });
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenDropdown(openDropdown === type ? null : type);
    } else if (e.key === 'Escape') {
      setOpenDropdown(null);
    }
  };

  // Check if selection is complete
  const isSelectionComplete = selectedLocation && selectedIndustry && selectedFramework;

  // Dropdown component
  const Dropdown = ({ 
    type, 
    options, 
    selected, 
    placeholder, 
    disabled = false,
    loading = false 
  }) => {
    const isOpen = openDropdown === type;
    const isCompleted = selected !== null;
    
    return (
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenDropdown(isOpen ? null : type);
          }}
          onKeyDown={(e) => handleKeyDown(e, type)}
          disabled={disabled || loading}
          className={`
            w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg 
            shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500
            hover:border-gray-400 transition-all duration-200
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400
            ${isOpen ? 'border-green-500 ring-2 ring-green-500' : ''}
            ${isCompleted ? 'border-green-300 bg-green-50' : ''}
          `}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`Select ${type}`}
          style={{ pointerEvents: 'auto', zIndex: 1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
              <span className={selected ? 'text-gray-900' : 'text-gray-500'}>
                {loading ? 'Loading...' : selected?.name || placeholder}
              </span>
            </div>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                isOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
        </button>
        
        {isOpen && !disabled && (
          <div 
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            role="listbox"
            aria-label={`${type} options`}
            style={{ pointerEvents: 'auto' }}
          >
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(type, option);
                }}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-green-50 
                  focus:text-green-900 transition-colors duration-150
                  ${selected?.id === option.id ? 'bg-green-50 text-green-900' : 'text-gray-900'}
                `}
                role="option"
                aria-selected={selected?.id === option.id}
                style={{ pointerEvents: 'auto' }}
              >
                <div>
                  <div className="font-medium">{option.name}</div>
                  {option.fullName && (
                    <div className="text-sm text-gray-500 mt-1">{option.fullName}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Configure Your ESG Assessment
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select your location, industry, and preferred reporting framework to unlock your 
          personalized sustainability dashboard with metrics and vendor recommendations.
        </p>
      </div>

      {/* Progress Indicator */}
      {/* <div className="flex justify-center items-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${selectedLocation ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            selectedLocation ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {selectedLocation ? <CheckCircle className="w-4 h-4" /> : '1'}
          </div>
          <span className="text-sm font-medium">Location</span>
        </div>
        <div className={`w-8 h-0.5 ${selectedLocation ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        
        <div className={`flex items-center space-x-2 ${selectedIndustry ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            selectedIndustry ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {selectedIndustry ? <CheckCircle className="w-4 h-4" /> : '2'}
          </div>
          <span className="text-sm font-medium">Industry</span>
        </div>
        <div className={`w-8 h-0.5 ${selectedIndustry ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        
        <div className={`flex items-center space-x-2 ${selectedFramework ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            selectedFramework ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {selectedFramework ? <CheckCircle className="w-4 h-4" /> : '3'}
          </div>
          <span className="text-sm font-medium">Framework</span>
        </div>
      </div> */}

      {/* Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Location Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            (1) Geographic Location
          </label>
          <Dropdown
            type="location"
            options={mockLocations}
            selected={selectedLocation}
            placeholder="Select Location"
          />
        </div>

        {/* Industry Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            (2) Industry Sector
          </label>
          <Dropdown
            type="industry"
            options={mockIndustries}
            selected={selectedIndustry}
            placeholder="Select Industry"
          />
        </div>

        {/* Framework Selector */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            (3) Reporting Framework
          </label>
          <Dropdown
            type="framework"
            options={availableFrameworks}
            selected={selectedFramework}
            placeholder="Select Framework"
            disabled={!selectedLocation}
            loading={isLoading}
          />
        </div>
      </div>

      {/* Selection Summary */}
      {isSelectionComplete && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Configuration Complete! 🎉
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-700 font-medium">📍 Location:</span>
                  <span className="text-green-800">{selectedLocation.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700 font-medium">🏭 Industry:</span>
                  <span className="text-green-800">{selectedIndustry.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-700 font-medium">📊 Framework:</span>
                  <span className="text-green-800">{selectedFramework.name}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white/60 rounded-lg">
            <p className="text-sm text-green-800 text-center">
              Your personalized dashboard is being prepared. You&apos;ll be automatically redirected in a moment...
            </p>
          </div>
        </div>
      )}

      {/* Progress Messages */}
      {/* {!isSelectionComplete && (
        <div className="text-center">
          <p className="text-gray-600">
            {!selectedLocation && "👆 Start by selecting your geographic location"}
            {selectedLocation && !selectedIndustry && "👆 Next, choose your industry sector"}
            {selectedLocation && selectedIndustry && !selectedFramework && "👆 Finally, pick your reporting framework"}
          </p>
        </div>
      )} */}

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenDropdown(null);
          }}
          aria-hidden="true"
          style={{ pointerEvents: 'auto' }}
        />
      )}
    </div>
  );
};

export default LocationIndustrySelector;