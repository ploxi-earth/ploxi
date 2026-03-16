const Vendor = require('../models/Vendor.model');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');

// ── Get My Vendor Profile ─────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) return next(new AppError('Vendor profile not found.', 404));
  res.json({ success: true, data: vendor });
};

// ── Create / Update Vendor Profile ────────────────────────────────────────
exports.upsertProfile = async (req, res, next) => {
  const allowedFields = [
    'companyName', 'contactPerson', 'phone', 'website',
    'solutionType', 'targetIndustries', 'geographicRegions',
    'companyDescription', 'servicesOffered', 'sector', 'location',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  let vendor = await Vendor.findOne({ user: req.user._id });

  if (!vendor) {
    vendor = await Vendor.create({ user: req.user._id, email: req.user.email, ...updates });
  } else {
    Object.assign(vendor, updates);
    if (vendor.onboardingStage === 'registration') {
      vendor.onboardingStage = 'company_details_submitted';
      vendor.onboardingHistory.push({ stage: 'company_details_submitted', note: 'Profile completed by vendor' });
    }
    await vendor.save();
  }

  res.json({ success: true, data: vendor });
};

// ── Get Onboarding Status ──────────────────────────────────────────────────
exports.getOnboardingStatus = async (req, res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id }).select(
    'status onboardingStage onboardingHistory meetingDate meetingTime agreementFileUrl agreementSentAt agreementSignedAt onboardedAt profileCompletion'
  );
  if (!vendor) return next(new AppError('Vendor profile not found.', 404));
  res.json({ success: true, data: vendor });
};
