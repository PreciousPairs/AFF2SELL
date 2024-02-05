const express = require('express');
const router = express.Router();
const { updateAdvancedSettings, getAdvancedSettings } = require('../services/tenantSettingsService');

router.get('/:tenantId/settings', async (req, res) => {
    try {
        const settings = await getAdvancedSettings(req.params.tenantId);
        res.json(settings);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/:tenantId/settings', async (req, res) => {
    try {
        const updatedSettings = await updateAdvancedSettings(req.params.tenantId, req.body);
        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
