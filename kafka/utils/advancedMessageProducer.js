const { Kafka } = require('kafkajs');
const logger = require('../utils/logger'); // Custom logger for application-wide logging

class AdvancedMessageProducer {
  constructor(kafkaProducerConfig, dlqTopic) {
    this.kafka = new Kafka(kafkaProducerConfig);
    this.producer = this.kafka.producer();
    this.dlqProducer = this.kafka.producer(); // Separate producer for DLQ
    this.dlqTopic = dlqTopic || 'dead-letter-queue'; // Default DLQ topic name
  }

  async connect() {
    // Connect both main and DLQ producers
    await Promise.all([this.producer.connect(), this.dlqProducer.connect()]);
    logger.info('Kafka Producers connected successfully.');
  }

  async disconnect() {
    // Disconnect both main and DLQ producers
    await Promise.all([this.producer.disconnect(), this.dlqProducer.disconnect()]);
    logger.info('Kafka Producers disconnected successfully.');
  }

  async moveToDLQ(messages) {
    try {
      await this.dlqProducer.send({
        topic: this.dlqTopic,
        messages: messages.map(message => ({ value: JSON.stringify(message) })),
      });
      logger.info(`Moved ${messages.length} message(s) to DLQ: ${this.dlqTopic}.`);
    } catch (error) {
      logger.error('Failed to move message(s) to DLQ:', error);
      // Consider additional fallback error handling here, such as logging to a file or sending alerts
    }
  }

  async sendMessage(topic, messages, retryConfig = { retries: 5, delay: 1000 }) {
    try {
      // Original sendMessage logic...
      await this.producer.send({
        topic,
        messages: messages.map(message => ({ value: JSON.stringify(message) })),
      });
      logger.info(`Message(s) sent to topic ${topic} successfully.`);
    } catch (error) {
      logger.error(`Failed to send message(s) to topic ${topic}:`, error);
      await this.moveToDLQ(messages);
    }
  }

  async retrySendMessage(topic, messages, retryConfig) {
    const { retries, delay } = retryConfig;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
        await this.producer.send({
          topic,
          messages: messages.map(message => ({ value: JSON.stringify(message) })),
        });
        logger.info(`Message(s) sent to topic ${topic} successfully after ${attempt} retries.`);
        break; // Exit loop on successful retry
      } catch (retryError) {
        logger.error(`Retry attempt ${attempt} for topic ${topic} failed:`, retryError);
        if (attempt === retries) {
          logger.error('Max retries reached. Moving message(s) to DLQ.');
          await this.moveToDLQ(messages);
        }
      }
    }
  }
}

module.exports = AdvancedMessageProducer;