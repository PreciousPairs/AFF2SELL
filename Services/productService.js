const Product = require('../models/Product');

exports.createProduct = async (productData) => {
  const product = new Product(productData);
  await product.save();
  return product;
};

exports.updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!product) {
    throw new Error('Product not found');
  }
  return product;
};

exports.deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return { message: 'Product successfully deleted' };
};
