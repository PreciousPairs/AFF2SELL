const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authorize } = require('../middleware/authorize');

// Define routes for product operations
router.post('/', authorize(['admin']), productController.createProduct);
router.patch('/:productId', authorize(['admin']), productController.updateProduct);
router.delete('/:productId', authorize(['admin']), productController.deleteProduct);

module.exports = router;
