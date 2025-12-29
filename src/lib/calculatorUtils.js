// src/lib/calculatorUtils.js
// Utility functions for GHG emissions calculations

/**
 * Load emission factors from JSON file
 * @returns {Promise<Object>} Emission factors data
 */
export async function loadEmissionFactors() {
  try {
    const response = await fetch('/data/emission-factors.json');
    if (!response.ok) {
      throw new Error('Failed to load emission factors');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading emission factors:', error);
    return null;
  }
}

/**
 * Calculate emissions based on activity data and emission factor
 * Formula: Emissions (kg CO2e) = Activity Data × Emission Factor
 * 
 * @param {number} activityData - Amount of fuel/energy consumed
 * @param {number} emissionFactor - Emission factor (kg CO2e per unit)
 * @returns {number} Emissions in kg CO2e
 */
export function calculateEmissions(activityData, emissionFactor) {
  if (!activityData || !emissionFactor) return 0;
  return activityData * emissionFactor;
}

/**
 * Calculate total emissions for a scope
 * @param {Array} entries - Array of emission entries
 * @returns {number} Total emissions in kg CO2e
 */
export function calculateScopeTotal(entries) {
  if (!entries || entries.length === 0) return 0;

  return entries.reduce((total, entry) => {
    const emissions = calculateEmissions(entry.activityData, entry.emissionFactor);
    return total + emissions;
  }, 0);
}

/**
 * Calculate total emissions across all scopes
 * @param {Object} calculationData - Object with scope1, scope2, scope3 arrays
 * @returns {Object} Totals by scope and grand total
 */
export function calculateTotalEmissions(calculationData) {
  const scope1Total = calculateScopeTotal(calculationData.scope1 || []);
  const scope2Total = calculateScopeTotal(calculationData.scope2 || []);
  const scope3Total = calculateScopeTotal(calculationData.scope3 || []);

  return {
    scope1: scope1Total,
    scope2: scope2Total,
    scope3: scope3Total,
    total: scope1Total + scope2Total + scope3Total,
  };
}

/**
 * Convert kg CO2e to tonnes CO2e
 * @param {number} kgCO2e - Emissions in kg
 * @returns {number} Emissions in tonnes
 */
export function kgToTonnes(kgCO2e) {
  return kgCO2e / 1000;
}

/**
 * Format emissions with appropriate units
 * @param {number} kgCO2e - Emissions in kg
 * @returns {string} Formatted string with units
 */
export function formatEmissions(kgCO2e) {
  if (kgCO2e >= 1000) {
    return `${kgToTonnes(kgCO2e).toFixed(2)} tonnes CO2e`;
  }
  return `${kgCO2e.toFixed(2)} kg CO2e`;
}

/**
 * Calculate equivalencies (cars, trees, homes, etc.)
 * @param {number} kgCO2e - Total emissions in kg
 * @param {Object} equivalencyFactors - Factors from emission-factors.json
 * @returns {Object} Calculated equivalencies
 */
export function calculateEquivalencies(kgCO2e, equivalencyFactors) {
  if (!kgCO2e || !equivalencyFactors) {
    return {
      cars: 0,
      trees: 0,
      homes: 0,
      smartphones: 0,
      flightMiles: 0,
    };
  }

  return {
    cars: (kgCO2e * equivalencyFactors.passengerVehiclesPerYear.factor).toFixed(2),
    trees: Math.ceil(kgCO2e * equivalencyFactors.treesNeeded.factor),
    homes: (kgCO2e * equivalencyFactors.homesEnergyUse.factor).toFixed(3),
    smartphones: Math.ceil(kgCO2e * equivalencyFactors.smartphoneCharges.factor),
    flightMiles: Math.ceil(kgCO2e * equivalencyFactors.milesOnFlight.factor),
  };
}

/**
 * Get emission factor details from loaded data
 * @param {Object} emissionFactorsData - Loaded emission factors JSON
 * @param {string} scope - Scope number (scope1, scope2, scope3)
 * @param {string} category - Category name (e.g., 'stationaryCombustion')
 * @param {string} source - Source name (e.g., 'naturalGas')
 * @returns {Object|null} Emission factor details or null
 */
export function getEmissionFactor(emissionFactorsData, scope, category, source) {
  try {
    return emissionFactorsData.emissionFactors[scope][category][source];
  } catch (error) {
    console.error('Error getting emission factor:', error);
    return null;
  }
}

/**
 * Get all categories for a scope
 * @param {Object} emissionFactorsData - Loaded emission factors JSON
 * @param {string} scope - Scope number (scope1, scope2, scope3)
 * @returns {Array} Array of category objects
 */
export function getCategoriesForScope(emissionFactorsData, scope) {
  try {
    return emissionFactorsData.categories[scope] || [];
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

/**
 * Get all sources for a category
 * @param {Object} emissionFactorsData - Loaded emission factors JSON
 * @param {string} scope - Scope number
 * @param {string} category - Category name
 * @returns {Object} Object with source names as keys
 */
export function getSourcesForCategory(emissionFactorsData, scope, category) {
  try {
    return emissionFactorsData.emissionFactors[scope][category] || {};
  } catch (error) {
    console.error('Error getting sources:', error);
    return {};
  }
}

/**
 * Validate calculation entry
 * @param {Object} entry - Entry object with activityData and emissionFactor
 * @returns {Object} Validation result with isValid and error message
 */
export function validateEntry(entry) {
  if (!entry.activityData || entry.activityData <= 0) {
    return {
      isValid: false,
      error: 'Activity data must be greater than 0',
    };
  }

  if (!entry.emissionFactor) {
    return {
      isValid: false,
      error: 'Please select an emission source',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Prepare data for chart visualization
 * @param {Object} totals - Totals object from calculateTotalEmissions
 * @returns {Array} Array formatted for Recharts
 */
export function prepareChartData(totals) {
  return [
    {
      name: 'Scope 1',
      value: totals.scope1,
      percentage: totals.total > 0 ? ((totals.scope1 / totals.total) * 100).toFixed(1) : 0,
    },
    {
      name: 'Scope 2',
      value: totals.scope2,
      percentage: totals.total > 0 ? ((totals.scope2 / totals.total) * 100).toFixed(1) : 0,
    },
    {
      name: 'Scope 3',
      value: totals.scope3,
      percentage: totals.total > 0 ? ((totals.scope3 / totals.total) * 100).toFixed(1) : 0,
    },
  ].filter(item => item.value > 0); // Only show scopes with emissions
}

/**
 * Export calculation data to CSV format
 * @param {Object} calculationData - Complete calculation data
 * @param {Object} totals - Totals object
 * @returns {string} CSV string
 */
export function exportToCSV(calculationData, totals) {
  let csv = 'Scope,Category,Source,Activity Data,Unit,Emission Factor,Emissions (kg CO2e)\n';

  // Add Scope 1 entries
  if (calculationData.scope1) {
    calculationData.scope1.forEach(entry => {
      const emissions = calculateEmissions(entry.activityData, entry.emissionFactor);
      csv += `Scope 1,${entry.category},${entry.source},${entry.activityData},${entry.unit},${entry.emissionFactor},${emissions.toFixed(2)}\n`;
    });
  }

  // Add Scope 2 entries
  if (calculationData.scope2) {
    calculationData.scope2.forEach(entry => {
      const emissions = calculateEmissions(entry.activityData, entry.emissionFactor);
      csv += `Scope 2,${entry.category},${entry.source},${entry.activityData},${entry.unit},${entry.emissionFactor},${emissions.toFixed(2)}\n`;
    });
  }

  // Add Scope 3 entries
  if (calculationData.scope3) {
    calculationData.scope3.forEach(entry => {
      const emissions = calculateEmissions(entry.activityData, entry.emissionFactor);
      csv += `Scope 3,${entry.category},${entry.source},${entry.activityData},${entry.unit},${entry.emissionFactor},${emissions.toFixed(2)}\n`;
    });
  }

  // Add totals
  csv += '\n';
  csv += `Scope 1 Total,,,,,${totals.scope1.toFixed(2)}\n`;
  csv += `Scope 2 Total,,,,,${totals.scope2.toFixed(2)}\n`;
  csv += `Scope 3 Total,,,,,${totals.scope3.toFixed(2)}\n`;
  csv += `Grand Total,,,,,${totals.total.toFixed(2)}\n`;

  return csv;
}

/**
 * Download CSV file
 * @param {string} csvContent - CSV string content
 * @param {string} filename - Desired filename
 */
export function downloadCSV(csvContent, filename = 'ghg-emissions-calculation.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

/**
 * Save calculation to localStorage (for anonymous users)
 * @param {Object} calculationData - Calculation data to save
 * @param {string} calculationId - Unique ID for calculation
 */
export function saveCalculationLocal(calculationData, calculationId) {
  try {
    const savedCalculations = JSON.parse(localStorage.getItem('ghg_calculations') || '[]');

    const newCalculation = {
      id: calculationId,
      date: new Date().toISOString(),
      data: calculationData,
    };

    savedCalculations.push(newCalculation);

    // Keep only last 10 calculations
    if (savedCalculations.length > 10) {
      savedCalculations.shift();
    }

    localStorage.setItem('ghg_calculations', JSON.stringify(savedCalculations));
    return true;
  } catch (error) {
    console.error('Error saving calculation:', error);
    return false;
  }
}

/**
 * Load calculations from localStorage
 * @returns {Array} Array of saved calculations
 */
export function loadCalculationsLocal() {
  try {
    return JSON.parse(localStorage.getItem('ghg_calculations') || '[]');
  } catch (error) {
    console.error('Error loading calculations:', error);
    return [];
  }
}

/**
 * Generate unique calculation ID
 * @returns {string} Unique ID
 */
export function generateCalculationId() {
  return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}