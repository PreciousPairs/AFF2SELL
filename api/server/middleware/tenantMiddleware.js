// /api/server/middleware/tenantMiddleware.js
const TenantConfig = require('../models/TenantConfig');
const NodeCache = require('node-cache');
const crypto = require('crypto');

// Initialize a cache with standard TTL and check period
const configCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

async function tenantMiddleware(req, res, next) {
  const tenantId = extractTenantId(req);

  if (!tenantId) {
    return res.status(400).send('Tenant ID is required and could not be determined.');
  }

  try {
    let tenantConfig = configCache.get(tenantId);

    if (!tenantConfig) {
      tenantConfig = await fetchAndCacheTenantConfig(tenantId);
    }

    req.tenantConfig = decryptTenantConfig(tenantConfig);

    next();
  } catch (error) {
    console.error(`Error retrieving configuration for tenant ${tenantId}:`, error);
    res.status(500).send('Internal server error due to configuration retrieval issue.');
  }
}

function extractTenantId(req) {
  // Adjust according to your URL structure or request properties
  return req.subdomains.length > 0 ? req.subdomains[0] : req.headers['x-tenant-id'];
}

async function fetchAndCacheTenantConfig(tenantId) {
  const config = await TenantConfig.findByTenantId(tenantId);
  if (!config) {
    throw new Error(`Tenant configuration for ${tenantId} not found.`);
  }
  configCache.set(tenantId, config);
  return config;
}

function decryptTenantConfig(tenantConfig) {
  // This approach allows for easy extension to multiple fields
  const fieldsToDecrypt = ['PRIVATE_KEY']; // Extend this array as needed
  fieldsToDecrypt.forEach(field => {
    if (tenantConfig[field]) {
      try {
        const decipher = crypto.createDecipher('aes-256-cbc', process.env.DECRYPTION_KEY);
        let decrypted = decipher.update(tenantConfig[field], 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        tenantConfig[field] = decrypted;
      } catch (decryptionError) {
        console.error(`Decryption failed for ${field} in tenant ${tenantConfig.tenantId}:`, decryptionError);
        // Depending on your error handling policy, you may throw an error, set the field to null, etc.
      }
    }
  });
  return tenantConfig;
}

module.exports = tenantMiddleware;
