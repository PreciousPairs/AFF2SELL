require('dotenv').config();
const { Kafka } = require('kafkajs');
const processCompetitorPrice = require('./processCompetitorPrice');
const { logger } = require('./utils/logger');
const { getKafkaConsumerConfig } = require('./config/kafkaConsumerConfigService');

// Initialize Kafka Consumer with dynamic configuration
async function initConsumer() {
    const kafkaConfig = await getKafkaConsumerConfig();
    const kafka = new Kafka(kafkaConfig);

    const consumer = kafka.consumer({ groupId: 'pricing-group' });

    await consumer.connect();
    logger.info('Competitor Price Consumer connected to Kafka.');

    // Dynamic topic subscription based on external configuration or database
    const topicsToSubscribe = await fetchTopicsToSubscribe();
    await Promise.all(topicsToSubscribe.map(topic => consumer.subscribe({ topic, fromBeginning: true })));

    return consumer;
}

async function fetchTopicsToSubscribe() {
    // Placeholder: Fetch dynamically from a configuration service or database
    return ['competitor-prices']; // Default topic for simplicity
}

// Main function to consume and process competitor prices
async function consumeAndProcessPrices() {
    const consumer = await initConsumer();

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const priceInfo = JSON.parse(message.value.toString());
                await processCompetitorPrice(priceInfo);
                logger.info(`Processed message from topic ${topic} partition ${partition}`);
            } catch (error) {
                logger.error(`Error processing message from topic ${topic} partition ${partition}: ${error.message}`, error);
                // Implement retry mechanism or push to a dead-letter queue for later processing
                handleProcessingError(priceInfo, error);
            }
        },
    });
}

// Error handling and retry logic
function handleProcessingError(priceInfo, error) {
    // Placeholder for error handling logic: retry, log, alert, or move to a dead-letter queue
    logger.warn(`Retrying processing for priceInfo: ${JSON.stringify(priceInfo)}`, error);
    // Implement retry logic or move to a DLQ
}

// Start the consumer process with comprehensive error handling
consumeAndProcessPrices().catch(error => {
    logger.error('Fatal error in competitor price processing:', error);
    process.exit(1); // Exit with error for restart by orchestration tools (e.g., Kubernetes)
});