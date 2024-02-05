// /services/inventory/multiTenantInventoryUpdatesProducer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const log = require('../utils/logger'); // Assuming a custom logger for logging

const kafka = new Kafka({
    clientId: 'repricer-multi-tenant-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? {
        rejectUnauthorized: true
    } : false,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : null,
});

const producer = kafka.producer();

// Function to publish inventory updates for a specific tenant
const publishTenantInventoryUpdate = async (tenantId, productId, stockLevel) => {
    await producer.connect();
    
    // Dynamic topic based on tenant ID for segregating inventory updates
    const tenantTopic = `tenant_${tenantId}_inventory_updates`;

    const message = {
        topic: tenantTopic,
        messages: [
            { value: JSON.stringify({ productId, stockLevel }) },
        ],
    };

    try {
        await producer.send(message);
        log.info(`Inventory update for product ID ${productId} published to tenant ${tenantId}`);
    } catch (error) {
        log.error(`Error publishing inventory update for product ID ${productId} to tenant ${tenantId}:`, error);
    } finally {
        await producer.disconnect();
    }
};

module.exports = { publishTenantInventoryUpdate };
