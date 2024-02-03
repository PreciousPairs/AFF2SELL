// affiliatePriceQueryConsumer.js
const { Kafka } = require('kafkajs');
const { fetchAndStoreCompetitorPricesAndShippingRates } = require('./fetchCompetitorPrices');

const kafka = new Kafka({
    clientId: 'affiliate-price-query-app',
    brokers: ['your.kafka.broker:9092'],
});

const consumer = kafka.consumer({ groupId: 'affiliate-price-query-group' });

async function affiliatePriceQueryConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'affiliate-price-query', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { itemId } = JSON.parse(message.value.toString());
            console.log(`Processing affiliate price query for item ID: ${itemId}`);
            await fetchAndStoreCompetitorPricesAndShippingRates(itemId);
        },
    });
}

affiliatePriceQueryConsumer().catch(console.error);
