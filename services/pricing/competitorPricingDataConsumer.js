// /services/pricing/competitorPricingDataConsumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const log = require('../utils/logger'); // Assuming a custom logger for logging
const { updateProductPricing } = require('./productPricingUpdateService'); // Service to update product pricing

const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? {
        rejectUnauthorized: false // Ensure to set true in production for security
    } : false,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : null,
});

const consumer = kafka.consumer({ groupId: 'pricing-group' });

// Function to consume competitor pricing data and trigger repricing logic
const consumeCompetitorPricingData = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: 'competitor-pricing-data', fromBeginning: true });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const competitorData = JSON.parse(message.value.toString());
            log.info(`Received competitor pricing data for product ID ${competitorData.productId}`);
            
            // Trigger repricing logic based on competitor pricing data
            try {
                await updateProductPricing(competitorData.productId, competitorData.pricing);
                log.info(`Repricing completed for product ID ${competitorData.productId}`);
            } catch (err) {
                log.error(`Error in repricing product ID ${competitorData.productId}:`, err);
            }
        },
    });
};

module.exports = { consumeCompetitorPricingData };
