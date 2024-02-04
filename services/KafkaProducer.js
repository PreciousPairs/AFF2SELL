const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'inventory-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
});

const producer = kafka.producer({ idempotent: true });

async function send(message) {
    await producer.connect();
    await producer.send(message);
    await producer.disconnect();
}

module.exports = { send };
