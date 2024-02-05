const SystemSettings = require('../models/SystemSettings');
const { validateUpdateSystemSettingsInput } = require('../middleware/validators'); // Input validation middleware

// Retrieve current system settings
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.find({});
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve system settings', error: error.message });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
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
};
