import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ 
  metric, 
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

  // Category color mapping
  const categoryColors = {
    Carbon: { text: 'text-gray-600', bg: 'bg-gray-100' },
    Air: { text: 'text-sky-600', bg: 'bg-sky-100' },
    Water: { text: 'text-blue-600', bg: 'bg-blue-100' },
    Waste: { text: 'text-orange-600', bg: 'bg-orange-100' },
    Social: { text: 'text-purple-600', bg: 'bg-purple-100' },
    Governance: { text: 'text-green-600', bg: 'bg-green-100' }
  };

  // Get category styling
  const categoryStyle = categoryColors[category] || categoryColors.Carbon;

  // Calculate progress percentage
  const calculateProgress = () => {
    if (targetValue === 0) return 0;
    
    // For metrics where lower is better (emissions, waste, etc.)
    const isLowerBetter = category === 'Carbon' || category === 'Waste' || category === 'Air';
    
    if (isLowerBetter) {
      // Progress is good when current < target
      const progress = Math.max(0, Math.min(100, ((targetValue - currentValue) / targetValue) * 100));
      return progress;
    } else {
      // Progress is good when current >= target (efficiency, diversity, etc.)
      const progress = Math.min(100, (currentValue / targetValue) * 100);
      return progress;
    }
  };

  const progress = calculateProgress();
  const isOnTrack = progress >= 70; // Good progress threshold
  
  // Determine if metric is exceeding target negatively
  const isExceedingNegatively = () => {
    const isLowerBetter = category === 'Carbon' || category === 'Waste' || category === 'Air';
    return isLowerBetter ? currentValue > targetValue : currentValue < (targetValue * 0.7);
  };

  const isOverTarget = isExceedingNegatively();

  // Progress bar color
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
        bg-white rounded-xl p-4 shadow-soft border border-gray-200
        hover:scale-105 hover:shadow-lg transition-all duration-200 ease-in-out
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
              ${categoryStyle.text} ${categoryStyle.bg}
            `}
          >
            {category}
          </span>
        </div>
        
        {/* Trend Indicator */}
        <div 
          className={`
            flex items-center space-x-1 transition-all duration-200 ease-in-out
            ${trendInfo.color}
          `}
          title={`Trend: ${trendInfo.label}`}
        >
          <TrendIcon className="w-4 h-4" />
          <span className="text-xs font-medium sr-only">
            {trendInfo.label}
          </span>
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
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Progress</span>
            <span className="text-xs font-medium text-gray-700">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div 
            className="w-full bg-gray-200 rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progress towards ${name} target`}
          >
            <div 
              className={`
                h-full transition-all duration-500 ease-out
                ${progressBarColor}
              `}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between text-xs">
        <span className={`
          font-medium
          ${isOverTarget ? 'text-red-600' : isOnTrack ? 'text-green-600' : 'text-yellow-600'}
        `}>
          {isOverTarget ? 'Needs Attention' : isOnTrack ? 'On Track' : 'In Progress'}
        </span>
        
        <span className="text-gray-500">
          Updated now
        </span>
      </div>
    </div>
  );
};

export default MetricCard;
