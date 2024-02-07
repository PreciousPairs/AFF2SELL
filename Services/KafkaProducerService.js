require('dotenv').config();
const { Kafka, logLevel, CompressionTypes } = require('kafkajs');
const crypto = require('crypto');
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry');
const logger = require('./utils/logger'); // Custom logger for standardized logging

// Kafka Producer Configuration
const kafkaConfig = {
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: true,
    logLevel: logLevel.INFO,
};

// Schema Registry for Avro serialization
const registry = new SchemaRegistry({ host: process.env.SCHEMA_REGISTRY_URL });

class KafkaProducerService {
    constructor() {
        this.kafka = new Kafka(kafkaConfig);
        this.producer = this.kafka.producer({ idempotent: true, transactionalId: 'saas-repricer-producer' });
    }

    async connect() {
        try {
            await this.producer.connect();
            logger.info('Kafka Producer connected successfully.');
        } catch (error) {
            logger.error('Kafka Producer connection failed: ', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            await this.producer.disconnect();
            logger.info('Kafka Producer disconnected successfully.');
        } catch (error) {
            logger.error('Kafka Producer disconnection failed: ', error);
            throw error;
        }
    }

    async sendMessages({ tenantId, messages }) {
        const enrichedMessages = messages.map(msg => ({
            key: msg.key,
            value: JSON.stringify(msg.value),
            headers: { tenantId },
        }));

        try {
            await this.producer.send({
                topic: determineTopicBasedOnContent(messages),
                messages: enrichedMessages,
                compression: CompressionTypes.GZIP,
            });
            logger.info(`Messages sent successfully for tenantId: ${tenantId}`);
        } catch (error) {
            logger.error(`Failed to send messages for tenantId: ${tenantId}`, error);
            throw error;
        }
    }

    // Encryption utility for secure message handling
    encryptMessage(message, secretKey) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
        let encrypted = cipher.update(message);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }

    // Decryption utility for secure message handling
    decryptMessage(encryptedMessage, secretKey) {
        const textParts = encryptedMessage.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    // Send Avro serialized message
    async sendAvroMessage({ tenantId, topic, avroSchemaId, message }) {
        const schema = await registry.getSchema(avroSchemaId);
        const encodedMessage = await registry.encode(avroSchemaId, message);

        try {
            await this.producer.send({
                topic: `${tenantId}-${topic}`,
                messages: [{ value: encodedMessage }],
                compression: CompressionTypes.GZIP,
            });
            logger.info(`Avro message sent successfully for tenantId: ${tenantId}`);
        } catch (error) {
            logger.error(`Failed to send Avro message for tenantId: ${tenantId}`, error);
            throw error;
        }
    }
}

module.exports = KafkaProducerService;