// src/components/pages/BenchmarkingPage.jsx
'use client'

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Download, 
  BarChart3, 
  Target,
  Users,
  ShoppingCart,
  ArrowUpDown,
  CheckCircle,
  AlertTriangle,
  Minus,
  Building2 
} from 'lucide-react';
import EntitySearchSelector from '../benchmarking/EntitySearchSelector';
import ComparisonTable from '../benchmarking/ComparisonTable';
import ProcurementAnalysis from '../benchmarking/ProcurementAnalysis';

const BenchmarkingPage = () => {
  const [activeTab, setActiveTab] = useState('companies');
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [comparisonMode, setComparisonMode] = useState('overview'); // overview, detailed, procurement

  // Sample entity data (this would come from your API)
  const sampleEntities = {
    companies: [
      {
        id: 'microsoft',
        name: 'Microsoft Corporation',
        industry: 'Technology',
        region: 'North America',
        esgScore: 89,
        carbonFootprint: 1.2,
        renewableEnergy: 74,
        waterUsage: 2150,
        wasteReduction: 67,
        socialScore: 92,
        governanceScore: 87,
        revenue: 211915,
        employees: 221000,
        sustainability: {
          carbonNeutral: true,
          renewableCommitment: 2025,
          waterPositive: 2030,
          zeroWaste: 2030
        }
      },
      {
        id: 'unilever',
        name: 'Unilever PLC',
        industry: 'Consumer Goods',
        region: 'Europe',
        esgScore: 82,
        carbonFootprint: 2.8,
        renewableEnergy: 56,
        waterUsage: 3890,
        wasteReduction: 78,
        socialScore: 88,
        governanceScore: 79,
        revenue: 60070,
        employees: 149000,
        sustainability: {
          carbonNeutral: true,
          renewableCommitment: 2030,
          waterPositive: 2025,
          zeroWaste: 2025
        }
      },
      {
        id: 'patagonia',
        name: 'Patagonia Inc.',
        industry: 'Retail',
        region: 'North America',
        esgScore: 94,
        carbonFootprint: 0.8,
        renewableEnergy: 89,
        waterUsage: 1250,
        wasteReduction: 89,
        socialScore: 96,
        governanceScore: 91,
        revenue: 1000,
        employees: 3000,
        sustainability: {
          carbonNeutral: true,
          renewableCommitment: 2022,
          waterPositive: 2024,
          zeroWaste: 2023
        }
      }
    ],
    vendors: [
      {
        id: 'furaat',
        name: 'Furaat',
        type: 'Water',
        industry: 'Water Management',
        region: 'India',
        esgScore: 78,
        costEfficiency: 85,
        innovationScore: 72,
        clientSatisfaction: 89,
        deliveryTime: 'Fast',
        certifications: ['ISO 14001', 'BRSR'],
        pricing: 'Mid-range',
        sustainability: {
          carbonNeutral: false,
          renewableEnergy: 45,
          localSourcing: 78
        }
      },
      {
        id: 'plastifischer',
        name: 'Plastic Fischer',
        type: 'Waste',
        industry: 'Waste Management',
        region: 'India',
        esgScore: 91,
        costEfficiency: 76,
        innovationScore: 88,
        clientSatisfaction: 92,
        deliveryTime: 'Standard',
        certifications: ['B-Corp', 'ISO 14001'],
        pricing: 'Premium',
        sustainability: {
          carbonNeutral: true,
          renewableEnergy: 67,
          localSourcing: 89
        }
      }
    ]
  };

  const tabs = [
    { id: 'companies', name: 'Companies', icon: Building2, description: 'Compare organizational ESG performance' },
    { id: 'vendors', name: 'Vendors', icon: Users, description: 'Benchmark solution providers' },
    { id: 'procurement', name: 'Procurement', icon: ShoppingCart, description: 'Procurement-focused analysis' }
  ];

  const handleAddEntity = (entity) => {
    if (!selectedEntities.find(e => e.id === entity.id)) {
      setSelectedEntities([...selectedEntities, entity]);
    }
  };

  const handleRemoveEntity = (entityId) => {
    setSelectedEntities(selectedEntities.filter(e => e.id !== entityId));
  };

  const handleExportData = (format) => {
    // This would implement actual export functionality
    console.log(`Exporting data as ${format}`);
    // For demo purposes, show a toast or modal
    alert(`Exporting comparison data as ${format.toUpperCase()}...`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center p-10">
        <h1 className="text-3xl font-bold text-white-900 mb-4">
          ESG Benchmarking & Analysis
        </h1>
        <p className="text-white-600 max-w-3xl mx-auto">
          Compare sustainability performance across organizations, vendors, and procurement options. 
          Make data-driven decisions with comprehensive ESG benchmarking.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-lg font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[#e9f1ea] text-green-700 border-2 border-green-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className="text-xs opacity-75">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Entity Search & Selection */}
        <div className="space-y-6">
          <EntitySearchSelector
            entities={sampleEntities[activeTab] || []}
            selectedEntities={selectedEntities}
            onAddEntity={handleAddEntity}
            onRemoveEntity={handleRemoveEntity}
            entityType={activeTab}
          />

          {/* Selected Entities Summary */}
          {selectedEntities.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-900">
                  Selected for Comparison ({selectedEntities.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleExportData('csv')}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={() => handleExportData('excel')}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {selectedEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="inline-flex items-center space-x-2 px-3 py-1 bg-white rounded-lg border border-green-300"
                  >
                    <span className="text-green-900 font-medium">{entity.name}</span>
                    <button
                      onClick={() => handleRemoveEntity(entity.id)}
                      className="text-green-600 hover:text-green-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Content */}
      {selectedEntities.length > 0 && (
        <div className="space-y-8">
          {/* Comparison Mode Toggle */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Analysis Mode</h3>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart3 },
                  { id: 'detailed', name: 'Detailed', icon: Target },
                  ...(activeTab === 'vendors' ? [{ id: 'procurement', name: 'Procurement', icon: ShoppingCart }] : [])
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setComparisonMode(mode.id)}
                      className={`
                        inline-flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200
                        ${comparisonMode === mode.id
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Render appropriate comparison component */}
          {comparisonMode === 'procurement' && activeTab === 'vendors' ? (
            <ProcurementAnalysis entities={selectedEntities} />
          ) : (
            <ComparisonTable 
              entities={selectedEntities}
              mode={comparisonMode}
              entityType={activeTab}
              onExport={handleExportData}
            />
          )}
        </div>
      )}

      {/* Empty State */}
      {selectedEntities.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Start Your Benchmarking Analysis
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Search and select {activeTab} above to begin comparing ESG performance, 
            sustainability metrics, and key benchmarks.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Performance Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Goal Comparison</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Results</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BenchmarkingPage;
