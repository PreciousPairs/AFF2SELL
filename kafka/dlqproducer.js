const { Kafka } = require('kafkajs');
require('dotenv').config();
const logger = require('./logger'); // Adjust the path as necessary to import your custom logger module

// Initialize Kafka client with configuration for DLQ Producer
const kafka = new Kafka({
    clientId: 'app-dlq-producer',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : false,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
    } : undefined,
});

const dlqProducer = kafka.producer();

// Function to initialize and connect the DLQ producer to Kafka brokers
const initializeDLQProducer = async () => {
    try {
        await dlqProducer.connect();
        logger.info("DLQ Producer connected successfully.");
    } catch (error) {
        logger.error("Failed to connect DLQ Producer:", error);
        process.exit(1); // Exit with failure if unable to connect
    }
};

// Function to publish messages to a designated Dead Letter Queue topic
const moveToDLQ = async (message) => {
    try {
        await dlqProducer.send({
            topic: process.env.KAFKA_DLQ_TOPIC,
            messages: [{ value: JSON.stringify(message) }],
        });
        logger.info(`Message moved to DLQ: ${JSON.stringify(message)}`);
    } catch (error) {
        logger.error(`Failed to move message to DLQ:`, error);
        // Consider further error handling or notification mechanisms here
    }
};

// Graceful shutdown handler for the DLQ producer
const shutdownDLQProducer = async () => {
    try {
        await dlqProducer.disconnect();
        logger.info("DLQ Producer disconnected gracefully.");
    } catch (error) {
        logger.error("Error during DLQ Producer disconnection:", error);
    } finally {
        process.exit(0); // Ensure clean exit
    }
};

// Register shutdown handlers for graceful termination
process.on('SIGINT', shutdownDLQProducer);
process.on('SIGTERM', shutdownDLQProducer);

module.exports = { initializeDLQProducer, moveToDLQ };