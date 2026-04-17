const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const AppError = require('../utils/AppError');
const { sendTokenResponse } = require('../utils/tokenUtils');
const { sendTemplatedEmail } = require('../utils/emailService');

const ONBOARDING_STAGES = [
  'registration', 'admin_review', 'company_details_submitted',
  'intro_meeting_scheduled', 'agreement_sent', 'agreement_signed', 'onboarded',
];

// ── Register (vendor self-registration) ────────────────────────────────────
// Matches v1 vendor register pattern: insert into vendors + onboarding_stages
exports.register = async (req, res, next) => {
  const {
    companyName,
    contactPerson,
    email,
    phone,
    password,
    vendorType,
    locationsServed,
    industryFocus,
    corporateProfile,
    legalEntityName,
    gstNumber,
    registeredAddress,
  } = req.body;

  // Check if vendor email already exists
  const { data: existing } = await supabase
    .from('vendors')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existing) {
    return next(new AppError('An account with this email already exists.', 400));
  }

  if (!password || password.length < 8) {
    return next(new AppError('Password must be at least 8 characters.', 400));
  }

  const password_hash = await bcrypt.hash(password, 12);

  // Insert vendor (matches v1 vendors table schema)
  const { data: vendor, error: vendorError } = await supabase
    .from('vendors')
    .insert({
      company_name: companyName,
      contact_person: contactPerson,
      email: email.toLowerCase().trim(),
      phone,
      vendor_type: vendorType || 'service',
      password_hash,
      status: 'pending',
    })
    .select('id, company_name, contact_person, email, phone, status, created_at')
    .single();

  if (vendorError) {
    console.error('Vendor insert error:', vendorError);
    return next(new AppError('Failed to create vendor account.', 500));
  }

  // Seed onboarding stages (matches v1 pattern)
  const stages = ONBOARDING_STAGES.map((stage_name, idx) => ({
    vendor_id: vendor.id,
    stage_name,
    status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'pending',
    completed_at: idx === 0 ? new Date().toISOString() : null,
  }));
  await supabase.from('onboarding_stages').insert(stages);

  await supabase.from('vendor_profiles').upsert({
    vendor_id: vendor.id,
    locations_served: locationsServed || [],
    industry_focus: industryFocus || [],
    corporate_profile: corporateProfile || null,
    legal_entity_name: legalEntityName || null,
    gst_number: gstNumber || null,
    registered_address: registeredAddress || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'vendor_id' });

  // Also create a user record for the protect middleware lookup
  await supabase.from('users').insert({
    id: vendor.id, // Same UUID as vendor
    name: contactPerson,
    email: email.toLowerCase().trim(),
    password_hash,
    role: 'vendor',
    is_active: false, // Cannot log in until approved
  });

  // Send registration confirmation email
  try {
    await sendTemplatedEmail('vendorRegistration', email, companyName);
  } catch (err) {
    console.error('Failed to send registration email:', err.message);
  }

  // Notify admin
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

  if (!email || !password) {
    return next(new AppError('Email and password are required.', 400));
  }

  // Try users table first (admin, consultant, manager)
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (user) {
    let storedHashUser = user.password_hash;
    if (typeof storedHashUser === 'string' && storedHashUser.startsWith('$2y$')) {
      storedHashUser = '$2a$' + storedHashUser.slice(4);
      console.warn('Normalized bcrypt hash prefix $2y -> $2a for user login', email.toLowerCase().trim());
    }
    const valid = await bcrypt.compare(password, storedHashUser);
    if (!valid) {
      console.warn('User login bcrypt.compare failed for', email.toLowerCase().trim());
      return next(new AppError('Invalid email or password.', 401));
    }

    // For vendor role users, check vendor status
    if (user.role === 'vendor') {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, status')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (!vendor) {
        return next(new AppError('Vendor profile not found.', 404));
      }
      if (vendor.status === 'pending') {
        return next(new AppError('Your application is currently under review. You will be notified once approved.', 403));
      }
      if (vendor.status === 'rejected') {
        return next(new AppError('Your application has been rejected. Please contact support.', 403));
      }
    }

    if (!user.is_active) {
      return next(new AppError('Your account has been deactivated. Contact support.', 403));
    }

    // Send token response (exclude password_hash)
    sendTokenResponse({ id: user.id, name: user.name, email: user.email, role: user.role }, 200, res);
    return;
  }

  // If not in users table, try vendors table directly (fallback)
  const { data: vendor } = await supabase
    .from('vendors')
    .select('id, company_name, contact_person, email, status, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (!vendor) {
    return next(new AppError('Invalid email or password.', 401));
  }

  let storedHashVendor = vendor.password_hash;
  if (typeof storedHashVendor === 'string' && storedHashVendor.startsWith('$2y$')) {
    storedHashVendor = '$2a$' + storedHashVendor.slice(4);
    console.warn('Normalized bcrypt hash prefix $2y -> $2a for vendor login', email.toLowerCase().trim());
  }
  const validVendor = await bcrypt.compare(password, storedHashVendor);
  if (!validVendor) {
    console.warn('Vendor login bcrypt.compare failed for', email.toLowerCase().trim());
    return next(new AppError('Invalid email or password.', 401));
  }

  if (vendor.status === 'pending') {
    return next(new AppError('Your application is currently under review. You will be notified once approved.', 403));
  }
  if (vendor.status === 'rejected') {
    return next(new AppError('Your application has been rejected. Please contact support.', 403));
  }

  sendTokenResponse({
    id: vendor.id,
    name: vendor.contact_person,
    email: vendor.email,
    role: 'vendor',
  }, 200, res);
};

// ── Get current user ───────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// ── Forgot Password ────────────────────────────────────────────────────────
exports.forgotPassword = async (req, res, next) => {
  const email = req.body.email?.toLowerCase().trim();

  // Check users table
  const { data: user } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single();

  if (!user) {
    // Don't reveal if email exists
    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  await supabase
    .from('users')
    .update({
      password_reset_token: hashedToken,
      password_reset_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })
    .eq('id', user.id);

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${resetToken}`;
  await sendTemplatedEmail('passwordReset', user.email, resetUrl);

  res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
};

// ── Reset Password ─────────────────────────────────────────────────────────
exports.resetPassword = async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('password_reset_token', hashedToken)
    .gt('password_reset_expires', new Date().toISOString())
    .single();

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  const password_hash = await bcrypt.hash(req.body.password, 12);

  await supabase
    .from('users')
    .update({
      password_hash,
      password_reset_token: null,
      password_reset_expires: null,
      password_changed_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  // Also update vendors table if this user is a vendor
  await supabase
    .from('vendors')
    .update({ password_hash })
    .eq('id', user.id);

  const { data: updatedUser } = await supabase
    .from('users')
    .select('id, name, email, role')
    .eq('id', user.id)
    .single();

  sendTokenResponse(updatedUser, 200, res);
};

// ── Change Password ────────────────────────────────────────────────────────
exports.changePassword = async (req, res, next) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, name, email, role, password_hash')
    .eq('id', req.user._id)
    .single();

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  let storedHashForChange = user.password_hash;
  if (typeof storedHashForChange === 'string' && storedHashForChange.startsWith('$2y$')) {
    storedHashForChange = '$2a$' + storedHashForChange.slice(4);
    console.warn('Normalized bcrypt hash prefix $2y -> $2a for changePassword (user)');
  }
  const validChange = await bcrypt.compare(req.body.currentPassword, storedHashForChange);
  if (!validChange) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  const newHash = await bcrypt.hash(req.body.newPassword, 12);

  await supabase
    .from('users')
    .update({
      password_hash: newHash,
      password_changed_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  // Also update vendors table if this user is a vendor
  await supabase
    .from('vendors')
    .update({ password_hash: newHash })
    .eq('id', user.id);

  sendTokenResponse({ id: user.id, name: user.name, email: user.email, role: user.role }, 200, res);
};
