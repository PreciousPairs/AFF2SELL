const Tenant = require('../models/Tenant');
const logger = require('../utils/logger');
const Joi = require('joi'); // Adding Joi for schema validation

/**
 * Updates tenant settings.
 * @param {string} tenantId - The ID of the tenant.
 * @param {object} settings - The updated settings for the tenant.
 * @returns {Promise<object>} - The updated tenant object.
 * @throws {Error} - If validation fails, the tenant is not found, or an error occurs during the update.
 */
exports.updateTenantSettings = async (tenantId, settings) => {
  try {
    // Define a schema for tenant settings validation
    const tenantSettingsSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required().pattern(new RegExp(/^\d{10}$/)), // Validate a 10-digit phone number
      timeZone: Joi.string().valid('UTC', 'EST', 'PST'), // Validate against a list of valid time zones
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().pattern(new RegExp(/^\d{5}$/)), // Validate a 5-digit zip code
      }),
      subscription: Joi.object({
        plan: Joi.string().valid('basic', 'premium', 'enterprise'), // Validate subscription plan
        startDate: Joi.date().iso(), // Validate ISO date format
        endDate: Joi.date().iso().greater(Joi.ref('startDate')), // Validate end date is after start date
      }),
      // Additional properties and validation rules
      age: Joi.number().integer().min(18).max(120), // Validate age between 18 and 120
      isVerified: Joi.boolean().required(), // Validate a required boolean field
      preferences: Joi.array().items(Joi.string()), // Validate an array of string preferences
      // Add more properties and validation rules as needed
    });

    // Validate tenant settings against the schema
    const { error } = tenantSettingsSchema.validate(settings, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Tenant settings validation failed', { tenantId, errors: error.details });
      throw new Error('Validation failed for tenant settings');
    }

    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId });
      throw new Error('Tenant not found');
    }

    // Update tenant settings
    Object.assign(tenant, settings);
    await tenant.save();
    logger.info(`Tenant settings updated: ${tenantId}`, settings);
    return tenant;
  } catch (error) {
    logger.error('Tenant settings update failed', { tenantId, error: error.message });
    throw error;
  }
};

/**
 * Retrieves tenant settings by tenant ID.
 * @param {string} tenantId - The ID of the tenant.
 * @returns {Promise<object|null>} - The tenant settings or null if the tenant is not found.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getTenantSettings = async (tenantId) => {
  try {
    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId });
      return null; // Return null when tenant is not found
    }
    
    // Return the tenant settings
    return tenant.toObject();
  } catch (error) {
    logger.error('Failed to retrieve tenant settings', { tenantId, error: error.message });
    throw error;
  }
};
