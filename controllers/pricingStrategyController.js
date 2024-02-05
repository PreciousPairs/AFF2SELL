const express = require('express');
const router = express.Router();
const {
  createPricingStrategy,
  updatePricingStrategy,
  deletePricingStrategy,
  getPricingStrategyById,
  getAllPricingStrategies,
} = require('../services/pricingStrategyService');
const { authorize } = require('../middleware/authorize');
const { validatePricingStrategyInput } = require('../middleware/validatePricingStrategyInput');

// Create a new pricing strategy
router.post('/', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    const strategy = await createPricingStrategy(req.body);
    res.status(201).json(strategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pricing strategy by ID
router.put('/:id', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    const strategyId = req.params.id;
    const updates = req.body;
    const updatedStrategy = await updatePricingStrategy(strategyId, updates);
    res.json(updatedStrategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a pricing strategy by ID
router.delete('/:id', authorize(['admin']), async (req, res) => {
  try {
    const strategyId = req.params.id;
    await deletePricingStrategy(strategyId);
    res.json({ message: 'Pricing strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricing strategy', error: error.message });
  }
});

// Get a pricing strategy by ID
router.get('/:id', async (req, res) => {
  try {
    const strategyId = req.params.id;
    const strategy = await getPricingStrategyById(strategyId);
    if (!strategy) {
      return res.status(404).json({ message: 'Pricing strategy not found' });
    }
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pricing strategy', error: error.message });
  }
});

// Get all pricing strategies
router.get('/', async (req, res) => {
  try {
    const strategies = await getAllPricingStrategies();
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pricing strategies', error: error.message });
  }
});

module.exports = router;
