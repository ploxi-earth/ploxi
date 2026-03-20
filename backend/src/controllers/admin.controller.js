const crypto = require('crypto');
const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const CorporateRegistration = require('../models/CorporateRegistration.model');
const CleantechRegistration = require('../models/CleantechRegistration.model');
const ClimateFinanceRegistration = require('../models/ClimateFinanceRegistration.model');
const AppError = require('../utils/AppError');
const { sendTemplatedEmail } = require('../utils/emailService');
const { MANAGEABLE_VENDOR_STATUSES } = require('../utils/vendorAccess');

// ── Dashboard Stats ────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  const [total, pending, approved, rejected, onboarding, onboarded] = await Promise.all([
    Vendor.countDocuments(),
    Vendor.countDocuments({ status: 'pending' }),
    Vendor.countDocuments({ status: 'approved' }),
    Vendor.countDocuments({ status: 'rejected' }),
    Vendor.countDocuments({ status: 'onboarding' }),
    Vendor.countDocuments({ status: 'onboarded' }),
  ]);

  const [corporateCount, cleantechCount, climateCount] = await Promise.all([
    CorporateRegistration.countDocuments(),
    CleantechRegistration.countDocuments(),
    ClimateFinanceRegistration.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      vendors: { total, pending, approved, rejected, onboarding, onboarded },
      registrations: {
        corporate: corporateCount,
        cleantech: cleantechCount,
        climateFinance: climateCount,
      },
    },
  });
};

// ── Create Admin ───────────────────────────────────────────────────────────
exports.createAdmin = async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const allowedRoles = ['platform_admin', 'consultant', 'manager'];
  if (!allowedRoles.includes(role)) {
    return next(new AppError('Invalid admin role.', 400));
  }
  const admin = await User.create({ name, email, password, role });
  admin.password = undefined;
  res.status(201).json({ success: true, data: admin });
};

// ── List All Vendors ───────────────────────────────────────────────────────
exports.getVendors = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [vendors, total] = await Promise.all([
    Vendor.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Vendor.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: vendors,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
};

// ── Get Single Vendor ──────────────────────────────────────────────────────
exports.getVendor = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id).populate('user', 'name email createdAt');
  if (!vendor) return next(new AppError('Vendor not found.', 404));
  res.json({ success: true, data: vendor });
};

// ── Add Vendor (Admin Invites) ─────────────────────────────────────────────
exports.addVendor = async (req, res, next) => {
  const { companyName, email, phone, contactPerson } = req.body;

  // Create a placeholder user
  const tempPassword = crypto.randomBytes(8).toString('hex');
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ name: contactPerson, email, password: tempPassword, role: 'vendor' });
  }

  const inviteToken = crypto.randomBytes(32).toString('hex');
  const vendor = await Vendor.create({
    user: user._id,
    companyName,
    email,
    phone,
    contactPerson,
    registrationSource: 'admin_invited',
    inviteToken: crypto.createHash('sha256').update(inviteToken).digest('hex'),
    inviteTokenExpires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  });

  const inviteUrl = `${process.env.CLIENT_URL}/vendor/accept-invite/${inviteToken}`;
  await sendTemplatedEmail('vendorInvite', email, inviteUrl);

  res.status(201).json({ success: true, data: vendor, message: 'Vendor added and invitation sent.' });
};

// ── Approve Vendor ─────────────────────────────────────────────────────────
exports.approveVendor = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  vendor.status = 'approved';
  vendor.onboardingStage = 'admin_review';
  vendor.reviewedBy = req.user._id;
  vendor.approvedAt = Date.now();
  vendor.onboardingHistory.push({
    stage: 'admin_review',
    updatedBy: req.user._id,
    note: req.body.note || 'Approved by admin',
  });
  await vendor.save();

  // Activate user account so vendor can log in
  await User.findByIdAndUpdate(vendor.user, { isActive: true });

  try {
    const loginUrl = `${process.env.CLIENT_URL}/auth/login`;
    await sendTemplatedEmail('vendorApproved', vendor.email, vendor.companyName, loginUrl);
  } catch (err) {
    console.error('Failed to send approval email:', err.message);
  }

  res.json({ success: true, data: vendor, message: 'Vendor approved successfully.' });
};

// ── Reject Vendor ──────────────────────────────────────────────────────────
exports.rejectVendor = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  vendor.status = 'rejected';
  vendor.reviewedBy = req.user._id;
  vendor.rejectedAt = Date.now();
  vendor.reviewNote = req.body.note;
  vendor.onboardingHistory.push({
    stage: 'admin_review',
    updatedBy: req.user._id,
    note: req.body.note || 'Rejected by admin',
  });
  await vendor.save();

  // Deactivate user account
  await User.findByIdAndUpdate(vendor.user, { isActive: false });

  try {
    await sendTemplatedEmail('vendorRejected', vendor.email, vendor.companyName, req.body.note);
  } catch (err) {
    console.error('Failed to send rejection email:', err.message);
  }

  res.json({ success: true, data: vendor, message: 'Vendor rejected.' });
};

// ── Schedule Meeting ───────────────────────────────────────────────────────
exports.scheduleMeeting = async (req, res, next) => {
  const { date, time, link, note } = req.body;
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  vendor.meetingDate = date;
  vendor.meetingTime = time;
  vendor.meetingLink = link || '';
  vendor.meetingNote = note;
  vendor.status = 'onboarding';
  vendor.onboardingStage = 'intro_meeting_scheduled';
  vendor.onboardingHistory.push({
    stage: 'intro_meeting_scheduled',
    updatedBy: req.user._id,
    note: `Meeting on ${date} at ${time}`,
  });
  await vendor.save();

  try {
    await sendTemplatedEmail('meetingScheduled', vendor.email, vendor.companyName, date, time, vendor.meetingLink);
  } catch (err) {
    console.error('Failed to send meeting email:', err.message);
  }

  res.json({ success: true, data: vendor });
};

// ── Send Agreement ─────────────────────────────────────────────────────────
exports.sendAgreement = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  const { note } = req.body;

  vendor.agreementStatus = 'sent';
  vendor.agreementSentAt = Date.now();
  vendor.onboardingStage = 'agreement_sent';
  vendor.onboardingHistory.push({
    stage: 'agreement_sent',
    updatedBy: req.user._id,
    note: note || 'Agreement sent to vendor via email',
  });
  await vendor.save();

  try {
    await sendTemplatedEmail('agreementSent', vendor.email, vendor.companyName, note);
  } catch (err) {
    console.error('Failed to send agreement email:', err.message);
  }

  res.json({ success: true, data: vendor, message: 'Agreement sent to vendor via email.' });
};

// ── Mark Agreement Signed ──────────────────────────────────────────────────
exports.markAgreementSigned = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  vendor.agreementStatus = 'signed';
  vendor.agreementSignedAt = Date.now();
  vendor.onboardingStage = 'agreement_signed';
  vendor.onboardingHistory.push({
    stage: 'agreement_signed',
    updatedBy: req.user._id,
    note: 'Agreement confirmed as signed',
  });
  await vendor.save();

  res.json({ success: true, data: vendor });
};

// ── Complete Onboarding ────────────────────────────────────────────────────
exports.completeOnboarding = async (req, res, next) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  vendor.status = 'onboarded';
  vendor.onboardingStage = 'onboarded';
  vendor.onboardedAt = Date.now();
  vendor.onboardingHistory.push({
    stage: 'onboarded',
    updatedBy: req.user._id,
    note: 'Onboarding completed',
  });
  await vendor.save();

  res.json({ success: true, data: vendor, message: 'Vendor onboarding completed.' });
};

// ── Pause / Resume Vendor Portal Access ───────────────────────────────────
exports.setVendorPortalAccess = async (req, res, next) => {
  const { portalAccessStatus, reason } = req.body;

  if (!['active', 'paused'].includes(portalAccessStatus)) {
    return next(new AppError('Invalid vendor portal access status.', 400));
  }

  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return next(new AppError('Vendor not found.', 404));

  if (!MANAGEABLE_VENDOR_STATUSES.includes(vendor.status)) {
    return next(new AppError('Portal access can only be managed after the vendor has been approved.', 400));
  }

  const currentPortalAccessStatus = vendor.portalAccessStatus || 'active';
  if (currentPortalAccessStatus === portalAccessStatus) {
    return res.json({
      success: true,
      data: vendor,
      message:
        portalAccessStatus === 'paused'
          ? 'Vendor portal access is already paused.'
          : 'Vendor portal access is already active.',
    });
  }

  vendor.portalAccessStatus = portalAccessStatus;

  if (portalAccessStatus === 'paused') {
    vendor.portalAccessPausedAt = Date.now();
    vendor.portalAccessPauseReason = reason?.trim() || undefined;
    vendor.portalAccessPausedBy = req.user._id;
    vendor.portalAccessResumedAt = undefined;
    vendor.portalAccessResumedBy = undefined;
  } else {
    vendor.portalAccessPausedAt = undefined;
    vendor.portalAccessPauseReason = undefined;
    vendor.portalAccessPausedBy = undefined;
    vendor.portalAccessResumedAt = Date.now();
    vendor.portalAccessResumedBy = req.user._id;
  }

  await vendor.save();

  res.json({
    success: true,
    data: vendor,
    message:
      portalAccessStatus === 'paused'
        ? 'Vendor portal access paused.'
        : 'Vendor portal access reactivated.',
  });
};

// ── List All Corporate Registrations ───────────────────────────────────────
exports.getCorporateRegistrations = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [docs, total] = await Promise.all([
    CorporateRegistration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    CorporateRegistration.countDocuments(filter),
  ]);
  res.json({ success: true, data: docs, pagination: { total, page: Number(page), limit: Number(limit) } });
};

// ── List All CleanTech Registrations ───────────────────────────────────────
exports.getCleantechRegistrations = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const [docs, total] = await Promise.all([
    CleantechRegistration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    CleantechRegistration.countDocuments(filter),
  ]);
  res.json({ success: true, data: docs, pagination: { total, page: Number(page), limit: Number(limit) } });
};

// ── List All Climate Finance Registrations ─────────────────────────────────
exports.getClimateFinanceRegistrations = async (req, res) => {
  const { status, engagementType, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (engagementType) filter.engagementType = engagementType;
  const skip = (Number(page) - 1) * Number(limit);
  const [docs, total] = await Promise.all([
    ClimateFinanceRegistration.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    ClimateFinanceRegistration.countDocuments(filter),
  ]);
  res.json({ success: true, data: docs, pagination: { total, page: Number(page), limit: Number(limit) } });
};
