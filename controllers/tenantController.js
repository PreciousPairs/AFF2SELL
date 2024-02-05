const express = require('express');
const router = express.Router();
const { updateTenantSettings } = require('../services/tenantService');
const { authorize } = require('../middleware/authorize');

router.put('/:id/settings', authorize(['admin']), async (req, res) => {
  try {
    const tenant = await updateTenantSettings(req.params.id, req.body);
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
