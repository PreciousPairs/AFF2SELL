// /services/pricing/priceUpdateConsumer.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const updateProductPrice = require('./updateProductPrice'); // Function to update product price on the platform.

// Initialize Kafka Consumer
const kafka = new Kafka({
    clientId: 'update-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
});

const consumer = kafka.consumer({ groupId: 'update-price-group' });

// Function to consume price updates and trigger the update process
async function consumeAndTriggerPriceUpdates() {
    await consumer.connect();
    console.log('Price Update Consumer connected to Kafka.');

    await consumer.subscribe({ topic: 'price-updates', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const updateInfo = JSON.parse(message.value.toString());
            await updateProductPrice(updateInfo); // Assume this updates the price on Walmart Seller API.
        },
    });
}

consumeAndTriggerPriceUpdates().catch(err => console.error('Error in consuming/triggering price updates:', err));
