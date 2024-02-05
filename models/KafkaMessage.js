const mongoose = require('mongoose');

const kafkaMessageSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  partition: Number,
  key: String,
  value: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'received', 'processed', 'error'], default: 'sent' },
});

module.exports = mongoose.model('KafkaMessage', kafkaMessageSchema);
