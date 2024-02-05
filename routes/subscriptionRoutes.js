// Filename: /routes/subscriptionRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { subscribeToPlan, unsubscribe } = require('../services/subscriptionService');
const { authorize } = require('../middleware/authorize');
const logger = require('../utils/logger');
const router = express.Router();

router.post(
  '/',
  authorize(['user']),
  [body('planId').notEmpty().withMessage('Plan ID is required'), body('startDate').optional().isISO8601().withMessage('Start date must be a valid date')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const subscription = await subscribeToPlan(req.user.id, req.body.planId, req.body.startDate);
      logger.info(`User ${req.user.id} subscribed to plan ${req.body.planId}`);
      res.status(201).json(subscription);
    } catch (error) {
      logger.error('Subscription error', error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.post('/unsubscribe', authorize(['user']), async (req, res) => {
  try {
    await unsubscribe(req.user.id);
    logger.info(`User ${req.user.id} unsubscribed`);
    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    logger.error('Unsubscription error', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
