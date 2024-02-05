const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  features: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
