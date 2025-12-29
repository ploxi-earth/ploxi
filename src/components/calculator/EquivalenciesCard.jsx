'use client';

// src/components/calculator/EquivalenciesCard.jsx
// Display emission equivalencies in relatable terms

export default function EquivalenciesCard({ equivalencies }) {
  if (!equivalencies || equivalencies.cars === 0) {
    return null;
  }

  const items = [
    {
      icon: '🚗',
      value: equivalencies.cars,
      label: 'passenger vehicles driven for one year',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      icon: '🌳',
      value: equivalencies.trees.toLocaleString(),
      label: 'tree seedlings grown for 10 years',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
    {
      icon: '🏠',
      value: equivalencies.homes,
      label: "homes' energy use for one year",
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      icon: '📱',
      value: equivalencies.smartphones.toLocaleString(),
      label: 'smartphone charges',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
    },
    {
      icon: '✈️',
      value: equivalencies.flightMiles.toLocaleString(),
      label: 'miles on a flight',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What Does This Mean? 🤔
        </h3>
        <p className="text-sm text-gray-600">
          Your total emissions are equivalent to:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-4 border-2 rounded-lg ${item.color} transition-transform hover:scale-105`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1">
                <p className={`text-2xl font-bold ${item.textColor} mb-1`}>
                  {item.value}
                </p>
                <p className="text-xs text-gray-700">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold">Note:</span> Equivalencies calculated using EPA Greenhouse Gas 
          Equivalencies Calculator. These comparisons help contextualize emissions in everyday terms.
        </p>
      </div>
    </div>
  );
}