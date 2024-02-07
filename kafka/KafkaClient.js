// kafka/config/kafkaClient.js
const { Kafka, logLevel } = require('kafkajs');
require('dotenv').config();

// Define Kafka client options with improved security, performance, and error handling
const kafkaClientOptions = {
    clientId: 'saas_repricer',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? {
        rejectUnauthorized: true,
    } : null,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD,
    } : null,
    logLevel: logLevel.INFO,
    retry: {
        initialRetryTime: 300,
        retries: 10,
    },
    connectionTimeout: 3000,
    authenticationTimeout: 1000,
};

// Create and configure Kafka client instance
const kafka = new Kafka(kafkaClientOptions);

// Export the configured Kafka client for use across the application
module.exports = kafka;