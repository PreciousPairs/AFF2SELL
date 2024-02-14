// priceAnalysisConsumer.js
const { Kafka } = require('kafkajs');
const { generateSignature } = require('./auth');
require('dotenv').config();
const axios = require('axios');

const kafka = new Kafka({
    clientId: 'price-analysis-app',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: 'price-analysis-group' });

const consumerId = process.env.WM_CONSUMER_ID;
const privateKey = process.env.PRIVATE_KEY; // Securely managed
const keyVersion = "2"; // Example key version

async function fetchCompetitorData(itemId) {
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
        return response.data; // Adjust according to the structure of the response
    } catch (error) {
        console.error(`Error fetching competitor data for item ${itemId}:`, error);
        throw error;
    }
}

async function runConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'price-analysis' });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const itemId = message.value.toString();
            console.log(`Received request for item ID: ${itemId}`);
            
            const data = await fetchCompetitorData(itemId);
            // Process the data as needed
        },
    });
}

runConsumer().catch(console.error);
