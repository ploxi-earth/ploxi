const supabase = require('../config/db');

// ── Submit Corporate Registration ─────────────────────────────────────────
// Matches v1 field mapping for corporate_registrations table
exports.submitRegistration = async (req, res) => {
  const {
    fullName, designation, companyName, website, industrySector, customIndustry,
    email, phone, countryCode,
    // Step 2 fields
    currentEsgFrameworks, esgReportingStatus, primaryEsgGoals,
    complianceRegulations, annualRevenueBand, employeeCount, sustainabilityTeamSize,
    // Step 3 fields
    hearAboutUs, additionalNotes,
    // v1-compatible fields
    geography, esgFrameworks, sustainabilityStage, esgSaasIntegration,
  } = req.body;

  const dataToSave = {
    full_name: fullName,
    designation,
    company_name: companyName,
    website: website || null,
    industry_sector: industrySector === 'Other' ? customIndustry : industrySector,
    custom_industry: industrySector === 'Other' ? customIndustry : null,
    email: email?.toLowerCase().trim(),
    phone: countryCode ? `${countryCode}${phone}` : phone,
    current_esg_frameworks: currentEsgFrameworks || [],
    esg_reporting_status: esgReportingStatus,
    primary_esg_goals: primaryEsgGoals || [],
    compliance_regulations: complianceRegulations || [],
    annual_revenue_band: annualRevenueBand,
    employee_count: employeeCount,
    sustainability_team_size: sustainabilityTeamSize,
    hear_about_us: hearAboutUs,
    additional_notes: additionalNotes,
    // v1-compatible fields
    geography: geography || null,
    esg_frameworks: esgFrameworks || null,
    sustainability_stage: sustainabilityStage || null,
    esg_saas_integration: esgSaasIntegration || null,
    status: 'pending',
    registration_step: 1,
  };

  const { data: registration, error } = await supabase
    .from('corporate_registrations')
    .insert(dataToSave)
    .select()
    .single();

  if (error) {
    console.error('Corporate registration error:', error);
    throw error;
  }

  res.status(201).json({
    success: true,
    data: registration,
    message: 'Thank you! Your registration has been received. Our team will contact you shortly.',
  });
};

// ── Get Single Corporate Registration ─────────────────────────────────────
exports.getRegistration = async (req, res, next) => {
  const { data: reg, error } = await supabase
    .from('corporate_registrations')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !reg) {
    const AppError = require('../utils/AppError');
    return next(new AppError('Registration not found.', 404));
  }

  res.json({ success: true, data: reg });
};
