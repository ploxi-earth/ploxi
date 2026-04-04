const AppError = require('./AppError');

const VENDOR_PORTAL_PAUSED_MESSAGE =
  'Your vendor account has been temporarily paused. Please contact the administrator for more information.';
const VENDOR_PENDING_MESSAGE =
  'Your application is currently under review. You will be notified once approved.';
const VENDOR_REJECTED_MESSAGE =
  'Your application has been rejected. Please contact support for more information.';
const MANAGEABLE_VENDOR_STATUSES = ['approved', 'onboarding', 'onboarded'];

/**
 * Assert vendor can login (works with plain Supabase row objects)
 */
const assertVendorCanLogin = (vendor) => {
  if (!vendor) {
    throw new AppError('Vendor profile not found. Please contact support.', 404);
  }

  if (vendor.status === 'pending') {
    throw new AppError(VENDOR_PENDING_MESSAGE, 403);
  }

  if (vendor.status === 'rejected') {
    throw new AppError(VENDOR_REJECTED_MESSAGE, 403);
  }
};

/**
 * Assert vendor portal access (works with plain Supabase row objects)
 */
const assertVendorPortalAccess = (vendor) => {
  if (!vendor) {
    throw new AppError('Vendor profile not found.', 404);
  }

  // portal_access_status comes from vendor_profiles table
  if (vendor.portal_access_status === 'paused') {
    throw new AppError(VENDOR_PORTAL_PAUSED_MESSAGE, 403);
  }
};

module.exports = {
  MANAGEABLE_VENDOR_STATUSES,
  VENDOR_PENDING_MESSAGE,
  VENDOR_PORTAL_PAUSED_MESSAGE,
  VENDOR_REJECTED_MESSAGE,
  assertVendorCanLogin,
  assertVendorPortalAccess,
};
