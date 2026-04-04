const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');
const AppError = require('../utils/AppError');
const { sendTemplatedEmail } = require('../utils/emailService');
const { MANAGEABLE_VENDOR_STATUSES } = require('../utils/vendorAccess');

// ── Dashboard Stats ────────────────────────────────────────────────────────
exports.getDashboardStats = async (req, res) => {
  // Vendor counts by status
  const statuses = ['pending', 'approved', 'rejected', 'onboarding', 'onboarded'];
  const vendorCounts = {};

  const { count: total } = await supabase.from('vendors').select('*', { count: 'exact', head: true });
  vendorCounts.total = total || 0;

  for (const s of statuses) {
    const { count } = await supabase.from('vendors').select('*', { count: 'exact', head: true }).eq('status', s);
    vendorCounts[s] = count || 0;
  }

  // Registration counts
  const { count: corporateCount } = await supabase.from('corporate_registrations').select('*', { count: 'exact', head: true });
  const { count: cleantechCount } = await supabase.from('cleantech_registrations').select('*', { count: 'exact', head: true });
  const { count: climateCount } = await supabase.from('climate_finance_registrations').select('*', { count: 'exact', head: true });

  res.json({
    success: true,
    data: {
      vendors: vendorCounts,
      registrations: {
        corporate: corporateCount || 0,
        cleantech: cleantechCount || 0,
        climateFinance: climateCount || 0,
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

  const password_hash = await bcrypt.hash(password, 12);

  const { data: admin, error } = await supabase
    .from('users')
    .insert({ name, email: email.toLowerCase().trim(), password_hash, role })
    .select('id, name, email, role, created_at')
    .single();

  if (error) {
    if (error.code === '23505') return next(new AppError('Email already exists.', 400));
    throw error;
  }

  res.status(201).json({ success: true, data: admin });
};

// ── List All Vendors ───────────────────────────────────────────────────────
exports.getVendors = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase.from('vendors').select('*', { count: 'exact' });

  if (status) query = query.eq('status', status);
  if (search) {
    query = query.or(`company_name.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: vendors, count: total, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  if (error) throw error;

  res.json({
    success: true,
    data: vendors,
    pagination: { total: total || 0, page: Number(page), limit: Number(limit), pages: Math.ceil((total || 0) / limit) },
  });
};

// ── Get Single Vendor ──────────────────────────────────────────────────────
exports.getVendor = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  // Get onboarding stages
  const { data: stages } = await supabase
    .from('onboarding_stages')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('created_at', { ascending: true });

  // Get profile
  const { data: profile } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('vendor_id', vendor.id)
    .single();

  // Get meetings (most recent first)
  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('created_at', { ascending: false });

  // Get agreements (most recent first)
  const { data: agreements } = await supabase
    .from('agreements')
    .select('*')
    .eq('vendor_id', vendor.id)
    .order('sent_at', { ascending: false });

  // ── Compute onboardingStage from stage records ────────────────────────
  const stageRecords = stages || [];
  const activeStage = stageRecords.find(s => s.status === 'active');
  const allCompleted = stageRecords.length > 0 && stageRecords.every(s => s.status === 'completed');
  const onboardingStage =
    vendor.status === 'onboarded' || allCompleted
      ? 'onboarded'
      : (activeStage?.stage_name || 'registration');

  // ── Build onboardingHistory for the timeline ──────────────────────────
  const onboardingHistory = stageRecords
    .filter(s => s.completed_at || s.status === 'active')
    .map(s => ({
      stage: s.stage_name,
      updatedAt: s.completed_at || s.updated_at || s.created_at,
      note: s.notes || undefined,
    }));

  // ── Flatten latest meeting data ───────────────────────────────────────
  const latestMeeting = meetings?.[0] || null;
  const latestAgreement = agreements?.[0] || null;

  // ── Determine agreement status ────────────────────────────────────────
  let agreementStatus = 'not_sent';
  if (latestAgreement) {
    agreementStatus = latestAgreement.signed ? 'signed' : 'sent';
  }

  // ── Compute profile completion ────────────────────────────────────────
  let profileCompletion = 0;
  if (profile) {
    const fields = [profile.services, profile.sector, profile.location, profile.website];
    const filled = fields.filter(f => f && String(f).trim()).length;
    profileCompletion = Math.round((filled / fields.length) * 100);
    if (profile.profile_completed) profileCompletion = 100;
  }

  // ── Build camelCase response matching frontend VendorDetail interface ─
  res.json({
    success: true,
    data: {
      _id: vendor.id,
      companyName: vendor.company_name,
      email: vendor.email,
      phone: vendor.phone,
      contactPerson: vendor.contact_person,
      status: vendor.status,
      onboardingStage,
      onboardingHistory,

      // Portal access (from vendor_profiles)
      portalAccessStatus: profile?.portal_access_status || 'active',
      portalAccessPausedAt: profile?.portal_access_paused_at || null,
      portalAccessPauseReason: profile?.portal_access_pause_reason || null,
      portalAccessResumedAt: profile?.portal_access_resumed_at || null,

      // Profile detail
      website: profile?.website || null,
      companyDescription: profile?.description || null,
      servicesOffered: profile?.services || null,
      sector: profile?.sector || null,
      location: profile?.location || null,
      profileCompletion,

      // Meeting info (latest)
      meetingDate: latestMeeting?.scheduled_date || null,
      meetingTime: latestMeeting?.scheduled_time || null,
      meetingLink: latestMeeting?.meeting_link || null,
      meetingNote: latestMeeting?.notes || null,

      // Agreement info (latest)
      agreementStatus,
      agreementSentAt: latestAgreement?.sent_at || null,
      agreementSignedAt: latestAgreement?.signed_at || null,

      // Timestamps
      approvedAt: vendor.approved_at || null,
      rejectedAt: vendor.rejected_at || null,
      onboardedAt: vendor.onboarded_at || null,
      reviewNote: vendor.review_note || null,
      createdAt: vendor.created_at,
    },
  });
};

// ── Add Vendor (Admin Invites) ─────────────────────────────────────────────
exports.addVendor = async (req, res, next) => {
  const { companyName, email, phone, contactPerson } = req.body;

  // Check if vendor already exists
  const { data: existing } = await supabase
    .from('vendors')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (existing) {
    return next(new AppError('A vendor with this email already exists.', 400));
  }

  const tempPassword = crypto.randomBytes(8).toString('hex');
  const password_hash = await bcrypt.hash(tempPassword, 12);
  const inviteToken = crypto.randomBytes(32).toString('hex');

  const { data: vendor, error } = await supabase
    .from('vendors')
    .insert({
      company_name: companyName,
      contact_person: contactPerson,
      email: email.toLowerCase().trim(),
      phone,
      password_hash,
      status: 'pending',
    })
    .select('*')
    .single();

  if (error) throw error;

  // Also create user record
  await supabase.from('users').insert({
    id: vendor.id,
    name: contactPerson,
    email: email.toLowerCase().trim(),
    password_hash,
    role: 'vendor',
    is_active: false,
  });

  // Seed onboarding stages
  const ONBOARDING_STAGES = [
    'registration', 'admin_review', 'company_details_submitted',
    'intro_meeting_scheduled', 'agreement_sent', 'agreement_signed', 'onboarded',
  ];
  const stages = ONBOARDING_STAGES.map((stage_name, idx) => ({
    vendor_id: vendor.id,
    stage_name,
    status: idx === 0 ? 'completed' : idx === 1 ? 'active' : 'pending',
    completed_at: idx === 0 ? new Date().toISOString() : null,
  }));
  await supabase.from('onboarding_stages').insert(stages);

  const inviteUrl = `${process.env.CLIENT_URL}/vendor/accept-invite/${inviteToken}`;
  try {
    await sendTemplatedEmail('vendorInvite', email, inviteUrl);
  } catch (err) {
    console.error('Failed to send invite email:', err.message);
  }

  res.status(201).json({ success: true, data: vendor, message: 'Vendor added and invitation sent.' });
};

// ── Approve Vendor ─────────────────────────────────────────────────────────
exports.approveVendor = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  // Update vendor status
  await supabase
    .from('vendors')
    .update({ status: 'approved' })
    .eq('id', vendor.id);

  // Update onboarding stage
  await supabase
    .from('onboarding_stages')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'admin_review');

  // Activate user account so vendor can log in
  await supabase
    .from('users')
    .update({ is_active: true })
    .eq('id', vendor.id);

  try {
    const loginUrl = `${process.env.CLIENT_URL}/auth/login`;
    await sendTemplatedEmail('vendorApproved', vendor.email, vendor.company_name, loginUrl);
  } catch (err) {
    console.error('Failed to send approval email:', err.message);
  }

  const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
  res.json({ success: true, data: updated, message: 'Vendor approved successfully.' });
};

// ── Reject Vendor ──────────────────────────────────────────────────────────
exports.rejectVendor = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  await supabase
    .from('vendors')
    .update({ status: 'rejected' })
    .eq('id', vendor.id);

  // Deactivate user
  await supabase.from('users').update({ is_active: false }).eq('id', vendor.id);

  try {
    await sendTemplatedEmail('vendorRejected', vendor.email, vendor.company_name, req.body.note);
  } catch (err) {
    console.error('Failed to send rejection email:', err.message);
  }

  const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
  res.json({ success: true, data: updated, message: 'Vendor rejected.' });
};

// ── Schedule Meeting ───────────────────────────────────────────────────────
exports.scheduleMeeting = async (req, res, next) => {
  const { date, time, link, note } = req.body;
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  // Insert meeting record
  await supabase.from('meetings').insert({
    vendor_id: vendor.id,
    scheduled_date: date,
    scheduled_time: time,
    meeting_link: link || '',
    notes: note,
  });

  // Update vendor status
  await supabase.from('vendors').update({ status: 'onboarding' }).eq('id', vendor.id);

  // Update onboarding stage
  await supabase
    .from('onboarding_stages')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'company_details_submitted');

  await supabase
    .from('onboarding_stages')
    .update({ status: 'active' })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'intro_meeting_scheduled');

  try {
    await sendTemplatedEmail('meetingScheduled', vendor.email, vendor.company_name, date, time, link);
  } catch (err) {
    console.error('Failed to send meeting email:', err.message);
  }

  const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
  res.json({ success: true, data: updated });
};

// ── Send Agreement ─────────────────────────────────────────────────────────
exports.sendAgreement = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  const { note } = req.body;

  // Insert agreement record
  await supabase.from('agreements').insert({
    vendor_id: vendor.id,
    file_name: 'Partnership Agreement',
    sent_at: new Date().toISOString(),
  });

  // Update onboarding stage
  await supabase
    .from('onboarding_stages')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'intro_meeting_scheduled');

  await supabase
    .from('onboarding_stages')
    .update({ status: 'active' })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'agreement_sent');

  try {
    await sendTemplatedEmail('agreementSent', vendor.email, vendor.company_name, note);
  } catch (err) {
    console.error('Failed to send agreement email:', err.message);
  }

  const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
  res.json({ success: true, data: updated, message: 'Agreement sent to vendor via email.' });
};

// ── Mark Agreement Signed ──────────────────────────────────────────────────
exports.markAgreementSigned = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  // Update latest agreement
  await supabase
    .from('agreements')
    .update({ signed: true, signed_at: new Date().toISOString() })
    .eq('vendor_id', vendor.id)
    .is('signed_at', null);

  // Update onboarding stage
  await supabase
    .from('onboarding_stages')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'agreement_sent');

  await supabase
    .from('onboarding_stages')
    .update({ status: 'active' })
    .eq('vendor_id', vendor.id)
    .eq('stage_name', 'agreement_signed');

  const { data: updated } = await supabase.from('vendors').select('*').eq('id', vendor.id).single();
  res.json({ success: true, data: updated });
};

// ── Complete Onboarding ────────────────────────────────────────────────────
exports.completeOnboarding = async (req, res, next) => {
  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  const now = new Date().toISOString();

  const { data: updatedVendor, error: updateErr } = await supabase
    .from('vendors')
    .update({ status: 'onboarded', onboarded_at: now })
    .eq('id', vendor.id)
    .select('*')
    .single();

  if (updateErr) {
    return next(new AppError(updateErr.message || 'Failed to update vendor status.', 500));
  }
  if (!updatedVendor || updatedVendor.status !== 'onboarded') {
    return next(new AppError('Vendor status was not updated.', 500));
  }

  const { error: stagesErr } = await supabase
    .from('onboarding_stages')
    .update({ status: 'completed', completed_at: now })
    .eq('vendor_id', vendor.id);

  if (stagesErr) {
    return next(new AppError(stagesErr.message || 'Failed to update onboarding stages.', 500));
  }

  res.json({ success: true, data: updatedVendor, message: 'Vendor onboarding completed.' });
};

// ── Pause / Resume Vendor Portal Access ───────────────────────────────────
exports.setVendorPortalAccess = async (req, res, next) => {
  const { portalAccessStatus, reason } = req.body;

  if (!['active', 'paused'].includes(portalAccessStatus)) {
    return next(new AppError('Invalid vendor portal access status.', 400));
  }

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !vendor) return next(new AppError('Vendor not found.', 404));

  if (!MANAGEABLE_VENDOR_STATUSES.includes(vendor.status)) {
    return next(new AppError('Portal access can only be managed after the vendor has been approved.', 400));
  }

  // Upsert vendor_profiles with portal access status
  const profileData = {
    vendor_id: vendor.id,
    portal_access_status: portalAccessStatus,
    updated_at: new Date().toISOString(),
  };

  if (portalAccessStatus === 'paused') {
    profileData.portal_access_paused_at = new Date().toISOString();
    profileData.portal_access_pause_reason = reason?.trim() || null;
  }

  const { data: existingProfile } = await supabase
    .from('vendor_profiles')
    .select('id')
    .eq('vendor_id', vendor.id)
    .maybeSingle();

  if (existingProfile) {
    await supabase.from('vendor_profiles').update(profileData).eq('vendor_id', vendor.id);
  } else {
    await supabase.from('vendor_profiles').insert(profileData);
  }

  res.json({
    success: true,
    data: vendor,
    message: portalAccessStatus === 'paused'
      ? 'Vendor portal access paused.'
      : 'Vendor portal access reactivated.',
  });
};

// ── List All Corporate Registrations ───────────────────────────────────────
exports.getCorporateRegistrations = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase.from('corporate_registrations').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);

  const { data: docs, count: total } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  res.json({ success: true, data: docs || [], pagination: { total: total || 0, page: Number(page), limit: Number(limit) } });
};

// ── List All CleanTech Registrations ───────────────────────────────────────
exports.getCleantechRegistrations = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase.from('cleantech_registrations').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);

  const { data: docs, count: total } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  res.json({ success: true, data: docs || [], pagination: { total: total || 0, page: Number(page), limit: Number(limit) } });
};

// ── List All Climate Finance Registrations ─────────────────────────────────
exports.getClimateFinanceRegistrations = async (req, res) => {
  const { status, engagementType, page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  let query = supabase.from('climate_finance_registrations').select('*', { count: 'exact' });
  if (status) query = query.eq('status', status);
  if (engagementType) query = query.eq('engagement_type', engagementType);

  const { data: docs, count: total } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + Number(limit) - 1);

  res.json({ success: true, data: docs || [], pagination: { total: total || 0, page: Number(page), limit: Number(limit) } });
};
