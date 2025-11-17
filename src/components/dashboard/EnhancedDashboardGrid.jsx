import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  FileText, 
  RefreshCw, 
  TrendingDown, 
  Store, 
  Filter,
  Download,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import MetricCard from './MetricCard';
import { generateSampleMetrics } from '@/utils/generateSampleMetrics';

const EnhancedDashboardGrid = ({ 
  selectedFramework = null,
  selectedIndustry = null,
  className = ""
}) => {
  const router = useRouter();
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // Microsoft 2023 Environmental Report inspired color scheme
  const chartColors = {
    primary: '#0078D4',      // Microsoft Blue
    secondary: '#00BCF2',    // Light Blue  
    success: '#107C10',      // Green
    warning: '#FF8C00',      // Orange
    danger: '#D13438',       // Red
    neutral: '#8A8886',      // Gray
    accent: '#5C2E91'        // Purple
  };

  // Water usage data based on Microsoft's 2023 report
  const waterUsageData = [
    { month: 'Jan', consumption: 2850, recycled: 1995, target: 2500 },
    { month: 'Feb', consumption: 2720, recycled: 1904, target: 2500 },
    { month: 'Mar', consumption: 2890, recycled: 2023, target: 2500 },
    { month: 'Apr', consumption: 2650, recycled: 1855, target: 2500 },
    { month: 'May', consumption: 2780, recycled: 1946, target: 2500 },
    { month: 'Jun', consumption: 2420, recycled: 1694, target: 2500 },
    { month: 'Jul', consumption: 2380, recycled: 1666, target: 2500 },
    { month: 'Aug', consumption: 2340, recycled: 1638, target: 2500 },
    { month: 'Sep', consumption: 2290, recycled: 1603, target: 2500 },
    { month: 'Oct', consumption: 2150, recycled: 1505, target: 2500 },
    { month: 'Nov', consumption: 2080, recycled: 1456, target: 2500 },
    { month: 'Dec', consumption: 1950, recycled: 1365, target: 2500 }
  ];

  // Carbon emissions data (inspired by Microsoft's carbon negative goal)
  const carbonEmissionsData = [
    { year: '2020', scope1: 85, scope2: 120, scope3: 280 },
    { year: '2021', scope1: 78, scope2: 105, scope3: 245 },
    { year: '2022', scope1: 72, scope2: 95, scope3: 220 },
    { year: '2023', scope1: 68, scope2: 88, scope3: 195 },
    { year: '2024', scope1: 62, scope2: 78, scope3: 175 }
  ];

  // Energy mix data
  const energyMixData = [
    { name: 'Renewable', value: 74, fill: chartColors.success },
    { name: 'Natural Gas', value: 18, fill: chartColors.warning },
    { name: 'Grid Electricity', value: 8, fill: chartColors.neutral }
  ];

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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newMetrics = generateSampleMetrics(
      selectedIndustry?.id || 'manufacturing', 
      selectedFramework?.id || 'gri'
    );
    
    setMetrics(newMetrics);
    setLastGenerated(new Date());
    setIsLoading(false);
  };

  // Navigate to marketplace with filters
  const handleReduceThis = (metricCategory) => {
    const categoryToSolutionMap = {
      'Carbon': 'Energy',
      'Water': 'Water',
      'Waste': 'Waste',
      'Air': 'Energy',
      'Social': 'Consulting',
      'Governance': 'Analytics'
    };
    
    const solutionType = categoryToSolutionMap[metricCategory] || 'Energy';
    router.push(`/marketplace?filter=${solutionType.toLowerCase()}`);
  };

  const handleExploreAllSolutions = () => {
    router.push('/marketplace?clear=true');
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
    setTimeout(() => setShowReportModal(false), 3000);
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

  const categoryOrder = ['Carbon', 'Air', 'Water', 'Waste', 'Social', 'Governance'];
  const orderedCategories = categoryOrder.filter(category => groupedMetrics[category]);

  // Loading state
  const LoadingGrid = () => (
    <div className="space-y-8">
      {[1, 2, 3].map((section) => (
        <div key={section} className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-soft border border-gray-200 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Framework Header with Actions */}
      {selectedFramework && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedFramework.fullName || selectedFramework.name} Dashboard
                </h2>
                {selectedIndustry && (
                  <p className="text-gray-600 mt-1">
                    {selectedIndustry.name} Industry • {metrics.length} active metrics
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {selectedFramework.id === 'brsr' && (
                <button
                  onClick={handleGenerateReport}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span>GENERATE REPORT</span>
                </button>
              )}
              
              <button
                onClick={handleExploreAllSolutions}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Store className="w-4 h-4" />
                <span>Explore Solutions</span>
              </button>
              
              <button
                onClick={generateMetrics}
                disabled={isLoading}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && <LoadingGrid />}

      {/* Charts Section - Only show when data is loaded */}
      {!isLoading && metrics.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Water Usage Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Water Usage Trends</h3>
              <button
                onClick={() => handleReduceThis('Water')}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <TrendingDown className="w-3 h-3" />
                <span>REDUCE THIS</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={waterUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="consumption" 
                  stroke={chartColors.primary} 
                  strokeWidth={2}
                  name="Consumption (L/day)"
                  dot={{ fill: chartColors.primary, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="recycled" 
                  stroke={chartColors.success} 
                  strokeWidth={2}
                  name="Recycled Water (L/day)"
                  dot={{ fill: chartColors.success, strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke={chartColors.warning} 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target (L/day)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              * Data inspired by Microsoft&apos;s 2023 Environmental Sustainability Report
            </p>
          </div>

          {/* Carbon Emissions Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Carbon Emissions by Scope</h3>
              <button
                onClick={() => handleReduceThis('Carbon')}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <TrendingDown className="w-3 h-3" />
                <span>REDUCE THIS</span>
              </button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={carbonEmissionsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="scope3" 
                  stackId="1"
                  stroke={chartColors.danger} 
                  fill={chartColors.danger}
                  fillOpacity={0.7}
                  name="Scope 3 (tons CO₂e)"
                />
                <Area 
                  type="monotone" 
                  dataKey="scope2" 
                  stackId="1"
                  stroke={chartColors.warning} 
                  fill={chartColors.warning}
                  fillOpacity={0.7}
                  name="Scope 2 (tons CO₂e)"
                />
                <Area 
                  type="monotone" 
                  dataKey="scope1" 
                  stackId="1"
                  stroke={chartColors.primary} 
                  fill={chartColors.primary}
                  fillOpacity={0.7}
                  name="Scope 1 (tons CO₂e)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              * Modeled after Microsoft&apos;s carbon negative commitment by 2030
            </p>
          </div>

          {/* Energy Mix Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Energy Mix Distribution</h3>
              <div className="text-sm text-gray-600">74% Renewable</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={energyMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name} ${value}%`}
                  labelLine={false}
                >
                  {energyMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-500 mt-2">
              * Based on Microsoft&apos;s renewable energy procurement strategy
            </p>
          </div>

          {/* Water Efficiency Gauge */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Water Efficiency Score</h3>
              <div className="text-2xl font-bold text-blue-600">78%</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart 
                cx="50%" 
                cy="50%" 
                innerRadius="40%" 
                outerRadius="90%" 
                data={[{ name: 'Efficiency', value: 78, fill: chartColors.secondary }]}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar 
                  dataKey="value" 
                  cornerRadius={10} 
                  fill={chartColors.secondary}
                />
                <text 
                  x="50%" 
                  y="50%" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-3xl font-bold fill-current text-blue-600"
                >
                  78%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center">
              <p className="text-sm text-gray-600">Water recycling and conservation efficiency</p>
              <p className="text-xs text-gray-500 mt-1">Target: 85% by 2025</p>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid by Category */}
      {!isLoading && metrics.length > 0 && (
        <div className="space-y-8">
          {orderedCategories.map(category => (
            <div key={category} className="space-y-6">
              {/* Enhanced Category Header */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {category} Metrics
                    </h3>
                    <p className="text-sm text-gray-500">
                      {groupedMetrics[category].length} metrics • Click &quot;REDUCE THIS&quot; to find solutions
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleReduceThis(category)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>REDUCE THIS</span>
                </button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {groupedMetrics[category].map(metric => (
                  <MetricCard 
                    key={metric.id} 
                    metric={metric}
                    onReduceThis={() => handleReduceThis(category)}
                    className="animate-fade-in hover:shadow-lg transition-all duration-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && metrics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Sustainability Metrics Available
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            {!selectedFramework || !selectedIndustry 
              ? "Please select both a framework and industry to view relevant metrics."
              : "No metrics found for this selection."
            }
          </p>
          {selectedFramework && selectedIndustry && (
            <button
              onClick={generateMetrics}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Generate Sample Metrics</span>
            </button>
          )}
        </div>
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Generating BRSR Report
            </h3>
            <p className="text-gray-600 mb-4">
              This is a placeholder demonstration. In production, this would generate a comprehensive BRSR compliance report.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm text-gray-500">Processing your sustainability data...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedDashboardGrid;
