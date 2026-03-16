const express = require('express');
const router = express.Router();
const consultantController = require('../controllers/consultant.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// Consultant routes
router.use(protect);

router.post('/reports', restrictTo('consultant'), consultantController.createReport);
router.get('/reports/my', restrictTo('consultant'), consultantController.getMyReports);
router.get('/reports/:id', consultantController.getReport);
router.put('/reports/:id', restrictTo('consultant'), consultantController.updateReport);
router.patch('/reports/:id/submit', restrictTo('consultant'), consultantController.submitReport);

// Manager routes
router.get('/reports', restrictTo('manager', 'platform_admin'), consultantController.getAllReports);
router.patch('/reports/:id/approve', restrictTo('manager', 'platform_admin'), consultantController.approveReport);
router.patch('/reports/:id/publish', restrictTo('manager', 'platform_admin'), consultantController.publishReport);

module.exports = router;
