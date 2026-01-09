export default function KeyStatsSection({ stats }) {
  const statEntries = Object.entries(stats);

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {statEntries.map(([key, value]) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
          >
            <p className="text-3xl font-bold text-blue-600 mb-2">{value}</p>
            <p className="text-gray-600 text-sm font-medium">{key}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
