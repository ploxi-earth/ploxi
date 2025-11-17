import React, { useState } from 'react';
import { ExternalLink, MapPin, Mail, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

const VendorCard = ({ vendor, className = "" }) => {
  const router = useRouter();
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    id,
    name,
    type,
    description,
    solutions = [],
    targetRegions = [],
    contact = {},
    website,
    rating = 0,
    certifications = []
  } = vendor;

  // Solution type colors
  const typeColors = {
    Energy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    Water: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Waste: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    Analytics: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    Consulting: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  };

  const typeStyle = typeColors[type] || typeColors.Consulting;

  // Region display mapping
  const regionNames = {
    'IN': 'India',
    'US': 'USA',
    'EU': 'Europe',
    'AE': 'UAE'
  };

  // Handle card click - navigate to vendor profile
  const handleCardClick = (e) => {
    // Prevent navigation if clicking on interactive elements
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    router.push(`/vendor/${vendor.id}`);
  };

  // Solution tags display (show first 3, then +X more)
  const displaySolutions = solutions.slice(0, 3);
  const remainingSolutions = solutions.length - 3;

  // Generate default logo based on vendor name
  const getVendorLogo = () => {
    const logoEmojis = {
      'Energy': '⚡',
      'Water': '💧',
      'Waste': '♻️',
      'Analytics': '📊',
      'Consulting': '🏢'
    };
    return logoEmojis[type] || '🏢';
  };

  // Rating stars display
  const renderRating = () => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xs ${
              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div 
      onClick={handleCardClick}
      className={`
        bg-white rounded-2xl p-6 shadow-md border border-gray-200 cursor-pointer
        hover:scale-105 hover:shadow-lg transition-all ease-in-out duration-200
        ${className}
      `}
      role="article"
      aria-labelledby={`vendor-${id}-name`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e);
        }
      }}
    >
      {/* Header with Logo and Type Badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Vendor Logo */}
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl">
            {getVendorLogo()}
          </div>
          <div className="flex-1">
            <h3 
              id={`vendor-${id}-name`}
              className="text-lg font-semibold text-gray-900 leading-tight"
            >
              {name}
            </h3>
            {renderRating()}
          </div>
        </div>
        
        {/* Solution Type Badge */}
        <span 
          className={`
            inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
            ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} border
          `}
        >
          {type}
        </span>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className={`text-gray-600 text-sm leading-relaxed ${
          showFullDescription ? '' : 'line-clamp-3'
        }`}>
          {description}
        </p>
        {description.length > 150 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullDescription(!showFullDescription);
            }}
            className="text-green-600 text-sm font-medium hover:text-green-700 mt-1"
          >
            {showFullDescription ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Solution Tags */}
      {solutions.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {displaySolutions.map((solution, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 text-gray-700 text-xs font-medium border border-gray-200"
              >
                {solution.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            ))}
            {remainingSolutions > 0 && (
              <span 
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium border border-gray-300"
                title={`${remainingSolutions} more solutions available`}
              >
                +{remainingSolutions} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Regions and Contact */}
      <div className="space-y-3">
        {/* Supported Regions */}
        {targetRegions.length > 0 && (
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {targetRegions.map((region, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium"
                >
                  {regionNames[region] || region}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-3">
            {contact.email && (
              <div className="flex items-center space-x-1">
                <Mail className="w-3 h-3" />
                <span className="truncate max-w-32">
                  {contact.email.split('@')[0]}@...
                </span>
              </div>
            )}
            {website && (
              <div className="flex items-center space-x-1">
                <Globe className="w-3 h-3" />
                <span>Website</span>
              </div>
            )}
          </div>
          
          {/* View Details Link */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vendor/${id}`);
            }}
            className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium"
            aria-label={`View ${name} details`}
          >
            <span>View Details</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Certifications (if any) */}
      {certifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium">Certified:</span>
            <div className="flex flex-wrap gap-1">
              {certifications.slice(0, 2).map((cert, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-xs"
                >
                  {cert}
                </span>
              ))}
              {certifications.length > 2 && (
                <span className="text-xs text-gray-400">
                  +{certifications.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorCard;
