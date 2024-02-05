const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed, // Flexible for any type of log detail
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
