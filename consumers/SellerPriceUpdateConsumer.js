// Import required modules
const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');
const sellerApi = require('../services/sellerApi');

// Initialize Kafka consumer
const kafka = new Kafka({
  clientId: 'seller_price_update_consumer',
  brokers: ['kafka1:9092', 'kafka2:9092'], // Update with your Kafka broker addresses
});

// Define and configure the update price consumer
const updateConsumer = kafka.consumer({ groupId: 'update_price_group' });

const runUpdateConsumer = async () => {
  try {
    // Connect to Kafka broker
    await updateConsumer.connect();
    logger.info('Connected to Kafka broker for price updates');

    // Subscribe to topic for price updates
    await updateConsumer.subscribe({ topic: 'price_updates', fromBeginning: true });
    logger.info('Subscribed to price_updates topic for updates');

    // Run the consumer to process each message
    await updateConsumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const { itemId, newPrice } = JSON.parse(message.value.toString());
          // Update item price using seller API
          await sellerApi.updateItemPrice(itemId, newPrice);
          logger.info(`Price update for item ${itemId} processed successfully`);
        } catch (error) {
          logger.error('Error processing price update message:', error.message);
          // Handle error: log and continue processing other messages
        }
      },
    });
  } catch (error) {
    logger.error('Error connecting to Kafka broker:', error.message);
    // Handle error: retry or exit as needed
  }
};

// Export the function to run the update consumer
module.exports = runUpdateConsumer;