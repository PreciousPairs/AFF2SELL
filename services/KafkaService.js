// services/kafkaService.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'pricing-service',
    brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

exports.publishPriceUpdate = async ({ productId, newPrice }) => {
    await producer.connect();
    await producer.send({
        topic: 'product-price-updates',
        messages: [{ key: String(productId), value: JSON.stringify({ newPrice }) }],
    });
    await producer.disconnect();
};