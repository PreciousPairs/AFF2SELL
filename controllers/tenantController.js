const express = require('express');
const router = express.Router();
const { updateTenantSettings } = require('../services/tenantService');
const { authorize } = require('../middleware/authorize');
const { validateUpdateTenantSettingsInput } = require('../middleware/validators'); // Input validation middleware

// Route to update tenant settings
router.put('/:id/settings', authorize(['admin']), validateUpdateTenantSettingsInput, async (req, res) => {
  try {
    const tenantId = req.params.id;
    const updatedSettings = req.body;

    // Ensure that the user making the request is authorized to update tenant settings
    const user = req.user; // Assuming user information is available after authorization

    // Check if the user has admin privileges or is authorized to update this tenant
    if (!user.isAdmin && user.tenantId !== tenantId) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Update tenant settings using the service function
    const updatedTenant = await updateTenantSettings(tenantId, updatedSettings);

    res.status(200).json(updatedTenant);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
