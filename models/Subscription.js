const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
}, { timestamps: true });
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
