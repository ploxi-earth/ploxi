const express = require('express');
const router = express.Router();
const corporateController = require('../controllers/corporate.controller');

// Public route – no auth required
router.post('/register', corporateController.submitRegistration);

module.exports = router;
