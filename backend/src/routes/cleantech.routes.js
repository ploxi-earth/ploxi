const express = require('express');
const router = express.Router();
const cleantechController = require('../controllers/cleantech.controller');

router.post('/register', cleantechController.submitRegistration);

module.exports = router;
