const mongoose = require('mongoose');

const rolePermissionsSchema = new mongoose.Schema({
  role: { type: String, required: true, enum: ['admin', 'user', 'editor'] },
  permissions: [{ action: String, resource: String }],
  createdAt: { type: Date, default: Date.now },
});

const RolePermissions = mongoose.model('RolePermissions', rolePermissionsSchema);

// Create new role permissions
RolePermissions.createRolePermissions = async (rolePermissionsData) => {
  try {
    const newRolePermissions = new RolePermissions(rolePermissionsData);
    await newRolePermissions.save();
    return newRolePermissions;
  } catch (error) {
    throw error;
  }
};

// Update role permissions by ID
RolePermissions.updateRolePermissions = async (rolePermissionsId, updatedData) => {
  try {
    const rolePermissions = await RolePermissions.findByIdAndUpdate(rolePermissionsId, updatedData, { new: true });
    return rolePermissions;
  } catch (error) {
    throw error;
  }
};

// Retrieve role permissions by ID
RolePermissions.getRolePermissionsById = async (rolePermissionsId) => {
  try {
    const rolePermissions = await RolePermissions.findById(rolePermissionsId);
    return rolePermissions;
  } catch (error) {
    throw error;
  }
};

// Retrieve all role permissions entries
RolePermissions.getAllRolePermissions = async () => {
  try {
    const rolePermissionsEntries = await RolePermissions.find({});
    return rolePermissionsEntries;
  } catch (error) {
    throw error;
  }
};

// Delete role permissions by ID
RolePermissions.deleteRolePermissionsById = async (rolePermissionsId) => {
  try {
    const deletedRolePermissions = await RolePermissions.findByIdAndDelete(rolePermissionsId);
    return deletedRolePermissions;
  } catch (error) {
    throw error;
  }
};

module.exports = RolePermissions;
