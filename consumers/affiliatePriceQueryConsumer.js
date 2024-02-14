// affiliatePriceQueryConsumer.js
const { Kafka } = require('kafkajs');
const { generateSignature } = require('./auth');
require('dotenv').config();
const axios = require('axios');

const kafka = new Kafka({
    clientId: 'affiliate-price-query-app',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'affiliate-price-query-group' });

const consumerId = process.env.WM_CONSUMER_ID;
const privateKey = process.env.PRIVATE_KEY; // Securely managed
const keyVersion = "2"; // Example key version

async function fetchAndStoreCompetitorPricesAndShippingRates(itemId) {
    const signature = generateSignature(consumerId, privateKey, keyVersion);
    const affiliateApiUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items/${itemId}?publisherId=yourPublisherId`;

    try {
        const response = await axios.get(affiliateApiUrl, {
            headers: {
                'WM_SEC.KEY_VERSION': keyVersion,
                'WM_CONSUMER.ID': consumerId,
                'WM_CONSUMER.INTIMESTAMP': Date.now().toString(),
                'WM_SEC.AUTH_SIGNATURE': signature,
            },
        });
        // Process and store the response data as needed
        console.log(`Data for item ${itemId} fetched and stored.`);
    } catch (error) {
        console.error(`Error in affiliate price query for item ${itemId}:`, error);
    }
}

async function affiliatePriceQueryConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'affiliate-price-query', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const itemId = message.value.toString();
            console.log(`Processing affiliate price query for item ID: ${itemId}`);
            await fetchAndStoreCompetitorPricesAndShippingRates(itemId);
        },
    });
}

affiliatePriceQueryConsumer().catch(console.error);
