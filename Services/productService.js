const Product = require('../models/Product');
const logger = require('../utils/logger'); // Assumed utility for logging
const EventEmitter = require('events');
const productEventEmitter = new EventEmitter();
const Joi = require('joi'); // Adding Joi for schema validation

exports.createProduct = async (productData) => {
  try {
    // Validate productData using Joi schema
    const productSchema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string(),
      price: Joi.number().min(0).required(),
     const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  price: Joi.number().min(0).required(),
  weight: Joi.number().min(0),
  category: Joi.string().valid('Electronics', 'Clothing', 'Books'),
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
  // You can continue to add more properties and validation rules here
});

    });
    
    const { error } = productSchema.validate(productData, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Product validation failed', { errors: error.details });
      throw new Error('Validation failed for product data');
    }

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
    // Validate updateData using Joi schema
    const productSchema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      price: Joi.number().min(0),
      // Add more properties and validation rules as needed
    });
    
    const { error } = productSchema.validate(updateData, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Product validation failed', { errors: error.details });
      throw new Error('Validation failed for product update data');
    }

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

exports.getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    logger.error('Product retrieval failed', { id, error });
    throw error;
  }
};

exports.getAllProducts = async (filter = {}) => {
  try {
    // Implement pagination and filtering based on filter object
    const products = await Product.find(filter);
    return products;
  } catch (error) {
    logger.error('Product retrieval failed', error);
    throw error;
  }
};

exports.subscribeToProductEvents = (eventName, callback) => {
  // Subscribe to product-related events using EventEmitter
  productEventEmitter.on(eventName, callback);
};

exports.unsubscribeFromProductEvents = (eventName, callback) => {
  // Unsubscribe from product-related events using EventEmitter
  productEventEmitter.off(eventName, callback);
};

exports.getProductBySKU = async (sku) => {
  try {
    const product = await Product.findOne({ sku });
    if (!product) throw new Error('Product not found');
    return product;
  } catch (error) {
    logger.error('Product retrieval by SKU failed', { sku, error });
    throw error;
  }
};

exports.updateProductStock = async (id, newStockQuantity) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    // Update stock quantity
    product.stock = newStockQuantity;

    await product.save();
    productEventEmitter.emit('productStockUpdated', product);
    logger.info(`Product stock updated: ${product._id} - New Stock: ${newStockQuantity}`);
    return product;
  } catch (error) {
    logger.error('Product stock update failed', { id, error });
    throw error;
  }
};

exports.getProductPriceHistory = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw new Error('Product not found');

    // Fetch and return price history
    const priceHistory = product.priceHistory || [];
    return priceHistory;
  } catch (error) {
    logger.error('Product price history retrieval failed', { id, error });
    throw error;
  }
};

exports.addPriceToProductHistory = async (id, price) => {
  try {
    const product = await Product.findById(id);
    if (!product) throw an Error('Product not found');

    // Add the new price to the price history array
    if (!product.priceHistory) {
      product.priceHistory = [];
    }
    product.priceHistory.push({ price, date: new Date() });

    await product.save();
    logger.info(`Price added to product history: ${product._id} - New Price: ${price}`);
  } catch (error) {
    logger.error('Adding price to product history failed', { id, price, error });
    throw error;
  }
};

exports.getAllProducts = async () => {
  try {
    const products = await Product.find({});
    return products;
  } catch (error) {
    logger.error('Fetching all products failed', error);
    throw error;
  }
};

exports.searchProducts = async (query) => {
  try {
    const products = await Product.find({ $text: { $search: query } });
    return products;
  } catch (error) {
    logger.error('Product search failed', { query, error });
    throw error;
  }
};
