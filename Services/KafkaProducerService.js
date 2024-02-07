require('dotenv').config();
const { Kafka, logLevel, CompressionTypes } = require('kafkajs');
const crypto = require('crypto');
const logger = require('./logger'); // Assuming a custom logger module
const { SchemaRegistry, readAVSCAsync } = require('@kafkajs/confluent-schema-registry');

// Kafka producer configuration with dynamic broker list and SSL
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: { rejectUnauthorized: process.env.KAFKA_SSL_REJECT_UNAUTHORIZED === 'true' },
    logLevel: logLevel.INFO,
});

// Schema Registry for AVRO message handling
const registry = new SchemaRegistry({ host: process.env.SCHEMA_REGISTRY_HOST });

class KafkaProducerService {
    constructor() {
        this.producer = kafka.producer({ idempotent: true });
        this.registry = registry;
    }

    async connect() {
        try {
            await this.producer.connect();
            logger.info('Kafka Producer connected successfully.');
        } catch (error) {
            logger.error('Kafka Producer connection failed:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            logger.info('Kafka Producer disconnected successfully.');
        } catch (error) {
            logger.error('Kafka Producer disconnection failed:', error);
            throw error;
        }
    }

    // Encryption function for message security
    encryptMessage(message, secretKey) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
        let encrypted = cipher.update(message, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    }

    async sendMessages(topic, messages, tenantId) {
        const encryptedMessages = messages.map(msg => ({
            key: msg.key,
            value: this.encryptMessage(JSON.stringify(msg.value), process.env.ENCRYPTION_KEY),
            headers: { tenantId },
        }));

        try {
            await this.producer.send({
                topic,
                messages: encryptedMessages,
                compression: CompressionTypes.GZIP,
            });
            logger.info(`Messages sent successfully to topic: ${topic}`);
        } catch (error) {
            logger.error(`Failed to send messages to topic: ${topic}`, error);
            throw error;
        }
    }

    async sendAvroMessage(topic, message, tenantId) {
        const schema = await readAVSCAsync('./path/to/your/avro/schema.avsc');
        const encodedMessage = await this.registry.encode(schema.id, message);

        try {
            await this.producer.send({
                topic,
                messages: [{
                    value: encodedMessage,
                    headers: { tenantId }
                }],
                compression: CompressionTypes.GZIP,
            });
            logger.info(`AVRO message sent successfully to topic: ${topic}`);
        } catch (error) {
            logger.error(`Failed to send AVRO message to topic: ${topic}`, error);
            throw error;
        }
    }
}

module.exports = KafkaProducerService;