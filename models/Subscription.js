// Filename: /models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  endDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);
