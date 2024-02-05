const Tenant = require('../models/Tenant');

exports.updateTenantSettings = async (tenantId, settings) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) {
    throw new Error('Tenant not found');
  }
  Object.assign(tenant, settings);
  await tenant.save();
  return tenant;
};
