const express = require('express');
const { checkAdminAuth } = require('../middleware/authMiddleware'); // Custom middleware to verify admin status
const { generateSalesReport, generateUserActivityReport, getSystemHealthStatus, updateSystemSettings } = require('../services/analyticsService');
const SystemSettings = require('../models/SystemSettings'); // Assuming a model for system settings

const router = express.Router();

router.use(checkAdminAuth); // Apply admin authentication middleware to all admin routes


// Real-time Dashboard Endpoints
router.get('/sales-report', async (req, res) => {
  const report = await generateSalesReport();
  res.json(report);
});

router.get('/user-activity', async (req, res) => {
  const report = await generateUserActivityReport();
  res.json(report);
});

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
    const healthStatus = await getSystemHealthStatus(); // This would check database connections, external service connectivity, etc.
    res.json({ success: true, healthStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to retrieve system health status", error: error.message });
  }
});
// Get System Settings
router.get('/system-settings', async (req, res) => {
  const settings = await SystemSettings.findOne({});
  if (!settings) {
    return res.status(404).json({ success: false, message: "System settings not found" });
  }
  res.json({ success: true, settings });
});

// Update System Settings
router.put('/system-settings', async (req, res) => {
  try {
    const updatedSettings = await updateSystemSettings(req.body); // Assumes a service function that validates and updates settings
    res.json({ success: true, message: "System settings updated successfully", updatedSettings });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update system settings", error: error.message });
  }
});
// Assuming setup for WebSocket in the application
const { initiateWebSocketConnection } = require('../utils/webSocketUtils');

router.ws('/real-time-updates', (ws, req) => {
  ws.on('connection', () => console.log('Admin connected for real-time updates'));
  
  const sendRealTimeUpdates = () => {
    const updates = fetchRealTimeUpdates(); // Fetch updates
    ws.send(JSON.stringify(updates)); // Send updates to connected admin clients
  };

  // Example: send updates every 10 seconds
  setInterval(sendRealTimeUpdates, 10000);
});

