const supabase = require('../config/db');

// ── Submit Climate Finance Registration ───────────────────────────────────
exports.submitRegistration = async (req, res) => {
  const {
    engagementType,
    // Common
    fullName, email, phone, organization, website,
    // Raise Funding
    projectName, projectDescription, fundingRequired, projectStage, sector,
    // Investor
    investmentFocus, ticketSize, geographicPreference,
    // Participate
    participationType, areaOfInterest, message,
  } = req.body;

  const dataToSave = {
    engagement_type: engagementType,
    full_name: fullName,
    email: email?.toLowerCase().trim(),
    phone,
    organization,
    website: website || null,
    // Raise Funding
    project_name: projectName,
    project_description: projectDescription,
    funding_required: fundingRequired,
    project_stage: projectStage,
    sector,
    // Investor
    investment_focus: investmentFocus || [],
    ticket_size: ticketSize,
    geographic_preference: geographicPreference || [],
    // Participate
    participation_type: participationType,
    area_of_interest: areaOfInterest,
    message,
    status: 'pending',
    registration_step: 1,
  };

  const { data: registration, error } = await supabase
    .from('climate_finance_registrations')
    .insert(dataToSave)
    .select()
    .single();

  if (error) {
    console.error('Climate Finance registration error:', error);
    throw error;
  }

  res.status(201).json({
    success: true,
    data: registration,
    message: 'Thank you! Your climate finance registration has been received.',
  });
};

// ── Get Single Climate Finance Registration ───────────────────────────────
exports.getRegistration = async (req, res, next) => {
  const { data: reg, error } = await supabase
    .from('climate_finance_registrations')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !reg) {
    const AppError = require('../utils/AppError');
    return next(new AppError('Registration not found.', 404));
  }

  res.json({ success: true, data: reg });
};
