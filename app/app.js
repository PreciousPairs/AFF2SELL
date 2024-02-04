// app.js
const { consumeMessages } = require('./kafka/consumer');
const { processMessage } = require('./services/messageProcessor'); // Define your message processing logic here

const topic = 'your-topic-name';

consumeMessages(topic, processMessage)
    .then(() => console.log(`Consuming messages from ${topic}`))
    .catch((error) => console.error('Error in Kafka consumer:', error));
