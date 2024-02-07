// services/deadLetterQueueService.js
const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

class DLQService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'dlq-service',
      brokers: [process.env.KAFKA_BROKER]
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    await this.producer.connect();
  }

  async moveToDLQ(message) {
    try {
      await this.producer.send({
        topic: 'dead-letter-queue',
        messages: [{ value: JSON.stringify(message) }]
      });
      logger.info(`Moved message to DLQ: ${JSON.stringify(message)}`);
    } catch (error) {
      logger.error('Failed to move message to DLQ:', error);
    }
  }
}

const dlqService = new DLQService();
dlqService.connect(); // Initialize DLQ producer connection
module.exports = dlqService;