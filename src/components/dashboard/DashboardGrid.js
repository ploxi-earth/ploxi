import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, RefreshCw } from 'lucide-react';
import MetricCard from './MetricCard';
import { generateSampleMetrics } from '@/utils/generateSampleMetrics';

const DashboardGrid = ({ 
  selectedFramework = null,
  selectedIndustry = null,
  className = ""
}) => {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  // Framework display names
  const frameworkNames = {
    brsr: 'BRSR (Business Responsibility & Sustainability)',
    sasb: 'SASB (Sustainability Accounting Standards)',
    tcfd: 'TCFD (Climate-related Financial Disclosures)',
    gri: 'GRI (Global Reporting Initiative)',
    esrs: 'ESRS (European Sustainability Reporting)'
  };

  // Generate metrics when framework or industry changes
  useEffect(() => {
    if (selectedFramework && selectedIndustry) {
      generateMetrics();
    } else {
      setMetrics([]);
    }
  }, [selectedFramework, selectedIndustry]);

  const generateMetrics = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMetrics = generateSampleMetrics(
      selectedIndustry?.id || 'manufacturing', 
      selectedFramework?.id || 'gri'
    );
    
    setMetrics(newMetrics);
    setLastGenerated(new Date());
    setIsLoading(false);
  };

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const category = metric.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(metric);
    return acc;
  }, {});

  // Category order for consistent display
  const categoryOrder = ['Carbon', 'Air', 'Water', 'Waste', 'Social', 'Governance'];
  const orderedCategories = categoryOrder.filter(category => groupedMetrics[category]);

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-900">
          No Sustainability Metrics Available
        </h3>
        <p className="text-gray-600 max-w-md">
          {!selectedFramework || !selectedIndustry 
            ? "Please select both a framework and industry to view relevant metrics."
            : "No metrics found for this selection."
          }
        </p>
        {selectedFramework && selectedIndustry && (
          <button
            onClick={generateMetrics}
            disabled={isLoading}
            className={`
              inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-medium
              transition-all duration-200 ease-in-out
              ${isLoading 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105'
              }
            `}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>
              {isLoading ? 'Generating...' : 'Generate Sample Metrics'}
            </span>
          </button>
        )}
      </div>
    </div>
  );

  // Loading state
  const LoadingGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-4 shadow-soft border border-gray-200 animate-pulse"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Framework Header */}
      {selectedFramework && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-soft">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Framework: {frameworkNames[selectedFramework.id] || selectedFramework.name}
              </h2>
              {selectedIndustry && (
                <p className="text-sm text-gray-600">
                  Industry: {selectedIndustry.name} • {metrics.length} metrics
                </p>
              )}
            </div>
          </div>
          
          {lastGenerated && (
            <div className="text-right">
              <div className="text-xs text-gray-500">
                Generated: {lastGenerated.toLocaleTimeString()}
              </div>
              <button
                onClick={generateMetrics}
                disabled={isLoading}
                className="text-xs text-green-600 hover:text-green-700 font-medium inline-flex items-center space-x-1 mt-1"
                title="Refresh metrics"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingGrid />}

      {/* Empty State */}
      {!isLoading && metrics.length === 0 && <EmptyState />}

      {/* Metrics Grid by Category */}
      {!isLoading && metrics.length > 0 && (
        <div className="space-y-8">
          {orderedCategories.map(category => (
            <div key={category} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {category} Metrics
                </h3>
                <span className="text-sm text-gray-500">
                  ({groupedMetrics[category].length})
                </span>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedMetrics[category].map(metric => (
                  <MetricCard 
                    key={metric.id} 
                    metric={metric}
                    className="animate-fade-in"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardGrid;
