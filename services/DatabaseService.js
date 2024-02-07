// services/databaseService.js
const { Product } = require('../models/productModel');

exports.updateProductPriceInDatabase = async (productId, newPrice) => {
    await Product.updateOne({ productId }, { $set: { price: newPrice } });
};