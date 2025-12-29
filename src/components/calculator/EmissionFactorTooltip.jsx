'use client';

// src/components/calculator/EmissionFactorTooltip.jsx
// Tooltip component to display emission factor details on hover

import { useState } from 'react';

export default function EmissionFactorTooltip({ factorData, children }) {
  const [isVisible, setIsVisible] = useState(false);

  if (!factorData) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>

      {isVisible && (
        <div className="absolute z-50 w-72 p-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl left-0 top-full">
          {/* Arrow */}
          <div className="absolute -top-2 left-4 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>

          {/* Content */}
          <div className="relative">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm">
              Emission Factor Details
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Factor:</span>
                <span className="text-gray-900 font-semibold text-right">
                  {factorData.factor} {factorData.unit}
                </span>
              </div>

              {factorData.description && (
                <div>
                  <span className="text-gray-600 font-medium">Description:</span>
                  <p className="text-gray-700 mt-1">{factorData.description}</p>
                </div>
              )}

              {factorData.source && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-gray-600 font-medium">Source:</span>
                  <p className="text-gray-700 mt-1">{factorData.source}</p>
                </div>
              )}
            </div>

            {/* Formula reminder */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 italic">
                Emissions = Activity Data × Emission Factor
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}