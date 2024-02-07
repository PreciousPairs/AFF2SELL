// Load environment variables from .env file
require('dotenv').config();

// Import Kafka library for interacting with Kafka
const { Kafka, logLevel, CompressionTypes } = require('kafkajs');

// Import the function to fetch competitor prices
const fetchCompetitorPrices = require('./fetchCompetitorPrices');

// Import the Winston library for logging
const { createLogger, transports, format } = require('winston');

// Import async-retry for retry mechanism
const { retry } = require('async-retry');

// Initialize Kafka Producer
const kafka = new Kafka({
    clientId: 'pricing-service', // Client ID for identification
    brokers: process.env.KAFKA_BROKERS.split(','), // Kafka broker list
    ssl: process.env.KAFKA_SSL === 'true', // SSL enabled flag
    sasl: process.env.KAFKA_SASL_USERNAME ? { // SASL authentication if provided
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
    logLevel: logLevel.INFO, // Set log level
});

const producer = kafka.producer(); // Create Kafka producer instance

// Initialize Winston logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })
    ]
});

/**
 * Function to fetch competitor prices and publish to Kafka with retry mechanism
 */
async function fetchAndPublishPrices() {
    try {
        await producer.connect(); // Connect to Kafka broker
        logger.info('Producer connected to Kafka.');

        const prices = await fetchCompetitorPrices(); // Fetch competitor prices
        const messages = prices.map(priceInfo => ({
            value: JSON.stringify(priceInfo),
        }));

        // Publish messages to the 'competitor-prices' topic with compression
        await producer.send({
            topic: 'competitor-prices',
            messages: messages,
            compression: CompressionTypes.GZIP, // Add compression for messages
        });

        logger.info(`${messages.length} competitor prices published to Kafka.`);
    } catch (error) {
        logger.error('Error in fetching/publishing competitor prices:', { error });
        throw error; // Rethrow error for centralized error handling
    } finally {
        await producer.disconnect(); // Disconnect from Kafka broker
    }
}

/**
 * Execute the fetchAndPublishPrices function with retry mechanism
 */
const retryOptions = {
    retries: 5, // Retry 5 times
    minTimeout: 1000, // Initial retry delay
    maxTimeout: 5000, // Maximum retry delay
    onRetry: (err, attempt) => {
        logger.warn(`Attempt ${attempt} failed. Retrying...`, { error: err });
    }
};

retry(fetchAndPublishPrices, retryOptions)
    .catch(err => {
        logger.error('Error in fetching/publishing competitor prices:', { error: err });
        process.exit(1); // Exit with error status
    });