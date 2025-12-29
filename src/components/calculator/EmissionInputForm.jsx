'use client';

// src/components/calculator/EmissionInputForm.jsx
// Main form component for adding emission entries

import { useState, useEffect } from 'react';
import CategoryInput from './CategoryInput';
import { Plus } from 'lucide-react';

export default function EmissionInputForm({
  scope,
  emissionFactorsData,
  entries,
  onEntriesChange,
}) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availableSources, setAvailableSources] = useState({});

  // Load categories for current scope
  useEffect(() => {
    if (emissionFactorsData?.categories?.[scope]) {
      setCategories(emissionFactorsData.categories[scope]);
      if (emissionFactorsData.categories[scope].length > 0) {
        setSelectedCategory(emissionFactorsData.categories[scope][0].id);
      }
    }
  }, [scope, emissionFactorsData]);

  // Load sources for selected category
  useEffect(() => {
    if (emissionFactorsData && selectedCategory) {
      const categoryKey = getCategoryKey(selectedCategory);
      const sources = emissionFactorsData.emissionFactors?.[scope]?.[categoryKey] || {};
      setAvailableSources(sources);
    }
  }, [selectedCategory, scope, emissionFactorsData]);

  // Map category ID to data key
  const getCategoryKey = (categoryId) => {
    const mapping = {
      stationary: 'stationaryCombustion',
      mobile: 'mobileCombustion',
      fugitive: 'fugitiveEmissions',
      electricity: 'electricity',
      heating: 'districtHeating',
      businessTravel: 'businessTravel',
      commuting: 'employeeCommuting',
      waste: 'wasteDisposal',
    };
    return mapping[categoryId] || categoryId;
  };

  // Add new entry
  const handleAddEntry = () => {
    const newEntry = {
      id: Date.now(),
      category: selectedCategory,
      source: '',
      activityData: 0,
      emissionFactor: 0,
      unit: '',
    };
    onEntriesChange([...entries, newEntry]);
  };

  // Update entry
  const handleUpdateEntry = (index, updatedData) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], ...updatedData };
    onEntriesChange(newEntries);
  };

  // Remove entry
  const handleRemoveEntry = (index) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onEntriesChange(newEntries);
  };

  // Calculate total for this scope
  const calculateScopeTotal = () => {
    return entries.reduce((total, entry) => {
      return total + (entry.activityData * entry.emissionFactor);
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg">
      {/* Category Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Category
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedCategory === category.id
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {category.name}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Emission Entries */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Emission Sources
          </h3>
          <button
            onClick={handleAddEntry}
            disabled={!selectedCategory || Object.keys(availableSources).length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            <Plus className="w-4 h-4" />
            Add Source
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500 mb-2">No emission sources added yet</p>
            <p className="text-sm text-gray-400">
              Click "Add Source" to start calculating emissions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry, index) => (
              <CategoryInput
                key={entry.id || index}
                entry={entry}
                index={index}
                sources={availableSources}
                onUpdate={handleUpdateEntry}
                onRemove={handleRemoveEntry}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scope Total */}
      {entries.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">
              {scope === 'scope1' && 'Scope 1 Total'}
              {scope === 'scope2' && 'Scope 2 Total'}
              {scope === 'scope3' && 'Scope 3 Total'}
            </span>
            <span className="text-2xl font-bold text-green-700">
              {calculateScopeTotal().toFixed(2)} kg CO2e
            </span>
          </div>
        </div>
      )}
    </div>
  );
}