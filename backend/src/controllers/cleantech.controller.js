const supabase = require('../config/db');

// ── Submit CleanTech Registration ─────────────────────────────────────────
exports.submitRegistration = async (req, res) => {
  const {
    companyName, website, solutionType, targetIndustries, geographicRegions,
    contactName, contactEmail, companyDescription,
    revenueStage, teamSize, fundingStatus, keyDifferentiators,
    clientsServed, partnershipGoals,
  } = req.body;

  const dataToSave = {
    company_name: companyName,
    website: website || null,
    solution_type: solutionType,
    target_industries: targetIndustries || [],
    geographic_regions: geographicRegions || [],
    contact_name: contactName,
    contact_email: contactEmail?.toLowerCase().trim(),
    company_description: companyDescription,
    revenue_stage: revenueStage,
    team_size: teamSize,
    funding_status: fundingStatus,
    key_differentiators: keyDifferentiators,
    clients_served: clientsServed,
    partnership_goals: partnershipGoals || [],
    status: 'pending',
    registration_step: 1,
  };

  const { data: registration, error } = await supabase
    .from('cleantech_registrations')
    .insert(dataToSave)
    .select()
    .single();

  if (error) {
    console.error('CleanTech registration error:', error);
    throw error;
  }

  res.status(201).json({
    success: true,
    data: registration,
    message: 'Thank you! Your clean tech registration has been received.',
  });
};

// ── Get Single CleanTech Registration ─────────────────────────────────────
exports.getRegistration = async (req, res, next) => {
  const { data: reg, error } = await supabase
    .from('cleantech_registrations')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !reg) {
    const AppError = require('../utils/AppError');
    return next(new AppError('Registration not found.', 404));
  }

  res.json({ success: true, data: reg });
};
