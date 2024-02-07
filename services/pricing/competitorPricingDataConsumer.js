require('dotenv').config();
const { Kafka, logLevel, CompressionTypes } = require('kafkajs');
const { createLogger, transports, format } = require('winston');
const { updateProductPricing } = require('./productPricingUpdateService'); // Assumes handling pricing updates.
const { validateCompetitorData, applyDynamicRepricingStrategy } = require('../utils/repricingUtils');
const gracefulShutdownHandler = require('../utils/gracefulShutdownHandler');

// Setup Winston logger for structured logging
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'competitor-pricing-data-consumer.log' })
  ],
});

// Kafka consumer configuration with SSL and SASL for secure connections
const kafkaConfig = {
  clientId: 'pricing-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : null,
  sasl: process.env.KAFKA_SASL_USERNAME && process.env.KAFKA_SASL_PASSWORD ? {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : undefined,
  logLevel: logLevel.INFO,
};

const kafka = new Kafka(kafkaConfig);
const consumer = kafka.consumer({ groupId: 'competitor-pricing-data-group' });

// Consumer function to handle competitor pricing data and trigger repricing
const consumeCompetitorPricingData = async () => {
  try {
    await consumer.connect();
    logger.info('Connected to Kafka, competitor pricing data consumer running.');

    await consumer.subscribe({ topic: 'competitor-pricing-data', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const competitorData = JSON.parse(message.value.toString());
        if (!validateCompetitorData(competitorData)) {
          logger.warn(`Invalid competitor data received, skipping: ${JSON.stringify(competitorData)}`);
          return;
        }

        logger.info(`Processing competitor pricing data for product ID: ${competitorData.productId}`);

        try {
          // Enhanced repricing strategy considering dynamic factors
          const repricingResult = await applyDynamicRepricingStrategy(competitorData.productId, competitorData.pricing);
          await updateProductPricing(competitorData.productId, repricingResult.newPrice);
          logger.info(`Successfully applied repricing for product ID: ${competitorData.productId}`);
        } catch (error) {
          logger.error(`Failed to reprice product ID: ${competitorData.productId}`, error);
          // Implement retry mechanism or notify for manual intervention
        }
      },
    });
  } catch (error) {
    logger.error('Failed to consume competitor pricing data', error);
    // Consider retrying connection or alerting system operators
  } finally {
    // Setup graceful shutdown for clean disconnect
    gracefulShutdownHandler(consumer, logger, 'Kafka competitor pricing data consumer');
  }
};

consumeCompetitorPricingData();