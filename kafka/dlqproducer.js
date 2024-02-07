const { Kafka } = require('kafkajs');
require('dotenv').config();
const logger = require('../utils/logger');

const kafka = new Kafka({
    clientId: 'app-dlq-handler',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
    } : undefined,
});

const dlqProducer = kafka.producer();

const initializeDLQProducer = async () => {
    await dlqProducer.connect();
    logger.info("DLQ Producer connected");
};

const moveToDLQ = async (message) => {
    try {
        await dlqProducer.send({
            topic: process.env.KAFKA_DLQ_TOPIC,
            messages: [{ value: JSON.stringify(message) }],
        });
        logger.info(`Message moved to DLQ: ${JSON.stringify(message)}`);
    } catch (error) {
        logger.error(`Failed to move message to DLQ: ${error.message}`, error);
    }
};

process.on('SIGINT', async () => {
    await dlqProducer.disconnect();
    logger.info("DLQ Producer disconnected");
});

module.exports = { initializeDLQProducer, moveToDLQ };