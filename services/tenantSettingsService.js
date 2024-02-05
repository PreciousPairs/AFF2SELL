const TenantSettings = require('../models/TenantSettings');

exports.updateAdvancedSettings = async (tenantId, settings) => {
    const tenant = await TenantSettings.findOne({ tenantId });
    if (!tenant) {
        throw new Error('Tenant not found');
    }
    tenant.advancedSettings = { ...tenant.advancedSettings, ...settings };
    await tenant.save();
    return tenant.advancedSettings;
};

exports.getAdvancedSettings = async (tenantId) => {
    const tenant = await TenantSettings.findOne({ tenantId });
    if (!tenant) {
        throw new Error('Tenant not found');
    }
    return tenant.advancedSettings;
};
