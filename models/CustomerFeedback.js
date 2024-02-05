const mongoose = require('mongoose');

const customerFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('CustomerFeedback', customerFeedbackSchema);
