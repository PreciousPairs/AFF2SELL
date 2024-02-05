const kafka = require('../config/kafkaConfig');

class KafkaProducerService {
    constructor() {
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
        console.log('Kafka Producer connected successfully.');
    }

    async disconnect() {
        await this.producer.disconnect();
        console.log('Kafka Producer disconnected successfully.');
    }

    async sendMessage(topic, messages) {
        try {
            const formattedMessages = messages.map(msg => ({ value: JSON.stringify(msg) }));
            await this.producer.send({ topic, messages: formattedMessages });
            console.log(`Message(s) sent to topic ${topic} successfully.`);
        } catch (error) {
            console.error(`Failed to send message to topic ${topic}`, error);
            throw error;
        }
    }

    // 1. Implement batching to improve throughput
    async sendBatch(messagesBatch) {
        await this.producer.sendBatch(messagesBatch);
        console.log('Batch messages sent successfully.');
    }

    // 2. Retry mechanism for message sending failures
    async sendMessageWithRetry(topic, messages, retryCount = 5) {
        for (let attempt = 0; attempt < retryCount; attempt++) {
            try {
                await this.sendMessage(topic, messages);
                break; // Exit loop on success
            } catch (error) {
                if (attempt < retryCount - 1) {
                    console.log(`Retry attempt ${attempt + 1} for topic ${topic}`);
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
                } else {
                    console.error(`Failed to send message after ${retryCount} attempts`, error);
                    throw error;
                }
            }
        }
    }

    // 3. Support for keyed messages to ensure order
    async sendKeyedMessage(topic, key, message) {
        await this.producer.send({
            topic,
            messages: [{ key: String(key), value: JSON.stringify(message) }],
        });
        console.log(`Keyed message sent to topic ${topic} successfully.`);
    }

    // 4. Dynamic topic creation if not exists
    async ensureTopicExists(topic) {
        const admin = kafka.admin();
        await admin.connect();
        const topics = await admin.listTopics();
        if (!topics.includes(topic)) {
            await admin.createTopics({
                topics: [{ topic }],
                waitForLeaders: true,
            });
            console.log(`Topic ${topic} created successfully.`);
        }
        await admin.disconnect();
    }

    // 5. Message compression for large payloads
    async sendCompressedMessage(topic, messages) {
        await this.producer.send({
            topic,
            messages: messages.map(msg => ({ value: JSON.stringify(msg) })),
            compression: kafka.CompressionTypes.GZIP, // Using GZIP for example
        });
        console.log(`Compressed message sent to topic ${topic} successfully.`);
    }

    // Additional enhancements could include:
    // 6. Transactional messaging support.
    // 7. Implementing a producer pooling mechanism for high-load environments.
    // 8. Adding message encryption for sensitive data.
    // 9. Support for message headers for additional metadata.
    // 10. Custom partitioner for advanced message distribution.
    // 11. High-water mark retrieval for topic offset management.
    // 12. Message serialization and deserialization support.
    // 13. Integration with monitoring tools for producer metrics.
    // 14. Dynamic message routing based on content.
    // 15. Throttling to
