const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

// Initialize Kafka connection
const kafka = new Kafka({
    clientId: 'app-dlq-handler',
    brokers: [process.env.KAFKA_BROKER], // Ensure KAFKA_BROKER env variable is set
    ssl: process.env.KAFKA_SSL === 'true', // Optional, based on your Kafka setup
    sasl: process.env.KAFKA_SASL ? { // Optional, based on your Kafka setup
        mechanism: 'plain', // or 'scram-sha-256', 'scram-sha-512'
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    } : undefined,
});

const producer = kafka.producer();

/**
 * Moves the given message to a dedicated Dead Letter Queue (DLQ) topic in Kafka.
 * @param {Object} message - The message that failed processing and needs to be moved to DLQ.
 */
async function moveToDLQ(message) {
    try {
        await producer.connect();
        await producer.send({
            topic: 'app-dlq', // Your DLQ topic name
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
        logger.info(`Message moved to DLQ: ${JSON.stringify(message)}`);
    } catch (error) {
        logger.error(`Failed to move message to DLQ: ${error.message}`, error);
    } finally {
        await producer.disconnect();
    }
}

module.exports = { moveToDLQ };