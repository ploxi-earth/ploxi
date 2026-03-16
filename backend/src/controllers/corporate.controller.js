const CorporateRegistration = require('../models/CorporateRegistration.model');

// ── Submit Corporate Registration ─────────────────────────────────────────
exports.submitRegistration = async (req, res) => {
  const registration = await CorporateRegistration.create(req.body);
  res.status(201).json({
    success: true,
    data: registration,
    message: 'Thank you! Your registration has been received. Our team will contact you shortly.',
  });
};

// ── Get Single Corporate Registration ─────────────────────────────────────
exports.getRegistration = async (req, res, next) => {
  const reg = await CorporateRegistration.findById(req.params.id);
  if (!reg) {
    const AppError = require('../utils/AppError');
    return next(new AppError('Registration not found.', 404));
  }
  res.json({ success: true, data: reg });
};
