'use client';

// src/components/calculator/GHGCalculatorPage.jsx
// Main calculator component – stacked layout (inputs → results)

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ScopeSelector from './ScopeSelector';
import EmissionInputForm from './EmissionInputForm';
import ResultsDisplay from './ResultsDisplay';
import EquivalenciesCard from './EquivalenciesCard';
import ExportOptions from './ExportOptions';
import {
  loadEmissionFactors,
  calculateTotalEmissions,
  calculateEquivalencies,
  prepareChartData,
  saveCalculationLocal,
  generateCalculationId,
} from '@/lib/calculatorUtils';
import { Loader2 } from 'lucide-react';

export default function GHGCalculatorPage() {
  // State
  const [activeScope, setActiveScope] = useState('scope1');
  const [emissionFactorsData, setEmissionFactorsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Entries
  const [scope1Entries, setScope1Entries] = useState([]);
  const [scope2Entries, setScope2Entries] = useState([]);
  const [scope3Entries, setScope3Entries] = useState([]);

  // Results
  const [totals, setTotals] = useState({ scope1: 0, scope2: 0, scope3: 0, total: 0 });
  const [equivalencies, setEquivalencies] = useState(null);
  const [chartData, setChartData] = useState([]);

  // Load emission factors
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await loadEmissionFactors();
        if (!data) throw new Error('Failed to load emission factors');
        setEmissionFactorsData(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load emission factors. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Recalculate results
  useEffect(() => {
    const calculationData = {
      scope1: scope1Entries,
      scope2: scope2Entries,
      scope3: scope3Entries,
    };

    const newTotals = calculateTotalEmissions(calculationData);
    setTotals(newTotals);

    if (emissionFactorsData?.equivalencies?.factors) {
      setEquivalencies(
        calculateEquivalencies(
          newTotals.total,
          emissionFactorsData.equivalencies.factors
        )
      );
    }

    setChartData(prepareChartData(newTotals));
  }, [scope1Entries, scope2Entries, scope3Entries, emissionFactorsData]);

  // Helpers
  const getCurrentEntries = () => {
    switch (activeScope) {
      case 'scope1':
        return scope1Entries;
      case 'scope2':
        return scope2Entries;
      case 'scope3':
        return scope3Entries;
      default:
        return [];
    }
  };

  const setCurrentEntries = (entries) => {
    if (activeScope === 'scope1') setScope1Entries(entries);
    if (activeScope === 'scope2') setScope2Entries(entries);
    if (activeScope === 'scope3') setScope3Entries(entries);
  };

  const handleSaveCalculation = (name) => {
    const calculationData = {
      scope1: scope1Entries,
      scope2: scope2Entries,
      scope3: scope3Entries,
      totals,
      equivalencies,
      name: name || 'Unnamed Calculation',
      date: new Date().toISOString(),
    };

    const success = saveCalculationLocal(
      calculationData,
      generateCalculationId()
    );

    alert(success ? '✅ Calculation saved successfully!' : '❌ Failed to save calculation.');
  };

  const emissionCounts = {
    scope1: scope1Entries.length,
    scope2: scope2Entries.length,
    scope3: scope3Entries.length,
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/images/ploxi earth logo.jpeg"
              alt="Ploxi Earth"
              width={64}
              height={64}
              className="rounded-lg object-contain"
            />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Ploxi Earth - Comprehensive Sustainability Tools
              </h1>
              <p className="text-sm text-green-600 font-medium mt-1">
                GHG Emissions Calculator
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <p className="text-gray-600">
              Calculate your organization's greenhouse gas emissions across Scope 1, 2, and 3
            </p>
          </div>
        </div>

        {/* Scope Selector */}
        <ScopeSelector
          activeScope={activeScope}
          onScopeChange={setActiveScope}
          emissionCounts={emissionCounts}
        />

        {/* Input Form */}
        <EmissionInputForm
          scope={activeScope}
          emissionFactorsData={emissionFactorsData}
          entries={getCurrentEntries()}
          onEntriesChange={setCurrentEntries}
        />

        {/* Results (FULL WIDTH, BELOW INPUTS) */}
        {totals.total > 0 && (
          <>
            <ResultsDisplay totals={totals} chartData={chartData} />

            <ExportOptions
              calculationData={{
                scope1: scope1Entries,
                scope2: scope2Entries,
                scope3: scope3Entries,
              }}
              totals={totals}
              equivalencies={equivalencies}
              onSave={handleSaveCalculation}
            />

            <EquivalenciesCard equivalencies={equivalencies} />
          </>
        )}

        {/* Methodology */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md border-l-4 border-green-600">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📚 Methodology
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              <strong>Formula:</strong> Emissions (kg CO2e) = Activity Data × Emission Factor
            </p>
            <p>
              <strong>Standards:</strong> GHG Protocol Corporate Standard, ISO 14064
            </p>
            <p className="text-xs text-gray-600 mt-3">
              Estimates only. For official reporting, consult certified professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
