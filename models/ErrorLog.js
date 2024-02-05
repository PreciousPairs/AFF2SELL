const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
  errorType: { type: String, required: true },
  errorMessage: { type: String, required: true },
  stackTrace: String, // Optional, based on error logging detail requirements
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
