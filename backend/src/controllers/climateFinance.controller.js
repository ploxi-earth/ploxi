const ClimateFinanceRegistration = require('../models/ClimateFinanceRegistration.model');

exports.submitRegistration = async (req, res) => {
  const registration = await ClimateFinanceRegistration.create(req.body);
  res.status(201).json({
    success: true,
    data: registration,
    message: 'Thank you! Your climate finance registration has been received.',
  });
};

exports.getRegistration = async (req, res, next) => {
  const reg = await ClimateFinanceRegistration.findById(req.params.id);
  if (!reg) {
    const AppError = require('../utils/AppError');
    return next(new AppError('Registration not found.', 404));
  }
  res.json({ success: true, data: reg });
};
