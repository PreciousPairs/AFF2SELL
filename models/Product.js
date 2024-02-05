const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  basePrice: {
    type: Number,
    required: true,
  },
  currentPrice: Number,
  stockLevel: Number,
  category: String,
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

// Create a new product
Product.createProduct = async (productData) => {
  try {
    const newProduct = new Product(productData);
    await newProduct.save();
    return newProduct;
  } catch (error) {
    throw error;
  }
};

// Update a product by ID
Product.updateProduct = async (productId, updatedData) => {
  try {
    const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    return product;
  } catch (error) {
    throw error;
  }
};

// Retrieve a product by ID
Product.getProductById = async (productId) => {
  try {
    const product = await Product.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

// Retrieve all products
Product.getAllProducts = async () => {
  try {
    const products = await Product.find({});
    return products;
  } catch (error) {
    throw error;
  }
};

// Delete a product by ID
Product.deleteProductById = async (productId) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    return deletedProduct;
  } catch (error) {
    throw error;
  }
};

// Search products by category
Product.searchProductsByCategory = async (category) => {
  try {
    const products = await Product.find({ category });
    return products;
  } catch (error) {
    throw error;
  }
};

module.exports = Product;
