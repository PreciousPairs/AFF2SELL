// /services/inventory/inventoryUpdatesProducer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const log = require('../utils/logger'); // Assuming a custom logger for logging

const kafka = new Kafka({
    clientId: 'inventory-service',
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

// Function to publish inventory updates
const publishInventoryUpdate = async (productId, stockLevel) => {
    await producer.connect();
    
    const message = {
        topic: 'inventory-updates',
        messages: [
            { value: JSON.stringify({ productId, stockLevel }) },
        ],
    };

    try {
        await producer.send(message);
        log.info(`Inventory update published for product ID ${productId}`);
    } catch (error) {
        log.error(`Error publishing inventory update for product ID ${productId}:`, error);
    } finally {
        await producer.disconnect();
    }
};

module.exports = { publishInventoryUpdate };
