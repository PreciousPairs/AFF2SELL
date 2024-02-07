// routes/analyticsRoutes.js
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