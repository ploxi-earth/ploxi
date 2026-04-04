const supabase = require('../config/db');
const AppError = require('../utils/AppError');

// ── Create / Save Report Draft ────────────────────────────────────────────
exports.createReport = async (req, res) => {
  const {
    clientName, reportingPeriod, reportingYear,
    energyData, waterData, wasteData, emissionsData, socialData, governanceData,
    reportFileUrl,
  } = req.body;

  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .insert({
      consultant_id: req.user._id,
      client_name: clientName,
      reporting_period: reportingPeriod,
      reporting_year: reportingYear,
      energy_data: energyData || null,
      water_data: waterData || null,
      waste_data: wasteData || null,
      emissions_data: emissionsData || null,
      social_data: socialData || null,
      governance_data: governanceData || null,
      report_file_url: reportFileUrl || null,
      status: 'draft',
    })
    .select()
    .single();

  if (error) throw error;
  res.status(201).json({ success: true, data: report });
};

// ── List My Reports ────────────────────────────────────────────────────────
exports.getMyReports = async (req, res) => {
  const { data: reports, error } = await supabase
    .from('sustainability_reports')
    .select('*')
    .eq('consultant_id', req.user._id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  res.json({ success: true, data: reports || [] });
};

// ── Get Single Report ──────────────────────────────────────────────────────
exports.getReport = async (req, res, next) => {
  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error || !report) return next(new AppError('Report not found.', 404));

  // Fetch consultant info
  const { data: consultant } = await supabase
    .from('users')
    .select('id, name, email')
    .eq('id', report.consultant_id)
    .single();

  res.json({ success: true, data: { ...report, consultant: consultant || null } });
};

// ── Update Report ──────────────────────────────────────────────────────────
exports.updateReport = async (req, res, next) => {
  const {
    clientName, reportingPeriod, reportingYear,
    energyData, waterData, wasteData, emissionsData, socialData, governanceData,
    reportFileUrl,
  } = req.body;

  const updates = {};
  if (clientName !== undefined) updates.client_name = clientName;
  if (reportingPeriod !== undefined) updates.reporting_period = reportingPeriod;
  if (reportingYear !== undefined) updates.reporting_year = reportingYear;
  if (energyData !== undefined) updates.energy_data = energyData;
  if (waterData !== undefined) updates.water_data = waterData;
  if (wasteData !== undefined) updates.waste_data = wasteData;
  if (emissionsData !== undefined) updates.emissions_data = emissionsData;
  if (socialData !== undefined) updates.social_data = socialData;
  if (governanceData !== undefined) updates.governance_data = governanceData;
  if (reportFileUrl !== undefined) updates.report_file_url = reportFileUrl;
  updates.updated_at = new Date().toISOString();

  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .update(updates)
    .eq('id', req.params.id)
    .eq('consultant_id', req.user._id)
    .select()
    .single();

  if (error || !report) return next(new AppError('Report not found or access denied.', 404));
  res.json({ success: true, data: report });
};

// ── Submit Report for Review ───────────────────────────────────────────────
exports.submitReport = async (req, res, next) => {
  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .update({ status: 'submitted', updated_at: new Date().toISOString() })
    .eq('id', req.params.id)
    .eq('consultant_id', req.user._id)
    .select()
    .single();

  if (error || !report) return next(new AppError('Report not found or access denied.', 404));
  res.json({ success: true, data: report, message: 'Report submitted for review.' });
};

// ── Manager: List All Reports ──────────────────────────────────────────────
exports.getAllReports = async (req, res) => {
  const { status } = req.query;

  let query = supabase.from('sustainability_reports').select('*');
  if (status) query = query.eq('status', status);

  const { data: reports, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;

  // Fetch consultant info for each report
  const consultantIds = [...new Set((reports || []).map(r => r.consultant_id))];
  let consultants = {};

  if (consultantIds.length > 0) {
    const { data: consultantData } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', consultantIds);

    (consultantData || []).forEach(c => { consultants[c.id] = c; });
  }

  const enrichedReports = (reports || []).map(r => ({
    ...r,
    consultant: consultants[r.consultant_id] || null,
  }));

  res.json({ success: true, data: enrichedReports });
};

// ── Manager: Approve & Publish Report ─────────────────────────────────────
exports.approveReport = async (req, res, next) => {
  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .update({
      status: 'approved',
      approved_by: req.user._id,
      approved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !report) return next(new AppError('Report not found.', 404));
  res.json({ success: true, data: report });
};

exports.publishReport = async (req, res, next) => {
  const { data: report, error } = await supabase
    .from('sustainability_reports')
    .update({
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error || !report) return next(new AppError('Report not found.', 404));
  res.json({ success: true, data: report });
};
