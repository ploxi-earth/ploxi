const mongoose = require('mongoose');

const ghgCalculationSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    sessionId: { type: String },               // anonymous session
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String, trim: true },
    reportingYear: { type: Number },

    // ── Scope 1 – Direct Emissions ─────────────────────────────────────────
    scope1: {
      stationaryCombustion: {
        naturalGas: { value: Number, unit: { type: String, default: 'MMBtu' } },
        diesel: { value: Number, unit: { type: String, default: 'liters' } },
        coal: { value: Number, unit: { type: String, default: 'tonnes' } },
      },
      mobileCombustion: {
        petrol: { value: Number, unit: { type: String, default: 'liters' } },
        diesel: { value: Number, unit: { type: String, default: 'liters' } },
      },
      fugitiveEmissions: {
        refrigerantLeakage: { value: Number, unit: { type: String, default: 'kg' } },
      },
      totalScope1_tCO2e: Number,
    },

    // ── Scope 2 – Indirect Emissions (Energy) ─────────────────────────────
    scope2: {
      purchasedElectricity: {
        value: Number,
        unit: { type: String, default: 'kWh' },
        emissionFactor: { type: Number, default: 0.82 }, // India grid default kg CO2e/kWh
      },
      purchasedHeat: { value: Number, unit: { type: String, default: 'GJ' } },
      totalScope2_tCO2e: Number,
    },

    // ── Scope 3 – Value Chain Emissions ──────────────────────────────────
    scope3: {
      businessTravel: {
        airTravel: { value: Number, unit: { type: String, default: 'km' } },
        roadTravel: { value: Number, unit: { type: String, default: 'km' } },
      },
      employeeCommute: { value: Number, unit: { type: String, default: 'km/year' } },
      wasteGenerated: { value: Number, unit: { type: String, default: 'tonnes' } },
      purchasedGoods: { value: Number, unit: { type: String, default: 'INR_million' } },
      totalScope3_tCO2e: Number,
    },

    // ── Results ───────────────────────────────────────────────────────────────
    totalEmissions_tCO2e: Number,
    results: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GhgCalculation', ghgCalculationSchema);
