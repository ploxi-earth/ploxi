const SustainabilityReport = require('../models/SustainabilityReport.model');
const AppError = require('../utils/AppError');

// ── Create / Save Report Draft ────────────────────────────────────────────
exports.createReport = async (req, res) => {
  const report = await SustainabilityReport.create({ ...req.body, consultant: req.user._id });
  res.status(201).json({ success: true, data: report });
};

// ── List My Reports ────────────────────────────────────────────────────────
exports.getMyReports = async (req, res) => {
  const reports = await SustainabilityReport.find({ consultant: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, data: reports });
};

// ── Get Single Report ──────────────────────────────────────────────────────
exports.getReport = async (req, res, next) => {
  const report = await SustainabilityReport.findById(req.params.id).populate('consultant', 'name email');
  if (!report) return next(new AppError('Report not found.', 404));
  res.json({ success: true, data: report });
};

// ── Update Report ──────────────────────────────────────────────────────────
exports.updateReport = async (req, res, next) => {
  const report = await SustainabilityReport.findOneAndUpdate(
    { _id: req.params.id, consultant: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!report) return next(new AppError('Report not found or access denied.', 404));
  res.json({ success: true, data: report });
};

// ── Submit Report for Review ───────────────────────────────────────────────
exports.submitReport = async (req, res, next) => {
  const report = await SustainabilityReport.findOneAndUpdate(
    { _id: req.params.id, consultant: req.user._id },
    { status: 'submitted' },
    { new: true }
  );
  if (!report) return next(new AppError('Report not found or access denied.', 404));
  res.json({ success: true, data: report, message: 'Report submitted for review.' });
};

// ── Manager: List All Reports ──────────────────────────────────────────────
exports.getAllReports = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const reports = await SustainabilityReport.find(filter)
    .populate('consultant', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reports });
};

// ── Manager: Approve & Publish Report ─────────────────────────────────────
exports.approveReport = async (req, res, next) => {
  const report = await SustainabilityReport.findByIdAndUpdate(
    req.params.id,
    {
      status: 'approved',
      approvedBy: req.user._id,
      approvedAt: Date.now(),
    },
    { new: true }
  );
  if (!report) return next(new AppError('Report not found.', 404));
  res.json({ success: true, data: report });
};

exports.publishReport = async (req, res, next) => {
  const report = await SustainabilityReport.findByIdAndUpdate(
    req.params.id,
    { status: 'published', publishedAt: Date.now() },
    { new: true }
  );
  if (!report) return next(new AppError('Report not found.', 404));
  res.json({ success: true, data: report });
};
