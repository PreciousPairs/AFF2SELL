const Dashboard = require('../models/Dashboard');

// Retrieve dashboard data
exports.getDashboardData = async (req, res) => {
  try {
    const dashboardData = await Dashboard.findOne({ userId: req.user.id });
    if (!dashboardData) {
      return res.status(404).json({ success: false, message: 'Dashboard data not found' });
    }
    res.status(200).json({ success: true, dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard data', error: error.message });
  }
};

// Update dashboard data
exports.updateDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Perform the update and return the updated dashboard data
    const updatedDashboardData = await Dashboard.findOneAndUpdate({ userId }, updates, { new: true });

    if (!updatedDashboardData) {
      return res.status(404).json({ success: false, message: 'Dashboard data not found' });
    }

    res.status(200).json({ success: true, message: 'Dashboard data updated successfully', updatedDashboardData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update dashboard data', error: error.message });
  }
};

// Delete dashboard data
exports.deleteDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Delete the dashboard data
    const deletedDashboardData = await Dashboard.findOneAndDelete({ userId });

    if (!deletedDashboardData) {
      return res.status(404).json({ success: false, message: 'Dashboard data not found' });
    }

    res.status(200).json({ success: true, message: 'Dashboard data deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete dashboard data', error: error.message });
  }
};// routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { generateProductReport, generateActivityLogReport } = require('../services/analyticsService');
const { authorize } = require('../middleware/authorize');
const { validate } = require('../middleware/validate');
const { errorHandler } = require('../middleware/errorHandler');
const { fetchRealTimeData } = require('../services/realTimeService');

// Middleware for error handling
router.use(errorHandler);

// Route for generating product report
router.get('/product-report', authorize(['admin']), async (req, res, next) => {
  try {
    const report = await generateProductReport();
    res.json(report);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Route for generating activity log report
router.get('/activity-log', authorize(['admin']), async (req, res, next) => {
  try {
    const logs = await generateActivityLogReport();
    res.json(logs);
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Route for real-time data streaming using WebSocket
router.ws('/real-time-data', (ws, req) => {
  ws.on('message', (msg) => {
    console.log(`Received message ${msg}`);
  });
  const sendData = () => {
    const data = fetchRealTimeData(); // Assuming fetchRealTimeData is a function to fetch real-time data
    ws.send(JSON.stringify(data));
  };
  setInterval(sendData, 1000); // Send data every second
});

module.exports = router;