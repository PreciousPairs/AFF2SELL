// kafka/consumer.js
const { Kafka } = require('kafkajs');

const kafkaClientOptions = {
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092'],
    ssl: true, // Assuming SSL is needed; adjust as per your Kafka setup
    sasl: {
        mechanism: 'plain', // Adjust according to your SASL mechanism
        username: 'kafkaUsername',
        password: 'kafkaPassword',
    },
};

const kafka = new Kafka(kafkaClientOptions);

const consumer = kafka.consumer({ groupId: 'my-group' });

const consumeMessages = async (topic, callback) => {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });
    
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const payload = JSON.parse(message.value.toString());
                callback(payload);
            } catch (error) {
                console.error('Error processing message', error.message);
            }
        },
    });
};

module.exports = { consumeMessages };

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
