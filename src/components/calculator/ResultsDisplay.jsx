'use client';

// src/components/calculator/ResultsDisplay.jsx
// Display calculation results with charts and breakdown (sidebar-safe & responsive)

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { formatEmissions } from '@/lib/calculatorUtils';

export default function ResultsDisplay({ totals, chartData }) {
  const pieChartColors = ['#EF4444', '#F59E0B', '#3B82F6'];

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-semibold"
      >
        {(percent * 100).toFixed(0)}%
      </text>
    );
  };

  if (totals.total === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Data Yet
          </h3>
          <p className="text-gray-600">
            Add emission sources to see your results and visualizations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Total Emissions */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white">
        <div className="text-center">
          <h2 className="text-lg font-medium mb-2 opacity-90">
            Total GHG Emissions
          </h2>
          <p className="text-5xl font-bold mb-2">
            {formatEmissions(totals.total)}
          </p>
          <p className="text-sm opacity-75">Carbon Dioxide Equivalent</p>
        </div>
      </div>

      {/* Scope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Scope 1', value: totals.scope1, color: 'red', emoji: '🏭', label: 'Direct Emissions' },
          { name: 'Scope 2', value: totals.scope2, color: 'amber', emoji: '⚡', label: 'Indirect Energy' },
          { name: 'Scope 3', value: totals.scope3, color: 'blue', emoji: '🌐', label: 'Other Indirect' },
        ].map((scope) => (
          <div
            key={scope.name}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${scope.color}-500`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{scope.name}</h3>
              <span className="text-2xl">{scope.emoji}</span>
            </div>
            <p className={`text-2xl font-bold text-${scope.color}-600 mb-1`}>
              {formatEmissions(scope.value)}
            </p>
            <p className="text-xs text-gray-600">{scope.label}</p>
            {totals.total > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-sm text-gray-700">
                  {((scope.value / totals.total) * 100).toFixed(1)}% of total
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 min-w-0 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Emissions by Scope
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius="70%"
                labelLine={false}
                label={renderCustomLabel}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieChartColors[index % pieChartColors.length]}
                  />
                ))}
              </Pie>

              <Tooltip formatter={(value) => formatEmissions(value)} />
            </PieChart>
          </ResponsiveContainer>

          {/* Custom Legend */}
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {chartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pieChartColors[index] }}
                />
                <span className="text-gray-700">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 min-w-0 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Emissions Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatEmissions(value)} />
              <Bar dataKey="value" fill="#22C55E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
