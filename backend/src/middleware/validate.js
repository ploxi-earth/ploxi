const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

/**
 * Middleware to run after express-validator checks.
 * Returns 422 with all validation errors if any.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join('. ');
    return next(new AppError(message, 422));
  }
  next();
};

module.exports = validate;
