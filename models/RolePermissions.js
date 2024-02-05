const mongoose = require('mongoose');

const rolePermissionsSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['admin', 'user', 'editor'] },
  permissions: [{ action: String, resource: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RolePermissions', rolePermissionsSchema);
