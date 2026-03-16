const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// All admin routes require authentication and platform_admin role
router.use(protect, restrictTo('platform_admin'));

router.get('/dashboard', adminController.getDashboardStats);
router.post('/create-admin', adminController.createAdmin);

// ── Vendor Management ─────────────────────────────────────────────────────
router.get('/vendors', adminController.getVendors);
router.get('/vendors/:id', adminController.getVendor);
router.post('/vendors', adminController.addVendor);
router.patch('/vendors/:id/approve', adminController.approveVendor);
router.patch('/vendors/:id/reject', adminController.rejectVendor);
router.patch('/vendors/:id/schedule-meeting', adminController.scheduleMeeting);
router.patch('/vendors/:id/send-agreement', upload.single('agreement'), adminController.sendAgreement);
router.patch('/vendors/:id/mark-signed', adminController.markAgreementSigned);
router.patch('/vendors/:id/complete-onboarding', adminController.completeOnboarding);

// ── Registrations ─────────────────────────────────────────────────────────
router.get('/registrations/corporate', adminController.getCorporateRegistrations);
router.get('/registrations/cleantech', adminController.getCleantechRegistrations);
router.get('/registrations/climate-finance', adminController.getClimateFinanceRegistrations);

module.exports = router;
