const supabase = require('../config/db');
const { splitFullName } = require('../utils/splitFullName');

// ── Submit Climate Finance Registration (per-track tables) ───────────────
exports.submitRegistration = async (req, res) => {
  const {
    engagementType,
    fullName, email, phone, organization, website,
    projectName, projectDescription, fundingRequired, projectStage, sector,
    investmentFocus, ticketSize, geographicPreference,
    participationType, areaOfInterest, message,
  } = req.body;

  const em = email?.toLowerCase().trim();
  if (!em || !engagementType) {
    return res.status(400).json({ success: false, message: 'Email and engagement type are required.' });
  }

  if (engagementType === 'raise_funding') {
    const companyName =
      String(organization || '').trim() ||
      String(projectName || '').trim() ||
      String(fullName || '').trim() ||
      null;

    const { data: registration, error } = await supabase
      .from('raise_funding_registrations')
      .insert({
        email: em,
        company_name: companyName,
        full_name: fullName || null,
        phone: phone || null,
        organization: organization || null,
        project_name: projectName || null,
        project_description: projectDescription || null,
        funding_required: fundingRequired || null,
        project_stage: projectStage || null,
        sector: sector || null,
        funding_stage: projectStage || null,
        funding_amount: fundingRequired || null,
        funding_purpose: projectDescription || null,
        email_verified: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
        user_type: 'raise_funding',
      })
      .select()
      .single();

    if (error) {
      console.error('Climate Finance raise_funding error:', error);
      throw error;
    }
    return res.status(201).json({
      success: true,
      data: registration,
      message: 'Thank you! Your climate finance registration has been received.',
    });
  }

  if (engagementType === 'investor') {
    const { first_name, last_name } = splitFullName(fullName);
    const { data: registration, error } = await supabase
      .from('investor_registrations')
      .insert({
        email: em,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: phone || null,
        organization_name: organization || null,
        website: website || null,
        sectors_of_interest: investmentFocus || [],
        geographic_focus: geographicPreference || [],
        typical_ticket_size: ticketSize || null,
        email_verified: true,
        status: 'completed',
        completed_at: new Date().toISOString(),
        user_type: 'investor',
      })
      .select()
      .single();

    if (error) {
      console.error('Climate Finance investor error:', error);
      throw error;
    }
    return res.status(201).json({
      success: true,
      data: registration,
      message: 'Thank you! Your climate finance registration has been received.',
    });
  }

  if (engagementType === 'participate') {
    const { first_name, last_name } = splitFullName(fullName);
    const pt = String(participationType || '').trim();
    const { data: registration, error } = await supabase
      .from('participant_registrations')
      .insert({
        email: em,
        first_name: first_name || '',
        last_name: last_name || '',
        organization: String(organization || '').trim() || '',
        intent_type: pt ? [pt] : [],
        email_verified: true,
        status: 'completed',
        user_type: 'participant',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Climate Finance participant error:', error);
      throw error;
    }
    return res.status(201).json({
      success: true,
      data: registration,
      message: 'Thank you! Your climate finance registration has been received.',
    });
  }

  return res.status(400).json({ success: false, message: 'Invalid engagement type.' });
};

// ── Get Single Climate Finance Registration (legacy table only) ───────────
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
