const mongoose = require('mongoose');

const cleantechRegistrationSchema = new mongoose.Schema(
  {
    // ── Step 1: Company Info ──────────────────────────────────────────────────
    companyName: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
    solutionType: { type: String, required: true },
    targetIndustries: [{ type: String }],
    geographicRegions: [{ type: String }],
    contactName: { type: String, required: true, trim: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    companyDescription: { type: String, required: true, maxlength: 1000 },

    // ── Step 2: Requirements ──────────────────────────────────────────────────
    revenueStage: { type: String },
    teamSize: { type: String },
    fundingStatus: { type: String },
    keyDifferentiators: { type: String },
    clientsServed: { type: String },
    partnershipGoals: [{ type: String }],

    // ── Meta ──────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('CleantechRegistration', cleantechRegistrationSchema);
