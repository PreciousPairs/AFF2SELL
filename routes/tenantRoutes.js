// Filename: /routes/tenantRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { getTenants, getTenantById, createTenant, updateTenant, deleteTenant } = require('../controllers/tenantController');
const router = express.Router();

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
