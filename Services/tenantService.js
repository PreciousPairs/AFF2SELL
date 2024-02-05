// tenantService.js
const Tenant = require('../models/Tenant');
const logger = require('../utils/logger');
const validateTenantSettings = require('../utils/validateTenantSettings'); // Assume this is a custom validation function

exports.updateTenantSettings = async (tenantId, settings) => {
  const validationErrors = validateTenantSettings(settings);
  if (validationErrors.length > 0) {
    logger.error('Tenant settings validation failed', { tenantId, errors: validationErrors });
    throw new Error('Validation failed for tenant settings');
  }

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) throw new Error('Tenant not found');
    Object.assign(tenant, settings);
    await tenant.save();
    logger.info(`Tenant settings updated: ${tenantId}`, settings);
    return tenant;
  } catch (error) {
    logger.error('Tenant settings update failed', { tenantId, error });
    throw error;
  }
};
