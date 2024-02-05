const express = require('express');
const router = express.Router();
const { createPricingStrategy, updatePricingStrategy, deletePricingStrategy } = require('../services/pricingStrategyService');
const { authorize } = require('../middleware/authorize');

router.post('/', authorize(['admin']), async (req, res) => {
  try {
    const strategy = await createPricingStrategy(req.body);
    res.status(201).json(strategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', authorize(['admin']), async (req, res) => {
  try {
    const strategy = await updatePricingStrategy(req.params.id, req.body);
    res.json(strategy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authorize(['admin']), async (req, res) => {
  try {
    await deletePricingStrategy(req.params.id);
    res.json({ message: 'Strategy deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
