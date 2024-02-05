const express = require('express');
const router = express.Router();
const { generateSalesReport, generateUserActivityReport } = require('../services/analyticsService');

// Real-time Dashboard Endpoints
router.get('/sales-report', async (req, res) => {
  const report = await generateSalesReport();
  res.json(report);
});

router.get('/user-activity', async (req, res) => {
  const report = await generateUserActivityReport();
  res.json(report);
});

// Additional endpoints for real-time data, system settings, etc.
