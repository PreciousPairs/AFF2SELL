require('dotenv').config();
const { Kafka } = require('kafkajs');
const winston = require('winston');
const processCompetitorPriceUpdate = require('./processCompetitorPriceUpdate');

// Setup for Kafka with environmental configurations
const kafkaConfig = {
  clientId: 'saas-repricer',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : null,
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : null,
};

const kafka = new Kafka(kafkaConfig);
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'pricing-service-group' });

// Winston logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'saas-repricer.log' }),
  ],
});

// Function to publish product pricing updates
async function publishProductPricingUpdates(productId, updatedPricing) {
  await producer.connect();
  logger.info('Product Pricing Update Producer connected.');

  try {
    await producer.send({
      topic: 'product-pricing-updates',
      messages: [{ key: String(productId), value: JSON.stringify(updatedPricing) }],
    });
    logger.info(`Pricing update published for product ID: ${productId}.`);
  } catch (error) {
    logger.error('Error publishing product pricing update:', error);
  } finally {
    await producer.disconnect();
  }
}

// Function to consume competitor price updates
async function consumeCompetitorPriceUpdates() {
  await consumer.connect();
  logger.info('Competitor Price Update Consumer connected.');

  await consumer.subscribe({ topic: 'competitor-price-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const messageContent = JSON.parse(message.value.toString());
        await processCompetitorPriceUpdate(messageContent);
        logger.info(`Competitor price update processed for partition: ${partition}, key: ${message.key.toString()}`);
      } catch (error) {
        logger.error('Error processing competitor price update:', error);
      }
    },
  });
}

// Start consuming messages
consumeCompetitorPriceUpdates().catch(error => {
  logger.error('Failed to consume competitor price updates:', error);
  process.exit(1);
});

module.exports = { publishProductPricingUpdates, consumeCompetitorPriceUpdates };