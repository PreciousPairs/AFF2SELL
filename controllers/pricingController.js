const Pricing = require('../models/pricingModel'); // Mongoose model
const PricingStrategy = require('../models/PricingStrategy');
const express = require('express');
const router = express.Router();
const { authorize } = require('../middleware/authorize');
const { validatePricingStrategyInput } = require('../middleware/validatePricingStrategyInput');

// Update pricing information for an item
router.put('/updatePricing', authorize(['admin']), async (req, res) => {
  try {
    const { itemId, newPrice } = req.body;

    // Ensure that the item exists before updating the price
    const existingItem = await Pricing.findOne({ itemId });
    if (!existingItem) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Pricing.updateOne({ itemId }, { $set: { price: newPrice } });
    res.json({ message: 'Price updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating price', error: error.message });
  }
});

// Get active pricing strategies
router.get('/pricingStrategies', async (req, res) => {
  try {
    const strategies = await PricingStrategy.find({ isActive: true });
    res.json(
      strategies.map((strategy) => ({
        id: strategy._id,
        name: strategy.name,
        criteria: strategy.criteria,
        actions: strategy.actions,
        isActive: strategy.isActive,
      }))
    );
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch pricing strategies' });
  }
});

// Get all pricing data
router.get('/pricingData', async (req, res) => {
  try {
    const pricing = await Pricing.find({});
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricing data', error: error.message });
  }
});

// Create a new pricing strategy
router.post('/pricingStrategies', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    const strategy = await PricingStrategy.create(req.body);
    res.status(201).json(strategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pricing strategy by ID
router.put('/pricingStrategies/:id', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedStrategy = await PricingStrategy.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedStrategy) {
      return res.status(404).json({ message: 'Pricing strategy not found' });
    }

    res.json(updatedStrategy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating pricing strategy', error: error.message });
  }
});

// Delete a pricing strategy by ID
router.delete('/pricingStrategies/:id', authorize(['admin']), async (req, res) => {
  try {
    const { id } = req.params;
    await PricingStrategy.findByIdAndDelete(id);
    res.json({ message: 'Pricing strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricing strategy', error: error.message });
  }
});

// Define your imports and constants here

// Update pricing information for an item
router.put('/updatePricing', authorize(['admin']), async (req, res) => {
  try {
    // Your existing code for updating pricing here
    
  } catch (error) {
    res.status(500).json({ message: 'Error updating price', error: error.message });
  }
});

// Get active pricing strategies
router.get('/pricingStrategies', async (req, res) => {
  try {
    // Your existing code for fetching active pricing strategies here

  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch pricing strategies' });
  }
});

// Get all pricing data
router.get('/pricingData', async (req, res) => {
  try {
    // Your existing code for fetching all pricing data here

  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricing data', error: error.message });
  }
});

// Create a new pricing strategy
router.post('/pricingStrategies', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    // Your existing code for creating a new pricing strategy here
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pricing strategy by ID
router.put('/pricingStrategies/:id', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    // Your existing code for updating a pricing strategy by ID here
    
  } catch (error) {
    res.status(500).json({ message: 'Error updating pricing strategy', error: error.message });
  }
});

// Delete a pricing strategy by ID
router.delete('/pricingStrategies/:id', authorize(['admin']), async (req, res) => {
  try {
    // Your existing code for deleting a pricing strategy by ID here
    
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricing strategy', error: error.message });
  }
});

module.exports = router;

// Update pricing for an item
exports.updatePricing = async (req, res) => {
  try {
    const { itemId, newPrice } = req.body;
    await Pricing.updateOne({ itemId }, { $set: { price: newPrice } });
    res.json({ message: 'Price updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating price', error: error.message });
  }
};

// Get active pricing strategies
exports.getPricingStrategies = async (req, res) => {
  try {
    const strategies = await PricingStrategy.find({ isActive: true });
    res.json(
      strategies.map((strategy) => ({
        id: strategy._id,
        name: strategy.name,
        criteria: strategy.criteria,
        actions: strategy.actions,
        isActive: strategy.isActive,
      }))
    );
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch pricing strategies' });
  }
};

// Get all pricing data
exports.getPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find({});
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pricing data', error: error.message });
  }
};
