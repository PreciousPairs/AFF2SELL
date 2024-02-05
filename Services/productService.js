// productService.js
const Product = require('../models/Product');
const logger = require('../utils/logger'); // Assumed utility for logging
const EventEmitter = require('events');
const productEventEmitter = new EventEmitter();

exports.createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    productEventEmitter.emit('productCreated', product);
    logger.info(`Product created: ${product._id}`);
    return product;
  } catch (error) {
    logger.error('Product creation failed', error);
    throw new Error('Failed to create product');
  }
};

exports.updateProduct = async (id, updateData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) throw new Error('Product not found');
    productEventEmitter.emit('productUpdated', product);
    logger.info(`Product updated: ${product._id}`);
    return product;
  } catch (error) {
    logger.error('Product update failed', { id, error });
    throw error;
  }
};

exports.deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error('Product not found');
    productEventEmitter.emit('productDeleted', id);
    logger.info(`Product deleted: ${id}`);
    return { message: 'Product successfully deleted' };
  } catch (error) {
    logger.error('Product deletion failed', { id, error });
    throw error;
  }
};
