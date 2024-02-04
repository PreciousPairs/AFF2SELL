// /api/server/models/TenantConfig.js

const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// Ensure encryption keys are present
if (!process.env.ENCRYPTION_KEY) {
  console.error('Encryption key is missing. Please check your .env file.');
  process.exit(1);
}

const tenantConfigSchema = new mongoose.Schema({
  tenantId: { type: String, unique: true, required: true, index: true },
  WM_CONSUMER_ID: { type: String, required: true },
  PRIVATE_KEY: { type: String, required: true },
  KEY_VERSION: { type: String, required: true },
  apiEndpoint: { type: String, default: 'https://api.walmart.com/' },
  additionalSettings: { type: Map, of: String, default: {} },
});

// Encryption setup
tenantConfigSchema.plugin(encrypt, {
  encryptionKey: process.env.ENCRYPTION_KEY,
  signingKey: process.env.SIGNING_KEY, // Optional: for added security
  encryptedFields: ['WM_CONSUMER_ID', 'PRIVATE_KEY', 'additionalSettings'],
  excludeFromEncryption: ['tenantId']
});

// Static method to find tenant config by ID
tenantConfigSchema.statics.findByTenantId = function(tenantId, callback) {
  return this.findOne({ tenantId }, callback);
};

// Instance method to decrypt sensitive information
tenantConfigSchema.methods.decryptFieldsSync = function() {
  return {
    WM_CONSUMER_ID: this.WM_CONSUMER_ID,
    PRIVATE_KEY: this.PRIVATE_KEY,
    KEY_VERSION: this.KEY_VERSION,
    additionalSettings: this.additionalSettings
  };
};

const TenantConfig = mongoose.model('TenantConfig', tenantConfigSchema);
module.exports = TenantConfig;
