// subscriptionRoutes.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const { subscribeToPlan, unsubscribe } = require('../services/subscriptionService');
const { authorize } = require('../middleware/authorize');
const logger = require('../utils/logger');

const router = express.Router();

router.post(
  '/',
  authorize(['user']),
  body('planId').notEmpty().withMessage('Plan ID is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const subscription = await subscribeToPlan(req.user.id, req.body.planId);
      logger.info(`User subscribed: ${req.user.id} to plan ${req.body.planId}`);
      res.status(201).json(subscription);
    } catch (error) {
      logger.error('Subscription error', error);
      res.status(400).json({ message: error.message });
    }
  }
);

router.post('/unsubscribe', authorize(['user']), async (req, res) => {
  try {
    const subscription = await unsubscribe(req.user.id);
    logger.info(`User unsubscribed: ${req.user.id}`);
    res.json({ message: 'Successfully unsubscribed', subscription });
  } catch (error) {
    logger.error('Unsubscription error', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
