// kafka/utils/dynamicTopicSubscriber.js
const { Kafka } = require('kafkajs');
const dbService = require('../database/dbService'); // Service to fetch Kafka topic configurations
const logger = require('../utils/logger'); // Custom logging utility

class DynamicTopicSubscriber {
  constructor(kafkaConsumer) {
    this.consumer = kafkaConsumer;
    this.subscribedTopics = new Set(); // Track currently subscribed topics
  }

  async fetchAndSubscribe() {
    try {
      const topicsToSubscribe = await dbService.fetchTopicsForSubscription();

      // Determine new topics to subscribe to (not already subscribed)
      const newTopics = topicsToSubscribe.filter(topic => !this.subscribedTopics.has(topic));

      // Subscribe to new topics
      for (const topic of newTopics) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
        this.subscribedTopics.add(topic); // Add to the set of subscribed topics
        logger.info(`Subscribed to Kafka topic: ${topic}`);
      }

      // Log successfully subscribed topics
      logger.info(`Current subscribed topics: ${Array.from(this.subscribedTopics).join(', ')}`);

      // Optionally: Unsubscribe from topics no longer in the configuration
      this.handleTopicUnsubscription(topicsToSubscribe);

    } catch (error) {
      logger.error('Failed to subscribe to dynamic topics:', error);
    }
  }

  async handleTopicUnsubscription(topicsToSubscribe) {
    // Identify topics to unsubscribe from
    const topicsToUnsubscribe = Array.from(this.subscribedTopics).filter(topic => !topicsToSubscribe.includes(topic));

    for (const topic of topicsToUnsubscribe) {
      // KafkaJS does not support direct unsubscribe. Handle this according to your application logic.
      // For example, pause consuming messages from this topic or adjust your application's behavior.
      this.subscribedTopics.delete(topic);
      logger.info(`Unsubscribed from Kafka topic: ${topic}`);
    }

    // Rebalance consumer groups or implement custom logic as needed after unsubscribing
  }
}

module.exports = DynamicTopicSubscriber;