const express = require('express');
const router = express.Router();
const ghgController = require('../controllers/ghg.controller');
const { protect } = require('../middleware/auth.middleware');

// GHG calculator is public – but optionally attaches user if authenticated
router.post('/calculate', (req, res, next) => {
  // Optionally attach user from token if present
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return protect(req, res, () => ghgController.calculate(req, res, next));
  }
  ghgController.calculate(req, res, next);
});

router.get('/history', protect, ghgController.getHistory);

module.exports = router;
