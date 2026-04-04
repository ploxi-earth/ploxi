const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const AppError = require('../utils/AppError');

/**
 * Verify JWT and attach user to req.user
 * Supports both `users` table (admins, consultants, managers)
 * and `vendors` table (vendor role)
 */
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }

  // Try to find user in 'users' table first (admin, consultant, manager)
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, password_changed_at')
    .eq('id', decoded.id)
    .single();

  if (user) {
    // Check if password was changed after token was issued
    if (user.password_changed_at) {
      const changedTimestamp = Math.floor(new Date(user.password_changed_at).getTime() / 1000);
      if (decoded.iat < changedTimestamp) {
        return next(new AppError('Password was recently changed. Please log in again.', 401));
      }
    }

    if (!user.is_active) {
      return next(new AppError('Your account has been deactivated.', 403));
    }

    // Attach user object with consistent shape
    req.user = {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return next();
  }

  // If not found in users, try vendors table
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .select('id, company_name, contact_person, email, status')
    .eq('id', decoded.id)
    .single();

  if (vendor) {
    if (vendor.status === 'rejected') {
      return next(new AppError('Your application has been rejected. Please contact support.', 403));
    }

    // Check portal access for vendor
    const { data: profile } = await supabase
      .from('vendor_profiles')
      .select('portal_access_status')
      .eq('vendor_id', vendor.id)
      .single();

    if (profile?.portal_access_status === 'paused') {
      return next(new AppError('Your vendor account has been temporarily paused. Please contact the administrator.', 403));
    }

    req.user = {
      _id: vendor.id,
      id: vendor.id,
      name: vendor.contact_person,
      email: vendor.email,
      role: 'vendor',
      vendorId: vendor.id,
    };
    return next();
  }

  return next(new AppError('User no longer exists.', 401));
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
