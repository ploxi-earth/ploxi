const mongoose = require('mongoose');

const ONBOARDING_STAGES = [
  'registration',
  'admin_review',
  'company_details_submitted',
  'intro_meeting_scheduled',
  'agreement_sent',
  'agreement_signed',
  'onboarded',
];

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // ── Basic Info ────────────────────────────────────────────────────────────
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },

    // ── Company Profile ───────────────────────────────────────────────────────
    website: { type: String, trim: true },
    solutionType: { type: String, trim: true },
    targetIndustries: [{ type: String }],
    geographicRegions: [{ type: String }],
    companyDescription: { type: String, maxlength: 1000 },
    servicesOffered: [{ type: String }],
    sector: { type: String },
    location: { type: String },

    // ── Status & Onboarding ───────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'onboarding', 'onboarded'],
      default: 'pending',
    },
    onboardingStage: {
      type: String,
      enum: ONBOARDING_STAGES,
      default: 'registration',
    },
    onboardingHistory: [
      {
        stage: String,
        updatedAt: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],

    // ── Meeting ───────────────────────────────────────────────────────────────
    meetingDate: Date,
    meetingTime: String,
    meetingNote: String,

    // ── Agreement ─────────────────────────────────────────────────────────────
    agreementFileUrl: String,
    agreementSentAt: Date,
    agreementSignedAt: Date,

    // ── Admin Actions ─────────────────────────────────────────────────────────
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: String,
    approvedAt: Date,
    rejectedAt: Date,
    onboardedAt: Date,

    // ── Source ────────────────────────────────────────────────────────────────
    registrationSource: {
      type: String,
      enum: ['self_registered', 'admin_invited'],
      default: 'self_registered',
    },
    inviteToken: { type: String, select: false },
    inviteTokenExpires: Date,
  },
  { timestamps: true }
);

vendorSchema.virtual('profileCompletion').get(function () {
  const fields = [
    this.companyName,
    this.contactPerson,
    this.email,
    this.phone,
    this.website,
    this.solutionType,
    this.companyDescription,
    this.location,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vendor', vendorSchema);
module.exports.ONBOARDING_STAGES = ONBOARDING_STAGES;
