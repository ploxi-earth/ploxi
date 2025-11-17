// src/components/benchmarking/ProcurementAnalysis.jsx
'use client'

import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  Star, 
  TrendingUp, 
  Award, 
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProcurementAnalysis = ({ entities = [] }) => {
  const [analysisMode, setAnalysisMode] = useState('cost'); // cost, performance, risk

  // Calculate procurement scores and rankings
  const getProcurementScore = (entity) => {
    const costScore = entity.pricing === 'Budget' ? 100 : entity.pricing === 'Mid-range' ? 75 : 50;
    const performanceScore = (entity.esgScore + entity.clientSatisfaction + entity.innovationScore) / 3;
    const deliveryScore = entity.deliveryTime === 'Fast' ? 100 : entity.deliveryTime === 'Standard' ? 75 : 50;
    
    return {
      overall: Math.round((costScore * 0.3 + performanceScore * 0.5 + deliveryScore * 0.2)),
      cost: costScore,
      performance: Math.round(performanceScore),
      delivery: deliveryScore,
      risk: entity.esgScore // Higher ESG = lower risk
    };
  };

  const entitiesWithScores = entities.map(entity => ({
    ...entity,
    procurementScores: getProcurementScore(entity)
  }));

  const sortedEntities = entitiesWithScores.sort((a, b) => {
    switch (analysisMode) {
      case 'cost':
        return b.procurementScores.cost - a.procurementScores.cost;
      case 'performance':
        return b.procurementScores.performance - a.procurementScores.performance;
      case 'risk':
        return b.procurementScores.risk - a.procurementScores.risk;
      default:
        return b.procurementScores.overall - a.procurementScores.overall;
    }
  });

  const getRecommendationBadge = (entity, rank) => {
    if (rank === 1) {
      return (
        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
          <Award className="w-3 h-3" />
          <span>Recommended</span>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          <Star className="w-3 h-3" />
          <span>Good Choice</span>
        </div>
      );
    }
    return null;
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-50' };
    if (score >= 60) return { level: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'High', color: 'text-red-600', bg: 'bg-red-50' };
  };

  return (
    <div className="space-y-8">
      {/* Analysis Mode Selector */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Analysis Focus</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { id: 'overall', name: 'Overall Score', icon: TrendingUp, description: 'Balanced evaluation' },
            { id: 'cost', name: 'Cost Efficiency', icon: DollarSign, description: 'Budget optimization' },
            { id: 'performance', name: 'Performance', icon: Star, description: 'Quality & innovation' },
            { id: 'risk', name: 'Risk Assessment', icon: Shield, description: 'ESG & compliance' }
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => setAnalysisMode(mode.id)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${analysisMode === mode.id
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-green-200'
                  }
                `}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <Icon className={`w-5 h-5 ${analysisMode === mode.id ? 'text-green-600' : 'text-gray-500'}`} />
                  <span className="font-medium text-gray-900">{mode.name}</span>
                </div>
                <p className="text-xs text-gray-600">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Procurement Ranking */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Vendor Ranking - {analysisMode.charAt(0).toUpperCase() + analysisMode.slice(1)} Focus
          </h3>
          <p className="text-sm text-gray-600">
            Ranked by {analysisMode} optimization for procurement decisions
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedEntities.map((entity, index) => {
            const rank = index + 1;
            const scores = entity.procurementScores;
            const risk = getRiskLevel(scores.risk);

            return (
              <div key={entity.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full font-bold text-white
                      ${rank === 1 ? 'bg-green-500' : rank === 2 ? 'bg-blue-500' : 'bg-gray-500'}
                    `}>
                      #{rank}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{entity.name}</h4>
                      <p className="text-sm text-gray-600">{entity.type} • {entity.region}</p>
                    </div>
                  </div>
                  {getRecommendationBadge(entity, rank)}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{scores.overall}</div>
                    <div className="text-xs text-gray-600">Overall Score</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{scores.cost}</div>
                    <div className="text-xs text-gray-600">Cost Efficiency</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{scores.performance}</div>
                    <div className="text-xs text-gray-600">Performance</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-orange-600">{scores.delivery}</div>
                    <div className="text-xs text-gray-600">Delivery Score</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${risk.bg}`}>
                    <div className={`text-lg font-bold ${risk.color}`}>{risk.level}</div>
                    <div className="text-xs text-gray-600">Risk Level</div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cost Analysis */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-gray-900">Cost Analysis</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pricing Tier</span>
                        <span className={`font-medium px-2 py-0.5 rounded text-xs ${
                          entity.pricing === 'Budget' ? 'bg-green-100 text-green-700' :
                          entity.pricing === 'Mid-range' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {entity.pricing}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost Efficiency</span>
                        <span className="font-medium">{entity.costEfficiency}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Analysis */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Star className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Performance</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client Satisfaction</span>
                        <span className="font-medium">{entity.clientSatisfaction}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Innovation Score</span>
                        <span className="font-medium">{entity.innovationScore}/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Risk & Compliance */}
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-gray-900">Risk & Compliance</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ESG Score</span>
                        <span className="font-medium">{entity.esgScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Certifications</span>
                        <span className="font-medium">{entity.certifications?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    {rank <= 2 ? (
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h5 className="font-medium text-blue-900 mb-1">Procurement Recommendation</h5>
                      <p className="text-sm text-blue-800">
                        {rank === 1 && "Top choice for balanced cost, performance, and risk profile. Recommended for immediate procurement."}
                        {rank === 2 && "Strong alternative with good value proposition. Consider for strategic partnerships."}
                        {rank > 2 && "May require additional evaluation or negotiation to improve value proposition."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Procurement Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Procurement Decision Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-semibold text-green-900">Recommended Vendor</h4>
            <p className="text-green-800 font-medium">{sortedEntities[0]?.name}</p>
            <p className="text-sm text-green-700 mt-2">
              Best overall score: {sortedEntities[0]?.procurementScores.overall}/100
            </p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-semibold text-blue-900">Budget Optimization</h4>
            <p className="text-blue-800 font-medium">
              {entitiesWithScores.find(e => e.pricing === 'Budget')?.name || 'N/A'}
            </p>
            <p className="text-sm text-blue-700 mt-2">
              Most cost-effective option
            </p>
          </div>
          
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-semibold text-purple-900">Lowest Risk</h4>
            <p className="text-purple-800 font-medium">
              {entitiesWithScores.reduce((max, e) => e.esgScore > max.esgScore ? e : max).name}
            </p>
            <p className="text-sm text-purple-700 mt-2">
              Highest ESG compliance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcurementAnalysis;
