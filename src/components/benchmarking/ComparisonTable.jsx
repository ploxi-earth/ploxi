// src/components/benchmarking/ComparisonTable.jsx
'use client'

import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Award,
  Target,
  Zap
} from 'lucide-react';

const ComparisonTable = ({ entities = [], mode = 'overview', entityType = 'companies', onExport }) => {
  const [sortBy, setSortBy] = useState('esgScore');
  const [sortOrder, setSortOrder] = useState('desc');

  // Define metrics based on entity type and mode
  const getMetrics = () => {
    if (entityType === 'companies') {
      if (mode === 'overview') {
        return [
          { key: 'esgScore', label: 'ESG Score', type: 'score', unit: '/100' },
          { key: 'carbonFootprint', label: 'Carbon Footprint', type: 'number', unit: 'tons CO₂e/M$' },
          { key: 'renewableEnergy', label: 'Renewable Energy', type: 'percentage', unit: '%' },
          { key: 'socialScore', label: 'Social Score', type: 'score', unit: '/100' },
          { key: 'governanceScore', label: 'Governance Score', type: 'score', unit: '/100' }
        ];
      } else {
        return [
          { key: 'esgScore', label: 'ESG Score', type: 'score', unit: '/100' },
          { key: 'carbonFootprint', label: 'Carbon Footprint', type: 'number', unit: 'tons CO₂e/M$' },
          { key: 'renewableEnergy', label: 'Renewable Energy', type: 'percentage', unit: '%' },
          { key: 'waterUsage', label: 'Water Usage', type: 'number', unit: 'L/day' },
          { key: 'wasteReduction', label: 'Waste Reduction', type: 'percentage', unit: '%' },
          { key: 'socialScore', label: 'Social Score', type: 'score', unit: '/100' },
          { key: 'governanceScore', label: 'Governance Score', type: 'score', unit: '/100' },
          { key: 'employees', label: 'Employees', type: 'number', unit: '' },
          { key: 'revenue', label: 'Revenue', type: 'currency', unit: 'M$' }
        ];
      }
    } else {
      return [
        { key: 'esgScore', label: 'ESG Score', type: 'score', unit: '/100' },
        { key: 'costEfficiency', label: 'Cost Efficiency', type: 'score', unit: '/100' },
        { key: 'innovationScore', label: 'Innovation', type: 'score', unit: '/100' },
        { key: 'clientSatisfaction', label: 'Client Satisfaction', type: 'score', unit: '/100' },
        { key: 'deliveryTime', label: 'Delivery Time', type: 'text', unit: '' },
        { key: 'pricing', label: 'Pricing', type: 'text', unit: '' }
      ];
    }
  };

  const metrics = getMetrics();

  const sortedEntities = useMemo(() => {
    return [...entities].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      
      return 0;
    });
  }, [entities, sortBy, sortOrder]);

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('desc');
    }
  };

  const formatValue = (value, metric) => {
    if (value === null || value === undefined) return '-';
    
    switch (metric.type) {
      case 'score':
        return (
          <div className="flex items-center space-x-2">
            <span className={`font-semibold ${
              value >= 80 ? 'text-green-600' :
              value >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {value}
            </span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  value >= 80 ? 'bg-green-500' :
                  value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      
      case 'percentage':
        return (
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-blue-600">{value}%</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      
      case 'number':
        return (
          <span className="font-medium">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        );
      
      case 'currency':
        return (
          <span className="font-medium">
            ${typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        );
      
      case 'text':
        if (metric.key === 'deliveryTime') {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'Fast' ? 'bg-green-100 text-green-700' :
              value === 'Standard' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {value}
            </span>
          );
        }
        if (metric.key === 'pricing') {
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              value === 'Budget' ? 'bg-green-100 text-green-700' :
              value === 'Mid-range' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {value}
            </span>
          );
        }
        return <span className="font-medium">{value}</span>;
      
      default:
        return <span className="font-medium">{value}</span>;
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Award className="w-4 h-4 text-yellow-500" />;
      case 2:
        return <Award className="w-4 h-4 text-gray-400" />;
      case 3:
        return <Award className="w-4 h-4 text-orange-600" />;
      default:
        return <span className="text-xs text-gray-500">#{rank}</span>;
    }
  };

  if (entities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No entities selected for comparison.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {mode === 'overview' ? 'Overview' : 'Detailed'} Comparison
            </h3>
            <p className="text-sm text-gray-600">
              {entities.length} {entityType} • Sorted by {metrics.find(m => m.key === sortBy)?.label || sortBy}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Best performing</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10">
                Rank / Entity
              </th>
              {metrics.map((metric) => (
                <th
                  key={metric.key}
                  className="text-left px-4 py-3 font-semibold text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors min-w-[120px]"
                  onClick={() => handleSort(metric.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{metric.label}</span>
                    <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    {sortBy === metric.key && (
                      sortOrder === 'desc' ? 
                        <TrendingDown className="w-3 h-3 text-green-600" /> :
                        <TrendingUp className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                  {metric.unit && (
                    <div className="text-xs text-gray-500 font-normal">{metric.unit}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedEntities.map((entity, index) => (
              <tr key={entity.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 sticky left-0 bg-white z-10 border-r border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{entity.name}</div>
                      <div className="text-xs text-gray-500">{entity.industry} • {entity.region}</div>
                    </div>
                  </div>
                </td>
                {metrics.map((metric) => (
                  <td key={metric.key} className="px-4 py-4">
                    {formatValue(entity[metric.key], metric)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sustainability Commitments (for detailed mode) */}
      {mode === 'detailed' && entityType === 'companies' && (
        <div className="p-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Sustainability Commitments</h4>
          <div className="space-y-4">
            {sortedEntities.map((entity) => (
              <div key={entity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900 mb-2">{entity.name}</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      {entity.sustainability?.carbonNeutral ? 
                        <CheckCircle className="w-4 h-4 text-green-500" /> :
                        <XCircle className="w-4 h-4 text-red-500" />
                      }
                      <span>Carbon Neutral</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>Renewable by {entity.sustainability?.renewableCommitment}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      <span>Water Positive by {entity.sustainability?.waterPositive}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span>Zero Waste by {entity.sustainability?.zeroWaste}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonTable;
