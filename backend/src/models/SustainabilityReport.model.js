const mongoose = require('mongoose');

const sustainabilityReportSchema = new mongoose.Schema(
  {
    consultant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    clientName: { type: String, required: true },
    reportingPeriod: { type: String, required: true },   // e.g., "FY 2024-25"
    reportingYear: { type: Number, required: true },

    // ── Data Sections ─────────────────────────────────────────────────────────
    energyData: {
      totalElectricity_kWh: Number,
      renewableElectricity_kWh: Number,
      totalFuel_GJ: Number,
    },
    waterData: {
      totalWithdrawal_KL: Number,
      recycled_KL: Number,
    },
    wasteData: {
      totalWaste_tonnes: Number,
      recycled_tonnes: Number,
      hazardous_tonnes: Number,
    },
    emissionsData: {
      scope1_tCO2e: Number,
      scope2_tCO2e: Number,
      scope3_tCO2e: Number,
    },
    socialData: {
      totalEmployees: Number,
      femaleEmployees: Number,
      trainingHours: Number,
    },
    governanceData: {
      boardSize: Number,
      independentDirectors: Number,
      esgCommittee: Boolean,
    },

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'submitted', 'under_review', 'approved', 'published'],
      default: 'draft',
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    publishedAt: Date,
    reportFileUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SustainabilityReport', sustainabilityReportSchema);
