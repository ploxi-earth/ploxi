'use client'

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, TrendingDown as ReduceIcon } from 'lucide-react';

const EnhancedMetricCard = ({ 
  metric, 
  onReduceThis,
  className = "" 
}) => {
  const {
    id,
    name,
    category,
    currentValue,
    targetValue,
    unit,
    trend
  } = metric;

  // Category color mapping (Microsoft inspired)
  const categoryColors = {
    Carbon: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    Air: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
    Water: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    Waste: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    Social: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    Governance: { text: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' }
  };

  const categoryStyle = categoryColors[category] || categoryColors.Carbon;

  // Calculate progress percentage
  const calculateProgress = () => {
    if (targetValue === 0) return 0;
    
    const isLowerBetter = category === 'Carbon' || category === 'Waste' || category === 'Air';
    
    if (isLowerBetter) {
      const progress = Math.max(0, Math.min(100, ((targetValue - currentValue) / targetValue) * 100));
      return progress;
    } else {
      const progress = Math.min(100, (currentValue / targetValue) * 100);
      return progress;
    }
  };

  const progress = calculateProgress();
  const isOnTrack = progress >= 70;
  
  const isExceedingNegatively = () => {
    const isLowerBetter = category === 'Carbon' || category === 'Waste' || category === 'Air';
    return isLowerBetter ? currentValue > targetValue : currentValue < (targetValue * 0.7);
  };

  const isOverTarget = isExceedingNegatively();
  const progressBarColor = isOverTarget ? 'bg-red-500' : isOnTrack ? 'bg-green-500' : 'bg-yellow-500';

  // Trend icon and styling
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return {
          icon: TrendingUp,
          color: category === 'Carbon' || category === 'Waste' ? 'text-red-500' : 'text-green-500',
          label: 'Increasing'
        };
      case 'down':
        return {
          icon: TrendingDown,
          color: category === 'Carbon' || category === 'Waste' ? 'text-green-500' : 'text-red-500',
          label: 'Decreasing'
        };
      case 'stable':
      default:
        return {
          icon: Minus,
          color: 'text-gray-500',
          label: 'Stable'
        };
    }
  };

  const trendInfo = getTrendIcon();
  const TrendIcon = trendInfo.icon;

  return (
    <div 
      className={`
        bg-white rounded-xl p-5 shadow-sm border border-gray-200
        hover:shadow-md transition-all duration-200 ease-in-out
        ${className}
      `}
      role="article"
      aria-labelledby={`metric-${id}-title`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 
            id={`metric-${id}-title`}
            className="font-semibold text-gray-900 text-sm mb-2 leading-tight"
          >
            {name}
          </h3>
          <span 
            className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
              ${categoryStyle.text} ${categoryStyle.bg} ${categoryStyle.border} border
            `}
          >
            {category}
          </span>
        </div>
        
        {/* Trend Indicator */}
        <div 
          className={`flex items-center space-x-1 ${trendInfo.color}`}
          title={`Trend: ${trendInfo.label}`}
        >
          <TrendIcon className="w-4 h-4" />
        </div>
      </div>

      {/* Main Value Section */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-2xl font-bold text-gray-900">
            {typeof currentValue === 'number' ? currentValue.toLocaleString() : currentValue}
          </span>
          <span className="text-sm text-gray-500 font-medium">
            {unit}
          </span>
        </div>
        
        <div className="text-xs text-gray-600 mb-3">
          Target: {typeof targetValue === 'number' ? targetValue.toLocaleString() : targetValue} {unit}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Progress to Target</span>
            <span className="text-xs font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${progressBarColor}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        {isOverTarget && (
          <button
            onClick={() => onReduceThis && onReduceThis(category)}
            className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
          >
            <ReduceIcon className="w-3 h-3" />
            <span>REDUCE THIS</span>
          </button>
        )}
      </div>

      {/* Status Footer */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1">
          {isOverTarget && <AlertCircle className="w-3 h-3 text-red-500" />}
          <span className={`font-medium ${
            isOverTarget ? 'text-red-600' : 
            isOnTrack ? 'text-green-600' : 'text-yellow-600'
          }`}>
            {isOverTarget ? 'Needs Attention' : isOnTrack ? 'On Track' : 'In Progress'}
          </span>
        </div>
        
        <span className="text-gray-500">
          Updated now
        </span>
      </div>
    </div>
  );
};

export default EnhancedMetricCard;