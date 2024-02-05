const express = require('express');
const router = express.Router();
const { checkAdminAuth } = require('../middleware/authMiddleware');
const {
  generateSalesReport,
  generateUserActivityReport,
  getSystemHealthStatus,
  updateSystemSettings
} = require('../services/analyticsService');
const SystemSettings = require('../models/SystemSettings');

// Apply admin authentication middleware to all admin routes
router.use(checkAdminAuth);

// Sales Report Endpoint
router.get('/sales-report', async (req, res) => {
  try {
    const report = await generateSalesReport();
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate sales report", error: error.message });
  }
});

// User Activity Report Endpoint
router.get('/user-activity', async (req, res) => {
  try {
    const report = await generateUserActivityReport();
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to generate user activity report", error: error.message });
  }
});

// System Health Check Endpoint
router.get('/system-health', async (req, res) => {
  try {
    const healthStatus = await getSystemHealthStatus();
    res.json({ success: true, healthStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve system health status", error: error.message });
  }
});

// System Settings Management
router.get('/system-settings', async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(404).json({ success: false, message: "System settings not found" });
  }
});

router.put('/system-settings', async (req, res) => {
  try {
    const updatedSettings = await updateSystemSettings(req.body);
    res.json({ success: true, message: "System settings updated successfully", updatedSettings });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update system settings", error: error.message });
  }
});

// Real-time Updates Endpoint
router.ws('/real-time-updates', (ws, req) => {
  ws.on('connection', () => {
    console.log('Admin connected for real-time updates');
    const sendRealTimeUpdates = () => {
      const updates = fetchRealTimeUpdates();
      ws.send(JSON.stringify(updates));
    };
    setInterval(sendRealTimeUpdates, 10000);
  });
});

module.exports = router;
