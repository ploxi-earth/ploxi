'use client';

// src/components/calculator/ScopeSelector.jsx
// Tab navigation for switching between Scope 1, 2, and 3

export default function ScopeSelector({ activeScope, onScopeChange, emissionCounts }) {
  const scopes = [
    {
      id: 'scope1',
      name: 'Scope 1',
      title: 'Direct Emissions',
      description: 'Emissions from sources owned or controlled by your organization',
      icon: '🏭',
      examples: 'Company vehicles, on-site fuel combustion, refrigerants',
    },
    {
      id: 'scope2',
      name: 'Scope 2',
      title: 'Indirect Energy',
      description: 'Emissions from purchased electricity, heat, steam, or cooling',
      icon: '⚡',
      examples: 'Electricity from the grid, district heating',
    },
    {
      id: 'scope3',
      name: 'Scope 3',
      title: 'Other Indirect',
      description: 'All other indirect emissions in your value chain',
      icon: '🌐',
      examples: 'Business travel, employee commuting, waste disposal',
    },
  ];

  return (
    <div className="mb-8">
      {/* Desktop Tabs */}
      <div className="hidden md:flex border-b border-gray-200">
        {scopes.map((scope) => (
          <button
            key={scope.id}
            onClick={() => onScopeChange(scope.id)}
            className={`flex-1 px-6 py-4 text-left border-b-2 transition-all ${
              activeScope === scope.id
                ? 'border-green-600 bg-green-50'
                : 'border-transparent hover:bg-gray-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{scope.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3
                    className={`font-semibold ${
                      activeScope === scope.id ? 'text-green-700' : 'text-gray-900'
                    }`}
                  >
                    {scope.name}
                  </h3>
                  {emissionCounts[scope.id] > 0 && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {emissionCounts[scope.id]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-1">{scope.title}</p>
                <p className="text-xs text-gray-500">{scope.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Mobile Dropdown */}
      <div className="md:hidden">
        <label htmlFor="scope-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Scope
        </label>
        <select
          id="scope-select"
          value={activeScope}
          onChange={(e) => onScopeChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          {scopes.map((scope) => (
            <option key={scope.id} value={scope.id}>
              {scope.icon} {scope.name} - {scope.title}
              {emissionCounts[scope.id] > 0 ? ` (${emissionCounts[scope.id]})` : ''}
            </option>
          ))}
        </select>

        {/* Mobile Scope Details */}
        <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          {scopes.map(
            (scope) =>
              activeScope === scope.id && (
                <div key={scope.id}>
                  <p className="text-sm text-gray-700 mb-2">{scope.description}</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Examples:</span> {scope.examples}
                  </p>
                </div>
              )
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="hidden md:block mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 text-lg">ℹ️</span>
          <div className="text-sm text-blue-900">
            {scopes.map(
              (scope) =>
                activeScope === scope.id && (
                  <div key={scope.id}>
                    <p className="font-medium mb-1">{scope.description}</p>
                    <p className="text-xs text-blue-700">
                      <span className="font-medium">Common sources:</span> {scope.examples}
                    </p>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}