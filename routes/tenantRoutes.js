const express = require('express');
const router = express.Router();
const { getTenants, getTenantById, createTenant, updateTenant, deleteTenant } = require('../controllers/tenantController');

// Get all tenants
router.get('/', getTenants);

// Get a single tenant by ID
router.get('/:tenantId', getTenantById);

// Create a new tenant
router.post('/', createTenant);

// Update an existing tenant
router.put('/:tenantId', updateTenant);

// Delete a tenant
router.delete('/:tenantId', deleteTenant);

module.exports = router;
