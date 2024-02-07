require('dotenv').config();
const { Kafka } = require('kafkajs');
const updateProductPrice = require('./updateProductPrice'); // Assumes updates price in the database or an external API.
const logger = require('../utils/logger'); // Custom logger module for structured logging.

// Kafka consumer configuration with environment-based settings for flexibility and security.
const kafka = new Kafka({
    clientId: 'update-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : false,
    sasl: process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD ? {
        mechanism: 'plain', // or 'scram-sha-256'/'scram-sha-512' based on broker config.
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
});

const consumer = kafka.consumer({ groupId: 'update-price-group' });

// Handles consuming price update messages and applying updates.
async function consumeAndTriggerPriceUpdates() {
    try {
        await consumer.connect();
        logger.info('Price Update Consumer connected to Kafka.');

        await consumer.subscribe({ topic: 'price-updates', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                try {
                    const updateInfo = JSON.parse(message.value.toString());
                    await updateProductPrice(updateInfo); // Update product price with the provided info.
                    logger.info(`Price update applied for product ID: ${updateInfo.productId}`);
                } catch (err) {
                    logger.error(`Error processing message from ${topic} at partition ${partition}: ${err.message}`, err);
                    // Implement error handling strategies such as retries, dead-letter queues, etc.
                }
            },
        });
    } catch (err) {
        logger.error('Error in consuming/triggering price updates:', err);
        // Consider implementing a reconnection strategy or alerting mechanism here.
    }
}

// Start the consumer with error handling.
consumeAndTriggerPriceUpdates().catch(err => {
    logger.error('Fatal error in price update consumer:', err);
    process.exit(1); // Exit the process for systems like Kubernetes to attempt a restart.
});