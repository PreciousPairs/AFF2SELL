const express = require('express');
const router = express.Router();
const { subscribeToPlan, unsubscribe } = require('../services/subscriptionService');
const { authorize } = require('../middleware/authorize');

router.post('/', authorize(['user']), async (req, res) => {
  try {
    const subscription = await subscribeToPlan(req.user.id, req.body.planId);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/unsubscribe', authorize(['user']), async (req, res) => {
  try {
    const subscription = await unsubscribe(req.user.id);
    res.json({ message: 'Successfully unsubscribed', subscription });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
