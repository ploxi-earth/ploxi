const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Vendor = require('../models/Vendor.model');
const AppError = require('../utils/AppError');
const { assertVendorPortalAccess } = require('../utils/vendorAccess');

/**
 * Verify JWT and attach user to req.user
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('+passwordChangedAt');

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password was recently changed. Please log in again.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated.', 403));
  }

  if (user.role === 'vendor') {
    const vendor = await Vendor.findOne({ user: user._id }).select('portalAccessStatus');
    assertVendorPortalAccess(vendor);
  }

  req.user = user;
  next();
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
