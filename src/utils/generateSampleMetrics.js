/**
 * Generate realistic sample metrics based on industry and framework
 * @param {string} industry - Industry identifier (manufacturing, finance, etc.)
 * @param {string} framework - Framework identifier (sasb, gri, brsr, etc.)
 * @returns {Array} Array of metric objects
 */
export function generateSampleMetrics(industry, framework) {
  // Base metric templates by category
  const metricTemplates = {
    Carbon: [
      { id: 'carbon_emissions', name: 'Carbon Emissions', unit: 'tons CO₂e', targetRange: [80, 150] },
      { id: 'energy_intensity', name: 'Energy Intensity', unit: 'kWh/unit', targetRange: [2.5, 8.0] },
      { id: 'renewable_energy', name: 'Renewable Energy', unit: '%', targetRange: [60, 90], higherIsBetter: true },
      { id: 'carbon_intensity', name: 'Carbon Intensity', unit: 'kg CO₂e/revenue', targetRange: [0.8, 2.5] }
    ],
    Water: [
      { id: 'water_consumption', name: 'Water Consumption', unit: 'L/day', targetRange: [800, 2500] },
      { id: 'water_recycling', name: 'Water Recycling Rate', unit: '%', targetRange: [70, 95], higherIsBetter: true },
      { id: 'water_intensity', name: 'Water Intensity', unit: 'L/unit', targetRange: [5, 25] },
      { id: 'wastewater_treatment', name: 'Wastewater Treatment', unit: '%', targetRange: [85, 99], higherIsBetter: true }
    ],
    Waste: [
      { id: 'waste_generation', name: 'Waste Generation', unit: 'tons/month', targetRange: [10, 80] },
      { id: 'waste_recycling', name: 'Waste Recycling Rate', unit: '%', targetRange: [60, 90], higherIsBetter: true },
      { id: 'hazardous_waste', name: 'Hazardous Waste', unit: 'kg/month', targetRange: [50, 500] },
      { id: 'landfill_diversion', name: 'Landfill Diversion', unit: '%', targetRange: [75, 95], higherIsBetter: true }
    ],
    Air: [
      { id: 'air_quality_index', name: 'Air Quality Index', unit: 'AQI', targetRange: [25, 80] },
      { id: 'particulate_matter', name: 'Particulate Matter', unit: 'μg/m³', targetRange: [15, 45] },
      { id: 'nox_emissions', name: 'NOx Emissions', unit: 'mg/m³', targetRange: [20, 150] },
      { id: 'voc_emissions', name: 'VOC Emissions', unit: 'ppm', targetRange: [5, 50] }
    ],
    Social: [
      { id: 'employee_diversity', name: 'Employee Diversity', unit: '%', targetRange: [40, 70], higherIsBetter: true },
      { id: 'safety_incidents', name: 'Safety Incidents', unit: 'incidents/year', targetRange: [0, 5] },
      { id: 'training_hours', name: 'Training Hours per Employee', unit: 'hours/year', targetRange: [20, 60], higherIsBetter: true },
      { id: 'employee_satisfaction', name: 'Employee Satisfaction', unit: '%', targetRange: [75, 95], higherIsBetter: true },
      { id: 'gender_pay_gap', name: 'Gender Pay Gap', unit: '%', targetRange: [0, 8] }
    ],
    Governance: [
      { id: 'board_diversity', name: 'Board Diversity', unit: '%', targetRange: [30, 60], higherIsBetter: true },
      { id: 'ethics_training', name: 'Ethics Training Coverage', unit: '%', targetRange: [90, 100], higherIsBetter: true },
      { id: 'compliance_score', name: 'Compliance Score', unit: '/100', targetRange: [85, 98], higherIsBetter: true },
      { id: 'supplier_assessment', name: 'Supplier ESG Assessment', unit: '%', targetRange: [60, 90], higherIsBetter: true },
      { id: 'transparency_score', name: 'Transparency Score', unit: '/10', targetRange: [7, 9.5], higherIsBetter: true }
    ]
  };

  // Industry-specific focus areas
  const industryFocus = {
    manufacturing: ['Carbon', 'Water', 'Waste', 'Air', 'Social'],
    finance: ['Governance', 'Social', 'Carbon'],
    healthcare: ['Social', 'Waste', 'Air', 'Governance'],
    real_estate: ['Carbon', 'Water', 'Waste', 'Social'],
    cement: ['Carbon', 'Air', 'Water', 'Waste'],
    steel: ['Carbon', 'Air', 'Water', 'Waste'],
    logistics: ['Carbon', 'Air', 'Social', 'Governance'],
    automotive: ['Carbon', 'Waste', 'Social', 'Governance'],
    education: ['Social', 'Carbon', 'Waste', 'Governance'],
    it_datacenter: ['Carbon', 'Water', 'Social', 'Governance']
  };

  // Framework-specific priorities (now defined properly before use)
  const frameworkPriorities = {
    sasb: {
      categories: ['Carbon', 'Governance', 'Social'],
      maxMetrics: 8,
      description: 'Financially material sustainability metrics'
    },
    gri: {
      categories: ['Carbon', 'Water', 'Waste', 'Social', 'Governance'],
      maxMetrics: 12,
      description: 'Comprehensive sustainability disclosures'
    },
    brsr: {
      categories: ['Waste', 'Social', 'Governance', 'Carbon'],
      maxMetrics: 10,
      description: 'Business responsibility priorities for India'
    },
    tcfd: {
      categories: ['Carbon', 'Governance'],
      maxMetrics: 6,
      description: 'Climate-related financial disclosures'
    },
    esrs: {
      categories: ['Carbon', 'Water', 'Social', 'Governance'],
      maxMetrics: 10,
      description: 'European sustainability standards'
    }
  };

  // Get relevant categories
  const industryCategories = industryFocus[industry] || industryFocus.manufacturing;
  const frameworkConfig = frameworkPriorities[framework] || frameworkPriorities.gri;

  const relevantCategories = frameworkConfig.categories.filter(cat =>
    industryCategories.includes(cat)
  );

  const generatedMetrics = [];
  const metricsPerCategory = Math.ceil(frameworkConfig.maxMetrics / relevantCategories.length);

  relevantCategories.forEach(category => {
    const categoryMetrics = metricTemplates[category] || [];
    const selectedMetrics = categoryMetrics
      .sort(() => Math.random() - 0.5)
      .slice(0, metricsPerCategory);

    selectedMetrics.forEach(template => {
      const targetValue = template.targetRange[0] +
        Math.random() * (template.targetRange[1] - template.targetRange[0]);

      const variance = 0.3;
      const currentValue = targetValue * (1 + (Math.random() * 2 - 1) * variance);

      const trends = ['up', 'down', 'stable'];
      const trendWeights = template.higherIsBetter
        ? [0.6, 0.2, 0.2]
        : [0.2, 0.6, 0.2];

      const randomTrend = Math.random();
      let trend = 'stable';
      if (randomTrend < trendWeights[0]) trend = 'up';
      else if (randomTrend < trendWeights[0] + trendWeights[1]) trend = 'down';

      generatedMetrics.push({
        id: template.id,
        name: template.name,
        category,
        currentValue: Math.round(currentValue * 100) / 100,
        targetValue: Math.round(targetValue * 100) / 100,
        unit: template.unit,
        trend,
        higherIsBetter: template.higherIsBetter || false,
        lastUpdated: new Date().toISOString(),
        industry,
        framework
      });
    });
  });

  if (generatedMetrics.length === 0) {
    generatedMetrics.push(
      {
        id: 'carbon_emissions_fallback',
        name: 'Carbon Emissions',
        category: 'Carbon',
        currentValue: 125,
        targetValue: 100,
        unit: 'tons CO₂e',
        trend: 'down',
        higherIsBetter: false
      },
      {
        id: 'compliance_score_fallback',
        name: 'Compliance Score',
        category: 'Governance',
        currentValue: 87,
        targetValue: 95,
        unit: '/100',
        trend: 'up',
        higherIsBetter: true
      }
    );
  }

  return generatedMetrics.slice(0, frameworkConfig.maxMetrics);
}

// Helper function to format metric values for display
export function formatMetricValue(value, unit) {
  if (typeof value !== 'number') return value;

  if (unit === '%' || unit === '/100') {
    return Math.round(value);
  }

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  if (value < 1) {
    return value.toFixed(2);
  } else if (value < 10) {
    return value.toFixed(1);
  }

  return Math.round(value);
}

// Export configs
export const INDUSTRY_CONFIGS = {
  manufacturing: { focus: ['Carbon', 'Water', 'Waste', 'Air', 'Social'], description: 'Production efficiency and environmental impact' },
  finance: { focus: ['Governance', 'Social', 'Carbon'], description: 'Risk management and ethical practices' },
  healthcare: { focus: ['Social', 'Waste', 'Air', 'Governance'], description: 'Patient care and safety standards' },
  real_estate: { focus: ['Carbon', 'Water', 'Waste', 'Social'], description: 'Building efficiency and community impact' },
  it_datacenter: { focus: ['Carbon', 'Water', 'Social', 'Governance'], description: 'Energy efficiency and digital responsibility' }
};

export const FRAMEWORK_CONFIGS = {
  sasb: {
    categories: ['Carbon', 'Governance', 'Social'],
    maxMetrics: 8,
    description: 'Financially material sustainability metrics'
  },
  gri: {
    categories: ['Carbon', 'Water', 'Waste', 'Social', 'Governance'],
    maxMetrics: 12,
    description: 'Comprehensive sustainability disclosures'
  },
  brsr: {
    categories: ['Waste', 'Social', 'Governance', 'Carbon'],
    maxMetrics: 10,
    description: 'Business responsibility priorities for India'
  },
  tcfd: {
    categories: ['Carbon', 'Governance'],
    maxMetrics: 6,
    description: 'Climate-related financial disclosures'
  },
  esrs: {
    categories: ['Carbon', 'Water', 'Social', 'Governance'],
    maxMetrics: 10,
    description: 'European sustainability standards'
  }
};
