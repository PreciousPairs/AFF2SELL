const mongoose = require('mongoose');
const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true },
  callbackUrl: { type: String, required: false },
  emailNotificationsEnabled: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
});

module.exports = mongoose.model('Tenant', tenantSchema);
