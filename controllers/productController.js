const express = require('express');
const router = express.Router();
const { createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { validateProductInput } = require('../middleware/validators'); // Input validation middleware
const { authorize } = require('../middleware/authorize');

// Create a new product
router.post('/', authorize(['admin']), async (req, res) => {
  try {
    // Input validation using the 'validateProductInput' middleware
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
router.put('/:id', authorize(['admin']), async (req, res) => {
  try {
    // Input validation using the 'validateProductInput' middleware
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
router.delete('/:id', authorize(['admin']), async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
