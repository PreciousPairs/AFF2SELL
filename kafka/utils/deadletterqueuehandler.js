// utils/deadLetterQueueHandler.js
const { kafkaProducer } = require('./kafkaProducer'); // Assuming you have a Kafka producer utility

exports.moveToDLQ = async (topic, message) => {
    try {
        await kafkaProducer.send({
            topic: `${topic}-dlq`, // Naming convention for DLQ topics
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Message moved to DLQ: ${JSON.stringify(message)}`);
    } catch (error) {
        console.error(`Failed to move message to DLQ: ${error.message}`, error);
    }
};