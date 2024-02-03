// kafka/consumer.js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092']
});

const consumer = kafka.consumer({ groupId: 'my-group' });

const consumeMessages = async (topic, callback) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const payload = JSON.parse(message.value.toString());
            callback(payload);
        },
    });
};

module.exports = { consumeMessages };
