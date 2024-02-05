const Tenant = require('../models/Tenant');
const logger = require('../utils/logger');
const Joi = require('joi'); // Adding Joi for schema validation
const tenantEventEmitter = require('../events/tenantEventEmitter'); // Importing EventEmitter for tenant-related events

/**
 * Updates tenant settings.
 * @param {string} tenantId - The ID of the tenant.
 * @param {object} settings - The updated settings for the tenant.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} - The updated tenant object.
 * @throws {Error} - If validation fails, the tenant is not found, or an error occurs during the update.
 */
exports.updateTenantSettings = async (tenantId, settings, userId) => {
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
      age: Joi.number().integer().min(18).max(120), // Validate age between 18 and 120
      isVerified: Joi.boolean().required(), // Validate a required boolean field
      preferences: Joi.array().items(Joi.string()), // Validate an array of string preferences
      // Add more properties and validation rules as needed
    });

    // Validate tenant settings against the schema
    const { error } = tenantSettingsSchema.validate(settings, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Tenant settings validation failed', { tenantId, errors: error.details, userId });
      throw new Error('Validation failed for tenant settings');
    }

    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId, userId });
      throw new Error('Tenant not found');
    }

    // Implement role-based access control (e.g., check if the user has permission to update tenant settings)

    // Update tenant settings
    Object.assign(tenant, settings);
    await tenant.save();
    logger.info(`Tenant settings updated: ${tenantId} by User: ${userId}`, settings);
    return tenant;
  } catch (error) {
    logger.error('Tenant settings update failed', { tenantId, error: error.message, userId });
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

/**
 * Create a new tenant.
 * @param {object} tenantData - The data for creating a new tenant.
 * @param {string} userId - The ID of the user creating the tenant.
 * @returns {Promise<object>} - The created tenant object.
 * @throws {Error} - If validation fails or an error occurs during creation.
 */
exports.createTenant = async (tenantData, userId) => {
  try {
    // Define a schema for tenant creation validation
    const tenantCreateSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      // Add more properties and validation rules as needed
    });

    // Validate tenant data against the schema
    const { error } = tenantCreateSchema.validate(tenantData, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Tenant creation validation failed', { errors: error.details, userId });
      throw new Error('Validation failed for tenant creation');
    }

    // Implement role-based access control (e.g., check if the user has permission to create a tenant)

    // Create a new tenant
    const newTenant = new Tenant(tenantData);
    await newTenant.save();
    logger.info(`Tenant created by User: ${userId}`, newTenant);
    return newTenant;
  } catch (error) {
    logger.error('Tenant creation failed', { error: error.message, userId });
    throw error;
  }
};

/**
 * Delete a tenant by ID.
 * @param {string} tenantId - The ID of the tenant to delete.
 * @param {string} userId - The ID of the user performing the deletion.
 * @returns {Promise<{ message: string }>} - A success message.
 * @throws {Error} - If the tenant is not found or an error occurs during deletion.
 */
exports.deleteTenantById = async (tenantId, userId) => {
  try {
    // Implement role-based access control (e.g., check if the user has permission to delete a tenant)

    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId, userId });
      throw new Error('Tenant not found');
    }

    // Delete the tenant
    await tenant.delete();
    tenantEventEmitter.emit('tenantDeleted', tenantId);
    logger.info(`Tenant deleted by User: ${userId}`, { tenantId });
    return { message: 'Tenant successfully deleted' };
  } catch (error) {
    logger.error('Tenant deletion failed', { tenantId, error: error.message, userId });
    throw error;
  }
};

/**
 * List all tenants.
 * @returns {Promise<Array>} - An array of tenant objects.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.listTenants = async () => {
  try {
    // Implement role-based access control (e.g., check if the user has permission to list tenants)

    // Retrieve all tenants
    const tenants = await Tenant.find({});
    return tenants.map((tenant) => tenant.toObject());
  } catch (error) {
    logger.error('Fetching all tenants failed', { error: error.message });
    throw error;
  }
};

/**
 * Update a tenant by ID.
 * @param {string} tenantId - The ID of the tenant to update.
 * @param {object} updatedData - The data to update the tenant with.
 * @param {string} userId - The ID of the user performing the update.
 * @returns {Promise<object>} - The updated tenant object.
 * @throws {Error} - If validation fails, the tenant is not found, or an error occurs during the update.
 */
exports.updateTenantById = async (tenantId, updatedData, userId) => {
  try {
    // Define a schema for tenant update validation
    const tenantUpdateSchema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      // Add more properties and validation rules as needed
    });

    // Validate updated data against the schema
    const { error } = tenantUpdateSchema.validate(updatedData, { abortEarly: false }); // Include all validation errors
    if (error) {
      logger.error('Tenant update validation failed', { errors: error.details, tenantId, userId });
      throw new Error('Validation failed for tenant update data');
    }

    // Implement role-based access control (e.g., check if the user has permission to update a tenant)

    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId, userId });
      throw new Error('Tenant not found');
    }

    // Update tenant data
    Object.assign(tenant, updatedData);
    await tenant.save();
    logger.info(`Tenant updated by User: ${userId}`, { tenantId, updatedData });
    return tenant;
  } catch (error) {
    logger.error('Tenant update failed', { tenantId, error: error.message, userId });
    throw error;
  }
};

/**
 * Retrieve a tenant by ID.
 * @param {string} tenantId - The ID of the tenant to retrieve.
 * @returns {Promise<object|null>} - The retrieved tenant object or null if not found.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getTenantById = async (tenantId) => {
  try {
    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId });
      return null; // Return null when tenant is not found
    }

    // Return the tenant object
    return tenant.toObject();
  } catch (error) {
    logger.error('Failed to retrieve tenant by ID', { tenantId, error: error.message });
    throw error;
  }
};

/**
 * Subscribe to tenant-related events.
 * @param {string} eventName - The name of the event to subscribe to.
 * @param {Function} callback - The callback function to execute when the event is triggered.
 */
exports.subscribeToTenantEvents = (eventName, callback) => {
  // Subscribe to tenant-related events using EventEmitter
  tenantEventEmitter.on(eventName, callback);
};

/**
 * Unsubscribe from tenant-related events.
 * @param {string} eventName - The name of the event to unsubscribe from.
 * @param {Function} callback - The callback function to remove from the subscribers.
 */
exports.unsubscribeFromTenantEvents = (eventName, callback) => {
  // Unsubscribe from tenant-related events using EventEmitter
  tenantEventEmitter.off(eventName, callback);
};

/**
 * Retrieve all tenants.
 * @returns {Promise<object[]>} - An array of tenant objects.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getAllTenants = async () => {
  try {
    // Retrieve all tenants
    const tenants = await Tenant.find({});
    return tenants;
  } catch (error) {
    logger.error('Fetching all tenants failed', error);
    throw error;
  }
};

/**
 * Delete a tenant by ID.
 * @param {string} tenantId - The ID of the tenant to delete.
 * @returns {Promise<void>} - Resolves when the tenant is successfully deleted.
 * @throws {Error} - If the tenant is not found or an error occurs during deletion.
 */
exports.deleteTenantById = async (tenantId) => {
  try {
    // Find and delete the tenant by ID
    const tenant = await Tenant.findByIdAndDelete(tenantId);
    if (!tenant) {
      logger.error('Tenant not found', { tenantId });
      throw new Error('Tenant not found');
    }
    tenantEventEmitter.emit('tenantDeleted', tenantId);
    logger.info(`Tenant deleted: ${tenantId}`);
  } catch (error) {
    logger.error('Tenant deletion failed', { tenantId, error: error.message });
    throw error;
  }
};
