const express = require('express');
const router = express.Router();
const { getAllSubscriptions, getSubscriptionById, createSubscription, updateSubscription, cancelSubscription } = require('../controllers/subscriptionController');

// Get all subscriptions
router.get('/', getAllSubscriptions);

// Get a single subscription by ID
router.get('/:subscriptionId', getSubscriptionById);

// Create a new subscription
router.post('/', createSubscription);

// Update an existing subscription
router.put('/:subscriptionId', updateSubscription);

// Cancel a subscription
router.delete('/:subscriptionId', cancelSubscription);

module.exports = router;
