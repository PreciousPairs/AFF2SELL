// /services/pricing/fetchAndPublishCompetitorPrices.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const fetchCompetitorPrices = require('./fetchCompetitorPrices'); // Assume this function fetches competitor prices and returns an array of { productId, competitorPrice }

// Initialize Kafka Producer
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

const producer = kafka.producer();

// Function to fetch competitor prices and publish to Kafka
async function fetchAndPublishPrices() {
    await producer.connect();
    console.log('Producer connected to Kafka.');

    const prices = await fetchCompetitorPrices(); // Fetch competitor prices
    const messages = prices.map(priceInfo => ({
        value: JSON.stringify(priceInfo),
    }));

    // Publish messages to the 'competitor-prices' topic
    await producer.send({
        topic: 'competitor-prices',
        messages: messages,
    });

    console.log(`${messages.length} competitor prices published to Kafka.`);
    await producer.disconnect();
}

fetchAndPublishPrices().catch(err => console.error('Error in fetching/publishing competitor prices:', err));
