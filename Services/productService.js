const Product = require('../models/Product');
const logger = require('../utils/logger');
const EventEmitter = require('events');
const productEventEmitter = new EventEmitter();
const Joi = require('joi');

// Consolidated Joi Schema for Product
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  price: Joi.number().min(0).required(),
  weight: Joi.number().min(0),
  category: Joi.string().valid('Electronics', 'Clothing', 'Books', 'Home & Garden'),
  manufacturer: Joi.string(),
  releaseDate: Joi.date().iso(),
  isAvailable: Joi.boolean(),
  ratings: Joi.object({
    averageRating: Joi.number().min(0).max(5),
    numberOfRatings: Joi.number().min(0),
  }),
  dimensions: Joi.object({
    length: Joi.number().min(0),
    width: Joi.number().min(0),
    height: Joi.number().min(0),
  }),
  sku: Joi.string().required(), // Ensure SKU uniqueness
}).required();

// Create Product with Enhanced Validation and Event Emission
exports.createProduct = async (productData) => {
  const { error, value } = productSchema.validate(productData);
  if (error) {
    logger.error('Product validation failed', error);
    throw new Error('Validation failed for product data');
  }

  const existingSKU = await Product.findOne({ sku: value.sku });
  if (existingSKU) {
    throw new Error('SKU must be unique');
  }

  const product = new Product(value);
  await product.save();
  productEventEmitter.emit('productCreated', product);
  logger.info(`Product created: ${product._id}`);
  return product;
};

// Update Product with Schema Validation
exports.updateProduct = async (id, updateData) => {
  const { error } = productSchema.validate(updateData);
  if (error) {
    logger.error('Update validation failed', error);
    throw new Error('Validation failed for update data');
  }

  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) {
    throw new Error('Product not found');
  }
  productEventEmitter.emit('productUpdated', product);
  logger.info(`Product updated: ${product._id}`);
  return product;
};

// Delete Product
exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  productEventEmitter.emit('productDeleted', id);
  logger.info(`Product deleted: ${id}`);
};

// Retrieve Product by ID
exports.getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

// Retrieve All Products with Optional Filters
exports.getAllProducts = async (filter = {}) => {
  const products = await Product.find(filter);
  return products;
};

// Subscribe and Unsubscribe to Product Events
exports.subscribeToProductEvents = (eventName, callback) => {
  productEventEmitter.on(eventName, callback);
};

exports.unsubscribeFromProductEvents = (eventName, callback) => {
  productEventEmitter.off(eventName, callback);
};

// SKU-based Product Retrieval
exports.getProductBySKU = async (sku) => {
  const product = await Product.findOne({ sku });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

// Update Product Stock
exports.updateProductStock = async (id, newStockQuantity) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  product.stock = newStockQuantity;
  await product.save();
  productEventEmitter.emit('productStockUpdated', product);
  logger.info(`Stock updated: ${product._id}`);
};

// Product Price History Management
exports.getProductPriceHistory = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return product.priceHistory || [];
};

exports.addPriceToProductHistory = async (id, price) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  product.priceHistory = product.priceHistory || [];
  product.priceHistory.push({ price, date: new Date() });
  await product.save();
  logger.info(`Price history updated: ${product._id}`);
};
exports.createProduct = async (productData) => {
  try {
    const existingProduct = await Product.findOne({ item_id: productData.item_id });
    if (existingProduct) {
      throw new Error('A product with this item_id already exists.');
    }

    const product = new Product(productData);
    await product.save();
    logger.info(`Product created successfully with item_id: ${product.item_id}`);
    return product;
  } catch (error) {
    logger.error('Failed to create product', { error });
    throw error;
  }
};
exports.updateProductByItemId = async (item_id, updateData) => {
  try {
    const product = await Product.findOneAndUpdate({ item_id }, updateData, { new: true });
    if (!product) {
      throw new Error('Product not found with the provided item_id.');
    }

    logger.info(`Product with item_id: ${item_id} updated successfully.`);
    return product;
  } catch (error) {
    logger.error('Failed to update product', { item_id, error });
    throw error;
  }
};
exports.deleteProductByItemId = async (item_id) => {
  try {
    const product = await Product.findOneAndDelete({ item_id });
    if (!product) {
      throw new Error('Product not found with the provided item_id.');
    }

    logger.info(`Product with item_id: ${item_id} deleted successfully.`);
    return { message: 'Product deleted successfully.' };
  } catch (error) {
    logger.error('Failed to delete product', { item_id, error });
    throw error;
  }
};
exports.getProductByItemId = async (item_id) => {
  try {
    const product = await Product.findOne({ item_id });
    if (!product) {
      throw new Error('Product not found with the provided item_id.');
    }

    return product;
  } catch (error) {
    logger.error('Failed to retrieve product', { item_id, error });
    throw error;
  }
};
exports.searchProducts = async (searchQuery) => {
  try {
    const products = await Product.find({
      $or: [
        { item_id: searchQuery },
        { name: { $regex: searchQuery, $options: 'i' } },
        // Add other fields as necessary for the search
      ],
    });

    return products;
  } catch (error) {
    logger.error('Failed to search products', { searchQuery, error });
    throw error;
  }
};

// Enhanced Product Search Functionality
exports.searchProducts = async (query) => {
  const products = await Product.find({ $text: { $search: query } });
  return products;
};
