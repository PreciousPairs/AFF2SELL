const SystemSettings = require('../models/SystemSettings');

// Retrieve current system settings
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.find({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve system settings', error: error.message });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const { settingsId } = req.params;
    const updates = req.body;
    const updatedSettings = await SystemSettings.findByIdAndUpdate(settingsId, updates, { new: true });
    res.json({ success: true, message: 'System settings updated successfully', updatedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update system settings', error: error.message });
  }
};
