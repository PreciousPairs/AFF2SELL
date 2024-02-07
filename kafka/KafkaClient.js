const { Kafka, logLevel } = require('kafkajs');
const logger = require('./logger'); // Assuming you have a custom logger configured

// Enhanced Kafka client options with additional configurations
const kafkaClientOptions = {
  clientId: 'saas_repricer',
  brokers: process.env.KAFKA_BROKER.split(','), // Support for multiple brokers
  ssl: process.env.KAFKA_SSL === 'true' ? {
    rejectUnauthorized: true, // Ensures SSL connections are verified
  } : undefined,
  sasl: process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD ? { // Conditional SASL configuration
    mechanism: 'plain', // Consider using 'scram-sha-256' or 'scram-sha-512' for better security
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  } : undefined,
  logLevel: logLevel.INFO, // Configurable log level for Kafka client logging
  retry: {
    initialRetryTime: 300,
    retries: 10 // Configurable retry attempts for Kafka operations
  },
  connectionTimeout: 3000, // Timeout for connecting to the broker
  authenticationTimeout: 1000, // Timeout for Kafka SASL authentication
};

const kafka = new Kafka(kafkaClientOptions);

// Optional: Custom logging for Kafka client events
kafka.logger().setLogLevel(logLevel.DEBUG);
kafka.on('producer.network.request', (event) => logger.debug('Kafka Producer Network Request:', event));
kafka.on('consumer.network.request', (event) => logger.debug('Kafka Consumer Network Request:', event));

module.exports = { kafka };