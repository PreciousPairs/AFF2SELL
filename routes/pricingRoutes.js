const express = require('express');
const router = express.Router();
const { getPricingStrategies, getPricingStrategyById, createPricingStrategy, updatePricingStrategy, deletePricingStrategy } = require('../controllers/pricingController');

// Retrieve all pricing strategies
router.get('/', getPricingStrategies);

// Retrieve a specific pricing strategy by ID
router.get('/:strategyId', getPricingStrategyById);

// Create a new pricing strategy
router.post('/', createPricingStrategy);

// Update an existing pricing strategy
router.put('/:strategyId', updatePricingStrategy);

// Delete a pricing strategy
router.delete('/:strategyId', deletePricingStrategy);

module.exports = router;
