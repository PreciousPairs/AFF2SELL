const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Optional: Integrate with external logging systems like ELK Stack in post-save hooks
auditLogSchema.post('save', async function(doc) {
  // Example: Forward log to external system
  // externalLoggingSystem.log(doc);
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
