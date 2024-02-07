require('dotenv').config();
const { Kafka, logLevel } = require('kafkajs');
const { createLogger, transports, format } = require('winston');
const processCompetitorPriceUpdate = require('./services/processCompetitorPriceUpdate');
const healthCheck = require('./utils/healthCheck'); // Assuming a utility for health checks

// Setup environmental variables for Kafka
const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];
const enableSSL = process.env.KAFKA_SSL === 'true';
const enableSasl = process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD;

// Initialize Kafka Consumer with enhanced configurations
const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: kafkaBrokers,
    ssl: enableSSL,
    sasl: enableSasl ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
    logLevel: logLevel.INFO
});

const consumer = kafka.consumer({ groupId: 'competitor-price-group' });

// Enhanced Winston logger setup
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'competitor-price-consumer' },
    transports: [
        new transports.Console({ level: 'info', format: format.combine(format.colorize(), format.simple()) }),
        new transports.File({ filename: 'logs/competitor-price-error.log', level: 'error' }),
        new transports.File({ filename: 'logs/competitor-price-combined.log' })
    ]
});

// Health check before consuming messages
healthCheck.performCheck().then(isHealthy => {
    if (!isHealthy) {
        logger.error('Service health check failed. Exiting...');
        process.exit(1);
    }
});

// Function to consume competitor price updates and trigger repricing logic
async function consumeCompetitorPriceUpdates() {
    await consumer.connect();
    logger.info('Competitor Price Update Consumer connected to Kafka.');

    await consumer.subscribe({ topic: 'competitor-price-updates', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const competitorInfo = JSON.parse(message.value.toString());
            try {
                await processCompetitorPriceUpdate(competitorInfo); // Enhanced processing with error handling
                logger.info('Competitor price update processed successfully.', { topic, partition, key: message.key.toString() });
            } catch (processError) {
                logger.error('Error processing competitor price update:', { processError, topic, partition, key: message.key.toString() });
            }
        },
    });
}

consumeCompetitorPriceUpdates().catch(err => {
    logger.error('Fatal error in consumeCompetitorPriceUpdates:', err);
    process.exit(1);
});