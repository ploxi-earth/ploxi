const supabase = require('../config/db');
const AppError = require('../utils/AppError');

// ── Get My Vendor Profile ─────────────────────────────────────────────────
exports.getMyProfile = async (req, res, next) => {
  const vendorId = req.user.vendorId || req.user._id;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error || !vendor) return next(new AppError('Vendor profile not found.', 404));

  // Get profile details
  const { data: profile } = await supabase
    .from('vendor_profiles')
    .select('*')
    .eq('vendor_id', vendorId)
    .single();

  res.json({
    success: true,
    data: { ...vendor, profile: profile || null },
  });
};

// ── Update Vendor Profile ─────────────────────────────────────────────────
exports.upsertProfile = async (req, res, next) => {
  const vendorId = req.user.vendorId || req.user._id;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('*')
    .eq('id', vendorId)
    .single();

  if (error || !vendor) return next(new AppError('Vendor profile not found.', 404));

  // Update vendor table fields
  const vendorFields = ['company_name', 'contact_person', 'phone'];
  const vendorUpdates = {};
  // Map camelCase to snake_case
  const fieldMap = {
    companyName: 'company_name',
    contactPerson: 'contact_person',
    phone: 'phone',
  };

  for (const [camel, snake] of Object.entries(fieldMap)) {
    if (req.body[camel] !== undefined) vendorUpdates[snake] = req.body[camel];
  }

  if (Object.keys(vendorUpdates).length > 0) {
    await supabase.from('vendors').update(vendorUpdates).eq('id', vendorId);
  }

  // Update/create vendor_profiles
  const profileFields = {
    services: req.body.servicesOffered,
    sector: req.body.sector,
    location: req.body.location,
    website: req.body.website,
  };

  // Remove undefined values
  Object.keys(profileFields).forEach(k => {
    if (profileFields[k] === undefined) delete profileFields[k];
  });

  if (Object.keys(profileFields).length > 0) {
    const { data: existingProfile } = await supabase
      .from('vendor_profiles')
      .select('id')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    if (existingProfile) {
      await supabase
        .from('vendor_profiles')
        .update({ ...profileFields, updated_at: new Date().toISOString() })
        .eq('vendor_id', vendorId);
    } else {
      await supabase
        .from('vendor_profiles')
        .insert({ vendor_id: vendorId, ...profileFields });
    }

    // Check if profile is meaningfully completed → advance onboarding
    const { data: fullProfile } = await supabase
      .from('vendor_profiles')
      .select('*')
      .eq('vendor_id', vendorId)
      .single();

    if (fullProfile && fullProfile.services && fullProfile.sector && fullProfile.location) {
      // Check current onboarding stage
      const { data: currentStage } = await supabase
        .from('onboarding_stages')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('stage_name', 'admin_review')
        .single();

      if (currentStage?.status === 'active' || currentStage?.status === 'completed') {
        await supabase
          .from('onboarding_stages')
          .update({ status: 'active' })
          .eq('vendor_id', vendorId)
          .eq('stage_name', 'company_details_submitted');

        await supabase
          .from('vendor_profiles')
          .update({ profile_completed: true })
          .eq('vendor_id', vendorId);
      }
    }
  }

  // Fetch updated data
  const { data: updatedVendor } = await supabase.from('vendors').select('*').eq('id', vendorId).single();
  const { data: updatedProfile } = await supabase.from('vendor_profiles').select('*').eq('vendor_id', vendorId).single();

  res.json({ success: true, data: { ...updatedVendor, profile: updatedProfile } });
};

// ── Get Onboarding Status ──────────────────────────────────────────────────
exports.getOnboardingStatus = async (req, res, next) => {
  const vendorId = req.user.vendorId || req.user._id;

  const { data: vendor, error } = await supabase
    .from('vendors')
    .select('id, status, created_at')
    .eq('id', vendorId)
    .single();

  if (error || !vendor) return next(new AppError('Vendor profile not found.', 404));

  const { data: stages } = await supabase
    .from('onboarding_stages')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: true });

  const { data: meetings } = await supabase
    .from('meetings')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: agreements } = await supabase
    .from('agreements')
    .select('*')
    .eq('vendor_id', vendorId)
    .order('sent_at', { ascending: false })
    .limit(1);

  const { data: profile } = await supabase
    .from('vendor_profiles')
    .select('profile_completed')
    .eq('vendor_id', vendorId)
    .single();

  // Determine current stage — handle fully-onboarded case
  const stageRecords = stages || [];
  const activeStage = stageRecords.find(s => s.status === 'active');
  const allCompleted = stageRecords.length > 0 && stageRecords.every(s => s.status === 'completed');

  // If vendor status is 'onboarded' OR all stages completed → stage is 'onboarded'
  const onboardingStage = (vendor.status === 'onboarded' || allCompleted)
    ? 'onboarded'
    : (activeStage?.stage_name || 'registration');

  // Build onboarding history for timeline
  const onboardingHistory = stageRecords
    .filter(s => s.completed_at || s.status === 'active')
    .map(s => ({
      stage: s.stage_name,
      updatedAt: s.completed_at || s.updated_at || s.created_at,
      note: s.notes || undefined,
    }));

  // Map meeting data
  const latestMeeting = meetings?.[0] || null;
  const latestAgreement = agreements?.[0] || null;

  // Determine agreement status
  let agreementStatus = 'not_sent';
  if (latestAgreement) {
    agreementStatus = latestAgreement.signed ? 'signed' : 'sent';
  }

  res.json({
    success: true,
    data: {
      status: vendor.status,
      onboardingStage,
      onboardingHistory,
      onboardingStages: stageRecords,
      meeting: latestMeeting || null,
      agreement: latestAgreement || null,
      // Flat camelCase fields the frontend expects
      meetingDate: latestMeeting?.scheduled_date || null,
      meetingTime: latestMeeting?.scheduled_time || null,
      meetingLink: latestMeeting?.meeting_link || null,
      agreementStatus,
      agreementSentAt: latestAgreement?.sent_at || null,
      agreementSignedAt: latestAgreement?.signed_at || null,
      profileCompletion: profile?.profile_completed ? 100 : 50,
    },
  });
};

