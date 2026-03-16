const mongoose = require('mongoose');

const climateFinanceRegistrationSchema = new mongoose.Schema(
  {
    engagementType: {
      type: String,
      enum: ['raise_funding', 'investor', 'participate'],
      required: true,
    },

    // ── Common ────────────────────────────────────────────────────────────────
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String },
    organization: { type: String },
    website: { type: String },

    // ── Raise Funding ─────────────────────────────────────────────────────────
    projectName: { type: String },
    projectDescription: { type: String },
    fundingRequired: { type: String },
    projectStage: { type: String },
    sector: { type: String },

    // ── Investor ──────────────────────────────────────────────────────────────
    investmentFocus: [{ type: String }],
    ticketSize: { type: String },
    geographicPreference: [{ type: String }],

    // ── Participate ───────────────────────────────────────────────────────────
    participationType: { type: String },    // event / consultation
    areaOfInterest: { type: String },
    message: { type: String },

    // ── Meta ──────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'contacted', 'converted'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClimateFinanceRegistration', climateFinanceRegistrationSchema);
