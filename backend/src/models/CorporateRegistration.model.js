const mongoose = require('mongoose');

const corporateRegistrationSchema = new mongoose.Schema(
  {
    // ── Step 1: Company Details ───────────────────────────────────────────────
    fullName: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    industrySector: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },

    // ── Step 2: ESG & Compliance ──────────────────────────────────────────────
    currentEsgFrameworks: [{ type: String }],        // GRI, SASB, BRSR, etc.
    esgReportingStatus: { type: String },            // started / in-progress / not-started
    primaryEsgGoals: [{ type: String }],
    complianceRegulations: [{ type: String }],
    annualRevenueBand: { type: String },
    employeeCount: { type: String },
    sustainabilityTeamSize: { type: String },

    // ── Step 3: Verification ──────────────────────────────────────────────────
    hearAboutUs: { type: String },
    additionalNotes: { type: String },

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

module.exports = mongoose.model('CorporateRegistration', corporateRegistrationSchema);
