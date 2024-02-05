competitorPriceConsumer.js// /services/pricing/competitorPriceConsumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const processCompetitorPrice = require('./processCompetitorPrice'); // Assume this function processes each price, comparing it to the current price and deciding on repricing.

// Initialize Kafka Consumer
const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
});

const consumer = kafka.consumer({ groupId: 'pricing-group' });

// Function to consume competitor prices and process them
async function consumeAndProcessPrices() {
    await consumer.connect();
    console.log('Consumer connected to Kafka.');

    await consumer.subscribe({ topic: 'competitor-prices', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const priceInfo = JSON.parse(message.value.toString());
            await processCompetitorPrice(priceInfo);
        },
    });
}

consumeAndProcessPrices().catch(err => console.error('Error in consuming/processing competitor prices:', err));
