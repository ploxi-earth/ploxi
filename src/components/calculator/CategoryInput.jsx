'use client';

// src/components/calculator/CategoryInput.jsx
// Reusable input component for emission source entry

import { useState, useEffect } from 'react';
import EmissionFactorTooltip from './EmissionFactorTooltip';
import { Trash2, Info } from 'lucide-react';

export default function CategoryInput({
  entry,
  index,
  sources,
  onUpdate,
  onRemove,
}) {
  const [selectedSource, setSelectedSource] = useState(entry.source || '');
  const [activityData, setActivityData] = useState(entry.activityData || '');
  const [selectedSourceData, setSelectedSourceData] = useState(null);

  // Update selected source data when source changes
  useEffect(() => {
    if (selectedSource && sources[selectedSource]) {
      setSelectedSourceData(sources[selectedSource]);

      // Update parent with new emission factor
      onUpdate(index, {
        source: selectedSource,
        activityData: parseFloat(activityData) || 0,
        emissionFactor: sources[selectedSource].factor,
        unit: sources[selectedSource].unit,
      });
    }
  }, [selectedSource, sources]);

  // Update parent when activity data changes
  useEffect(() => {
    if (selectedSource && activityData) {
      onUpdate(index, {
        source: selectedSource,
        activityData: parseFloat(activityData) || 0,
        emissionFactor: sources[selectedSource].factor,
        unit: sources[selectedSource].unit,
      });
    }
  }, [activityData]);

  // Calculate emissions preview
  const calculatePreview = () => {
    if (!activityData || !selectedSourceData) return 0;
    return (parseFloat(activityData) * selectedSourceData.factor).toFixed(2);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Source Selection */}
        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Emission Source
          </label>
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            <option value="">Select source...</option>
            {Object.keys(sources).map((sourceKey) => (
              <option key={sourceKey} value={sourceKey}>
                {sources[sourceKey].description || sourceKey}
              </option>
            ))}
          </select>
        </div>

        {/* Activity Data Input */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Activity Data
          </label>
          <input
            type="number"
            value={activityData}
            onChange={(e) => setActivityData(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        {/* Unit Display */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <div className="flex items-center h-10 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-700">
            {selectedSourceData ? (
              <EmissionFactorTooltip factorData={selectedSourceData}>
                <span className="flex items-center gap-1">
                  {selectedSourceData.unit.split(' per ')[1] || selectedSourceData.unit}
                  <Info className="w-3 h-3 text-gray-400" />
                </span>
              </EmissionFactorTooltip>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        </div>

        {/* Emissions Preview */}
        <div className="md:col-span-1 flex items-end">
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="w-full h-10 flex items-center justify-center text-red-600 hover:bg-red-50 border border-red-300 rounded-md transition"
            title="Remove entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emissions Preview */}
      {selectedSource && activityData && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Emissions from this source:</span>
            <span className="font-semibold text-green-700">
              {calculatePreview()} kg CO2e
            </span>
          </div>
        </div>
      )}
    </div>
  );
}