const express = require('express');
const router = express.Router();
const climateFinanceController = require('../controllers/climateFinance.controller');

router.post('/register', climateFinanceController.submitRegistration);

module.exports = router;
