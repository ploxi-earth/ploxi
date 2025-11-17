// src/components/vendor/RelatedVendors.jsx
'use client'

import React from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

const RelatedVendors = ({ currentVendor, allVendors }) => {
  // Get related vendors based on same type or target industries
  const getRelatedVendors = () => {
    const related = allVendors
      .filter(vendor => {
        if (vendor.id === currentVendor.id) return false;
        if (vendor.type === currentVendor.type) return true;
        const sharedIndustries = vendor.targetIndustries?.some(industry =>
          currentVendor.targetIndustries?.includes(industry)
        );
        if (sharedIndustries) return true;
        return false;
      })
      .slice(0, 4);
    
    if (related.length < 4) {
      const remaining = allVendors
        .filter(vendor => 
          vendor.id !== currentVendor.id && 
          !related.find(r => r.id === vendor.id)
        )
        .slice(0, 4 - related.length);
      related.push(...remaining);
    }
    return related;
  };

  const relatedVendors = getRelatedVendors();

  const getVendorLogo = (type) => {
    const logoEmojis = {
      'Energy': '⚡',
      'Water': '💧',
      'Waste': '♻️',
      'Analytics': '📊',
      'Consulting': '🏢'
    };
    return logoEmojis[type] || '🏢';
  };

  const typeColors = {
    Energy: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    Water: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    Waste: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    Analytics: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    Consulting: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
  };

  if (relatedVendors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-soft">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Vendors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedVendors.map((vendor) => {
          const typeStyle = typeColors[vendor.type] || typeColors.Consulting;
          return (
            <Link
              key={vendor.id}
              href={`/vendor/${vendor.id}`}
              className="group block"
            >
              <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all duration-200 group-hover:scale-105">
                <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl mb-4 shadow-sm">
                  {getVendorLogo(vendor.type)}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600">
                  {vendor.name}
                </h3>
                <span 
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3
                    ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} border
                  `}
                >
                  {vendor.type}
                </span>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {vendor.description}
                </p>
                {vendor.rating && (
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i < Math.floor(vendor.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      {vendor.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                    View Profile
                  </span>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedVendors;
