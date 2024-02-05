// Filename: /models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  currentPrice: Number,
  stockLevel: Number,
  category: String
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
