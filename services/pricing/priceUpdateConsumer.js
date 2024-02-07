// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const { Kafka, logLevel } = require('kafkajs');
const winston = require('winston');
const updateProductPrice = require('./services/updateProductPrice');

// Setup Winston logger for application-wide logging
const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' })
  ],
});

// Kafka client configuration
const kafka = new Kafka({
  clientId: 'price-update-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
  sasl: process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD ? {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD
  } : undefined,
  logLevel: logLevel.INFO,
});

// Kafka logger integration with Winston
kafka.logger().setLogCreator(() => {
  return ({ namespace, level, label, log }) => {
    const { message, ...extra } = log;
    appLogger.log({
      level: level.label,
      message: `${label} ${namespace} ${message}`,
      extra,
    });
  };
});

// Initialize Kafka consumer
const consumer = kafka.consumer({ groupId: 'price-update-consumer-group' });

// Async function to consume and process messages
async function consumeAndTriggerPriceUpdates() {
  try {
    await consumer.connect();
    appLogger.info('Kafka Consumer connected.');

    await consumer.subscribe({ topic: 'price-updates', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        appLogger.info(`Received message on ${topic}:${partition}: ${JSON.stringify(payload)}`);

        try {
          await updateProductPrice(payload);
          appLogger.info(`Price update processed for product ID: ${payload.productId}`);
        } catch (error) {
          appLogger.error(`Failed to process price update for product ID: ${payload.productId}`, error);
          // Implement retry logic, error handling, or dead-letter queue logic here
        }
      },
    });
  } catch (error) {
    appLogger.error('Error in consuming/processing messages:', error);
    throw error;
  }
}

// Handle graceful shutdown
const shutdown = async () => {
  appLogger.info('Shutting down gracefully...');
  await consumer.disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Execute the consumer function
consumeAndTriggerPriceUpdates().catch((error) => {
  appLogger.error('Fatal error in Kafka consumer:', error);
  process.exit(1);
});