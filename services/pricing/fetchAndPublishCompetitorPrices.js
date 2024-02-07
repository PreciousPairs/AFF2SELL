// Load environment variables from .env file
require('dotenv').config();

// Import necessary modules
const { Kafka, CompressionTypes, logLevel } = require('kafkajs');
const { createLogger, transports, format } = require('winston');
const retry = require('async-retry');
const fetchCompetitorPrices = require('./services/fetchCompetitorPrices');
const { determineTopic, validateSchema, getSchema } = require('./utils/kafkaHelpers');
const { gracefulShutdown } = require('./utils/gracefulShutdown');
const PrometheusMetrics = require('./monitoring/PrometheusMetrics');

// Kafka client configuration
const kafkaConfig = {
  clientId: 'pricing-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: {
    rejectUnauthorized: process.env.KAFKA_SSL === 'true',
    // Additional SSL configurations as necessary
  },
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'plain', // Consider 'scram-sha-256' or 'scram-sha-512' for enhanced security
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : undefined,
  logLevel: logLevel.INFO,
};

// Initialize Kafka client and producer
const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();

// Initialize Winston logger
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'pricing-service.log' }),
  ],
});

// Initialize Prometheus metrics
const metrics = new PrometheusMetrics('pricing_service_metrics');

// Async function to fetch competitor prices and publish to Kafka
async function fetchAndPublishPrices() {
  await producer.connect();
  logger.info('Kafka producer connected.');
  metrics.kafkaConnectionInc();

  // Fetch competitor prices with retry logic
  const prices = await retry(async () => {
    const fetchedPrices = await fetchCompetitorPrices();
    if (!fetchedPrices.length) throw new Error('No prices fetched, retrying...');
    return fetchedPrices.map(price => {
      if (!validateSchema(price, getSchema('priceSchema'))) {
        throw new Error('Price data schema validation failed');
      }
      return price;
    });
  }, {
    retries: 5,
    minTimeout: 1000,
    maxTimeout: 5000,
    onRetry: (error, attemptNumber) => {
      logger.warn(`Retry ${attemptNumber} for fetching prices. Error: ${error.message}`);
      metrics.fetchRetryInc();
    },
  });

  // Determine topic based on fetched prices
  const topic = determineTopic(prices);

  // Prepare messages for publishing to Kafka
  const messages = prices.map(price => ({
    value: JSON.stringify(price),
    // Optionally add key or headers for advanced use cases
  }));

  // Publish messages to Kafka topic
  await producer.send({
    topic,
    messages,
    compression: CompressionTypes.GZIP,
  });

  // Log success and update metrics
  logger.info(`Published ${messages.length} price updates to Kafka topic ${topic}.`);
  metrics.messagesPublishedInc(messages.length);

  // Disconnect Kafka producer
  await producer.disconnect();
  logger.info('Kafka producer disconnected.');
  metrics.kafkaDisconnectionInc();
}

// Setup graceful shutdown on SIGINT and SIGTERM signals
gracefulShutdown(producer, logger);

// Main function to execute fetching and publishing of competitor prices
async function main() {
  try {
    await fetchAndPublishPrices();
  } catch (error) {
    logger.error('Failed to fetch and publish competitor prices:', error);
    metrics.errorInc();
    process.exit(1);
  }
}

// Execute main function
main();