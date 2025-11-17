export const generateEnhancedMetrics = (industry, framework) => {
  const waterMetrics = [
    {
      id: 'water_consumption_total',
      name: 'Total Water Consumption',
      category: 'Water',
      currentValue: 2890,
      targetValue: 2500,
      unit: 'L/day',
      trend: 'down',
      higherIsBetter: false,
      description: 'Daily water consumption across all operations',
      source: 'Inspired by Microsoft 2023 Environmental Report'
    },
    {
      id: 'water_recycling_rate',
      name: 'Water Recycling Rate',
      category: 'Water',
      currentValue: 68,
      targetValue: 85,
      unit: '%',
      trend: 'up',
      higherIsBetter: true,
      description: 'Percentage of water recycled and reused',
      source: 'Based on industry best practices'
    },
    {
      id: 'water_intensity',
      name: 'Water Intensity',
      category: 'Water',
      currentValue: 12.4,
      targetValue: 8.5,
      unit: 'L/revenue',
      trend: 'down',
      higherIsBetter: false,
      description: 'Water consumption per unit of revenue',
      source: 'Sustainability accounting metrics'
    },
    {
      id: 'wastewater_treatment',
      name: 'Wastewater Treatment Efficiency',
      category: 'Water',
      currentValue: 87,
      targetValue: 95,
      unit: '%',
      trend: 'up',
      higherIsBetter: true,
      description: 'Percentage of wastewater properly treated',
      source: 'Environmental compliance standards'
    },
    {
      id: 'water_stress_locations',
      name: 'Operations in Water-Stressed Areas',
      category: 'Water',
      currentValue: 23,
      targetValue: 15,
      unit: '%',
      trend: 'stable',
      higherIsBetter: false,
      description: 'Facilities located in water-stressed regions',
      source: 'Water risk assessment data'
    }
  ];

  const carbonMetrics = [
    {
      id: 'scope1_emissions',
      name: 'Scope 1 Emissions',
      category: 'Carbon',
      currentValue: 68,
      targetValue: 45,
      unit: 'tons CO₂e',
      trend: 'down',
      higherIsBetter: false,
      description: 'Direct emissions from owned operations',
      source: 'Microsoft carbon negative commitment data'
    },
    {
      id: 'scope2_emissions',
      name: 'Scope 2 Emissions',
      category: 'Carbon',
      currentValue: 88,
      targetValue: 60,
      unit: 'tons CO₂e',
      trend: 'down',
      higherIsBetter: false,
      description: 'Indirect emissions from purchased energy',
      source: 'Microsoft 2023 Environmental Report'
    },
    {
      id: 'renewable_energy_pct',
      name: 'Renewable Energy Usage',
      category: 'Carbon',
      currentValue: 74,
      targetValue: 90,
      unit: '%',
      trend: 'up',
      higherIsBetter: true,
      description: 'Percentage of energy from renewable sources',
      source: 'Microsoft renewable energy procurement'
    }
  ];

  // Return combined metrics based on framework focus
  const frameworkMetrics = {
    brsr: [...waterMetrics.slice(0, 3), ...carbonMetrics],
    gri: [...waterMetrics, ...carbonMetrics],
    sasb: [...waterMetrics.slice(0, 2), ...carbonMetrics.slice(0, 2)],
    tcfd: [...carbonMetrics],
    esrs: [...waterMetrics.slice(0, 4), ...carbonMetrics.slice(0, 2)]
  };

  return frameworkMetrics[framework] || frameworkMetrics.gri;
};

export const getChartData = () => ({
  waterUsage: [
    { month: 'Jan', consumption: 2850, recycled: 1995, target: 2500, efficiency: 70 },
    { month: 'Feb', consumption: 2720, recycled: 1904, target: 2500, efficiency: 70 },
    { month: 'Mar', consumption: 2890, recycled: 2023, target: 2500, efficiency: 70 },
    { month: 'Apr', consumption: 2650, recycled: 1855, target: 2500, efficiency: 70 },
    { month: 'May', consumption: 2780, recycled: 1946, target: 2500, efficiency: 70 },
    { month: 'Jun', consumption: 2420, recycled: 1694, target: 2500, efficiency: 70 },
    { month: 'Jul', consumption: 2380, recycled: 1666, target: 2500, efficiency: 70 },
    { month: 'Aug', consumption: 2340, recycled: 1638, target: 2500, efficiency: 70 },
    { month: 'Sep', consumption: 2290, recycled: 1603, target: 2500, efficiency: 70 },
    { month: 'Oct', consumption: 2150, recycled: 1505, target: 2500, efficiency: 70 },
    { month: 'Nov', consumption: 2080, recycled: 1456, target: 2500, efficiency: 78 },
    { month: 'Dec', consumption: 1950, recycled: 1365, target: 2500, efficiency: 78 }
  ],
  
  carbonEmissions: [
    { year: '2020', scope1: 85, scope2: 120, scope3: 280, total: 485 },
    { year: '2021', scope1: 78, scope2: 105, scope3: 245, total: 428 },
    { year: '2022', scope1: 72, scope2: 95, scope3: 220, total: 387 },
    { year: '2023', scope1: 68, scope2: 88, scope3: 195, total: 351 },
    { year: '2024', scope1: 62, scope2: 78, scope3: 175, total: 315 }
  ],
  
  energyMix: [
    { name: 'Renewable', value: 74, color: '#107C10' },
    { name: 'Natural Gas', value: 18, color: '#FF8C00' },
    { name: 'Grid Electricity', value: 8, color: '#8A8886' }
  ]
});