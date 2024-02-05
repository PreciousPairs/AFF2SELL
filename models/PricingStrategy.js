const mongoose = require('mongoose');

const pricingStrategySchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  name: { type: String, required: true },
  criteria: String, // JSON string or Schema.Types.Mixed for complex criteria
  actions: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports = mongoose.model('PricingStrategy', pricingStrategySchema);
