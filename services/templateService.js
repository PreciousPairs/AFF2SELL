const NotificationTemplate = require('../models/NotificationTemplate');

exports.getTemplateByKey = async (key) => {
    try {
        const template = await NotificationTemplate.findOne({ key });
        if (!template) {
            throw new Error(`Template with key ${key} not found`);
        }
        return template;
    } catch (error) {
        console.error(`Error fetching template by key: ${key}`, error);
        throw error;
    }
};