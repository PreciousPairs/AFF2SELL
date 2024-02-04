const { Kafka } = require('kafkajs');
const { fetchCompetitorPrice } = require('./CompetitorService');
const { updateProductPrice } = require('./ProductService');

const kafka = new Kafka({
    clientId: 'price-fetch-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
});

const consumer = kafka.consumer({ groupId: 'price-fetch-group' });

async function consume() {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_INVENTORY_TOPIC, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const item = JSON.parse(message.value.toString());
            const competitorPrice = await fetchCompetitorPrice(item.productId);
            // Assume fetchCompetitorPrice fetches price and returns it

            if (competitorPrice) {
                // Logic to determine new price based on competitor price
                const newPrice = competitorPrice - 0.01;
                await updateProductPrice(item.productId, newPrice);
                // updateProductPrice updates the price in the database
            }
        },
    });
}
