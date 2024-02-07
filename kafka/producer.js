const { Kafka } = require('kafkajs');

// Create a Kafka instance with broker configuration
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['kafka1:9092', 'kafka2:9092']
});

// Create a producer instance
const producer = kafka.producer();

// Function to produce a message to a Kafka topic
const produceMessage = async (topic, message) => {
    try {
        // Connect to the Kafka broker
        await producer.connect();

        // Send the message to the specified topic
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });

        // Disconnect the producer
        await producer.disconnect();
    } catch (error) {
        console.error('Error producing message:', error);
    }
};

module.exports = { produceMessage };