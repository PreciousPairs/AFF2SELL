// Filename: /routes/tenantRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { getTenants, getTenantById, createTenant, updateTenant, deleteTenant } = require('../controllers/tenantController');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply the rate limiting middleware to all requests
router.use(apiLimiter);

// Middleware for common validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', getTenants);

router.get('/:tenantId', getTenantById);

router.post(
  '/',
  [body('name').notEmpty().withMessage('Tenant name is required'), handleValidationErrors],
  createTenant
);

router.put(
  '/:tenantId',
  [body('name').optional(), handleValidationErrors],
  updateTenant
);

router.delete('/:tenantId', deleteTenant);

module.exports = router;
