const express = require('express');
const router = express.Router();
const { createPricingStrategy, updatePricingStrategy, deletePricingStrategy, getPricingStrategyById, getAllPricingStrategies } = require('../services/pricingStrategyService');
const { createProduct, updateProduct, deleteProduct, getProductById, getAllProducts } = require('../services/productService');
const { validatePricingStrategyInput } = require('../middleware/validatePricingStrategyInput');
const { validateProductInput } = require('../middleware/validateProductInput');
const { authorize } = require('../middleware/authorize');

// Pricing Strategy Routes

// Create a new pricing strategy
router.post('/pricing-strategies', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
  try {
    const strategy = await createPricingStrategy(req.body);
    res.status(201).json(strategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a pricing strategy by ID
router.put('/pricing-strategies/:id', authorize(['admin']), validatePricingStrategyInput, async (req, res) => {
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
router.delete('/pricing-strategies/:id', authorize(['admin']), async (req, res) => {
  try {
    const strategyId = req.params.id;
    await deletePricingStrategy(strategyId);
    res.json({ message: 'Pricing strategy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pricing strategy', error: error.message });
  }
});

// Get a pricing strategy by ID
router.get('/pricing-strategies/:id', async (req, res) => {
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
router.get('/pricing-strategies', async (req, res) => {
  try {
    const strategies = await getAllPricingStrategies();
    res.json(strategies);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving pricing strategies', error: error.message });
  }
});

// Product Routes

// Create a new product
router.post('/products', authorize(['admin']), async (req, res) => {
  try {
    const validationResult = validateProductInput(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing product
router.put('/products/:id', authorize(['admin']), async (req, res) => {
  try {
    const validationResult = validateProductInput(req.body);
    if (validationResult.error) {
      return res.status(400).json({ message: validationResult.error.details[0].message });
    }

    const product = await updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by ID
router.delete('/products/:id', authorize(['admin']), async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving product', error: error.message });
  }
});

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving products', error: error.message });
  }
});

module.exports = router;
