const express = require('express');
const router = express.Router();
const { subscribeToPlan, unsubscribe } = require('../services/subscriptionService');
const { authorize } = require('../middleware/authorize');

// Endpoint to subscribe to a plan
router.post('/', authorize(['user']), async (req, res) => {
  try {
    const subscription = await subscribeToPlan(req.user.id, req.body.planId);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint to unsubscribe from a plan
router.post('/unsubscribe', authorize(['user']), async (req, res) => {
  try {
    const subscription = await unsubscribe(req.user.id);
    res.json({ message: 'Successfully unsubscribed', subscription });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint to get system settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await SystemSettings.find({});
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve system settings', error: error.message });
  }
});

// Endpoint to update system settings
router.put('/settings/:settingsId', async (req, res) => {
  try {
    const { settingsId } = req.params;
    const updates = req.body;

    // Input validation using the 'validateUpdateSystemSettingsInput' middleware
    const validationResult = validateUpdateSystemSettingsInput(req.body);
    if (validationResult.error) {
      return res.status(400).json({ success: false, message: 'Validation error', error: validationResult.error.details[0].message });
    }

    // Perform the update and return the updated settings
    const updatedSettings = await SystemSettings.findByIdAndUpdate(settingsId, updates, { new: true });

    if (!updatedSettings) {
      return res.status(404).json({ success: false, message: 'System settings not found' });
    }

    res.status(200).json({ success: true, message: 'System settings updated successfully', updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update system settings', error: error.message });
  }
});

module.exports = router;