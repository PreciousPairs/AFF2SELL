// /services/pricing/productPricingUpdateProducer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const log = require('../utils/logger'); // A custom logger for logging messages

// Initialize Kafka Producer with SSL and SASL configurations if provided
const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? {
        rejectUnauthorized: false // Note: Set true in production for enhanced security
    } : false,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain', // 'scram-sha-256' or 'scram-sha-512' could also be used based on the broker configuration
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : null,
});

const producer = kafka.producer();

// Function to publish product pricing updates
async function publishProductPricingUpdates(productId, updatedPricing) {
    await producer.connect();
    log.info('Product Pricing Update Producer connected to Kafka.');

    try {
        await producer.send({
            topic: 'product-pricing-updates',
            messages: [
                { 
                    key: String(productId), // Using product ID as the key for message partitioning
                    value: JSON.stringify(updatedPricing)
                },
            ],
        });
        log.info(`Published pricing update for product ID ${productId}`);
    } catch (err) {
        log.error('Error publishing product pricing update:', err);
    } finally {
        await producer.disconnect();
    }
}

module.exports = { publishProductPricingUpdates };
