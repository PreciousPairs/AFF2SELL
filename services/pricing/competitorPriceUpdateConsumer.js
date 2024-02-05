// /services/pricing/competitorPriceUpdateConsumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const processCompetitorPriceUpdate = require('./processCompetitorPriceUpdate'); // Function to process competitor price update.

// Initialize Kafka Consumer with SSL and SASL configurations if provided
const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : null,
});

const consumer = kafka.consumer({ groupId: 'competitor-price-group' });

// Function to consume competitor price updates and trigger repricing logic
async function consumeCompetitorPriceUpdates() {
    await consumer.connect();
    console.log('Competitor Price Update Consumer connected to Kafka.');

    await consumer.subscribe({ topic: 'competitor-price-updates', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const competitorInfo = JSON.parse(message.value.toString());
            await processCompetitorPriceUpdate(competitorInfo); // Assume this triggers repricing logic based on competitor data.
        },
    });
}

consumeCompetitorPriceUpdates().catch(err => console.error('Error in consuming/processing competitor price updates:', err));
