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
    companyDescription: { type: String, maxlength: 1000 },
    servicesOffered: { type: String, trim: true },
    sector: { type: String, trim: true },
    location: { type: String, trim: true },
    vendorType: { type: String, enum: ['product', 'service'], default: 'service' },
    locationsServed: [{ type: String, trim: true }],
    industryFocus: [{ type: String, trim: true }],
    corporateProfile: { type: String, maxlength: 2000 },
    legalEntityName: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    registeredAddress: { type: String, trim: true },

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
    meetingLink: String,
    meetingNote: String,

    // ── Agreement ─────────────────────────────────────────────────────────────
    agreementStatus: {
      type: String,
      enum: ['not_sent', 'sent', 'viewed', 'pending_signature', 'signed'],
      default: 'not_sent',
    },
    agreementSentAt: Date,
    agreementSignedAt: Date,

    // ── Admin Actions ─────────────────────────────────────────────────────────
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewNote: String,
    approvedAt: Date,
    rejectedAt: Date,
    onboardedAt: Date,
    portalAccessStatus: {
      type: String,
      enum: ['active', 'paused'],
      default: 'active',
    },
    portalAccessPausedAt: Date,
    portalAccessPauseReason: { type: String, trim: true, maxlength: 500 },
    portalAccessPausedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    portalAccessResumedAt: Date,
    portalAccessResumedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

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
    this.phone,
    this.website,
    this.companyDescription,
    this.servicesOffered,
    this.sector,
    this.location,
    this.locationsServed,
    this.industryFocus,
    this.corporateProfile,
    this.legalEntityName,
    this.gstNumber,
    this.registeredAddress,
  ];
  const filled = fields.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return Boolean(value);
  }).length;
  return Math.round((filled / fields.length) * 100);
});

vendorSchema.set('toJSON', { virtuals: true });
vendorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vendor', vendorSchema);
module.exports.ONBOARDING_STAGES = ONBOARDING_STAGES;
