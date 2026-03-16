const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendor.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect, restrictTo('vendor'));

router.get('/profile', vendorController.getMyProfile);
router.put('/profile', vendorController.upsertProfile);
router.get('/onboarding-status', vendorController.getOnboardingStatus);

module.exports = router;
