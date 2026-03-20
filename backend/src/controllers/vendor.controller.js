const Vendor = require('../models/Vendor.model');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');

// ── Get My Vendor Profile ─────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new AppError('Vendor profile not found.', 404));
  res.json({ success: true, data: vendor });
};

// ── Update Vendor Profile ─────────────────────────────────────────────────
exports.upsertProfile = async (req, res, next) => {
  const allowedFields = [
    'companyName', 'contactPerson', 'phone', 'website',
    'companyDescription', 'servicesOffered', 'sector', 'location',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    return next(new AppError('Vendor profile not found.', 404));
  }

  Object.assign(vendor, updates);

  // Advance onboarding stage when profile is meaningfully completed
  if (
    vendor.onboardingStage === 'admin_review' &&
    vendor.companyDescription &&
    vendor.servicesOffered &&
    vendor.sector &&
    vendor.location
  ) {
    vendor.onboardingStage = 'company_details_submitted';
    vendor.onboardingHistory.push({
      stage: 'company_details_submitted',
      note: 'Profile completed by vendor',
    });
  }

  await vendor.save();
  res.json({ success: true, data: vendor });
};

// ── Get Onboarding Status ──────────────────────────────────────────────────
exports.getOnboardingStatus = async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id }).select(
    'status onboardingStage onboardingHistory meetingDate meetingTime meetingLink agreementStatus agreementSentAt agreementSignedAt onboardedAt profileCompletion'
  );
  if (!vendor) return next(new AppError('Vendor profile not found.', 404));
  res.json({ success: true, data: vendor });
};
