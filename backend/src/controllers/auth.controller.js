const crypto = require('crypto');
const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const AppError = require('../utils/AppError');
const { sendTokenResponse } = require('../utils/tokenUtils');
const { sendTemplatedEmail } = require('../utils/emailService');
const { assertVendorCanLogin } = require('../utils/vendorAccess');

// ── Register (vendor self-registration) ────────────────────────────────────
exports.register = async (req, res, next) => {
  const { companyName, contactPerson, email, phone, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  // Create user with vendor role (inactive until admin approves)
  const user = await User.create({
    name: contactPerson,
    email,
    password,
    role: 'vendor',
    isActive: false, // Cannot log in until approved
  });

  // Create vendor record
  const vendor = await Vendor.create({
    user: user._id,
    companyName,
    contactPerson,
    email,
    phone,
    status: 'pending',
    onboardingStage: 'registration',
    onboardingHistory: [
      {
        stage: 'registration',
        note: 'Vendor self-registered',
      },
    ],
  });

  // Send registration confirmation email to vendor
  try {
    await sendTemplatedEmail('vendorRegistration', email, companyName);
  } catch (err) {
    // Don't fail registration if email fails
    console.error('Failed to send registration email:', err.message);
  }

  // Notify admin of new vendor application
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendTemplatedEmail('adminNewVendor', adminEmail, companyName, contactPerson, email);
    }
  } catch (err) {
    console.error('Failed to send admin notification:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Registration submitted successfully! Your application is under review. You will be notified once approved.',
  });
};

// ── Login ──────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }

  // For vendor users, check vendor status before allowing login
  if (user.role === 'vendor') {
    const vendor = await Vendor.findOne({ user: user._id });
    assertVendorCanLogin(vendor);
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated. Contact support.', 403));
  }

  sendTokenResponse(user, 200, res);
};

// ── Get current user ───────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── Forgot Password ────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Respond generically to prevent email enumeration
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
  await sendTemplatedEmail('passwordReset', user.email, resetUrl);

  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
};

// ── Reset Password ─────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
};

// ── Change Password ────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
};
