const crypto = require('crypto');
const User = require('../models/User.model');
const AppError = require('../utils/AppError');
const { sendTokenResponse, signAccessToken } = require('../utils/tokenUtils');
const { sendTemplatedEmail } = require('../utils/emailService');

// ── Register (vendor self-registration entry point) ────────────────────────
exports.register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Only vendor self-registration allowed via this endpoint
  const allowedRoles = ['vendor'];
  if (role && !allowedRoles.includes(role)) {
    return next(new AppError('Invalid role for self-registration.', 400));
  }

  const user = await User.create({ name, email, password, role: role || 'vendor' });
  sendTokenResponse(user, 201, res);
};

// ── Login ──────────────────────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
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
