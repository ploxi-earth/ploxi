const express = require('express');
const router = express.Router();
const portalController = require('../controllers/portal.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

// All portal routes require vendor authentication
router.use(protect, restrictTo('vendor'));

// Dashboard
router.get('/dashboard', portalController.getDashboardStats);

// Services
router.get('/services', portalController.getServices);
router.post('/services', portalController.createService);
router.patch('/services/:id', portalController.updateService);
router.delete('/services/:id', portalController.deleteService);

// Projects
router.get('/projects', portalController.getProjects);
router.post('/projects', portalController.createProject);
router.patch('/projects/:id', portalController.updateProject);
router.delete('/projects/:id', portalController.deleteProject);

// Meetings
router.get('/meetings', portalController.getMeetings);

// Documents
router.get('/documents', portalController.getDocuments);
router.post('/documents', portalController.createDocument);

// Notifications
router.get('/notifications', portalController.getNotifications);
router.patch('/notifications/:id/read', portalController.markNotificationRead);
router.patch('/notifications/read-all', portalController.markAllNotificationsRead);

// Settings
router.patch('/settings', portalController.updateSettings);

module.exports = router;
