const express = require('express');
const router = express.Router();
const { generateProductReport, generateActivityLogReport } = require('../services/analyticsService');
const { authorize } = require('../middleware/authorize');

router.get('/product-report', authorize(['admin']), async (req, res) => {
  try {
    const report = await generateProductReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/activity-log', authorize(['admin']), async (req, res) => {
  try {
    const logs = await generateActivityLogReport();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
