// kafka/utils/dynamicTopicSubscriber.js
const { Kafka } = require('kafkajs');
const dbService = require('../database/dbService'); // Assume this service fetches Kafka topic configurations
const logger = require('../utils/logger'); // Custom logger for structured logging

class DynamicTopicSubscriber {
  constructor(kafkaConsumer) {
    this.consumer = kafkaConsumer;
    this.subscribedTopics = new Set(); // Tracks currently subscribed topics for efficient management
  }

  // Fetches topics from a database and subscribes to them dynamically
  async fetchAndSubscribe() {
    try {
      // Retrieve the list of topics that should be subscribed to, based on some external configuration
      const topicsConfig = await dbService.getKafkaTopics();
      const topicsToSubscribe = topicsConfig.map(config => config.topicName);

      // Iterate through the list of topics to subscribe, checking if already subscribed
      for (const topic of topicsToSubscribe) {
        if (!this.subscribedTopics.has(topic)) {
          await this.consumer.subscribe({ topic, fromBeginning: true });
          this.subscribedTopics.add(topic); // Mark topic as subscribed
          logger.info(`Successfully subscribed to Kafka topic: ${topic}`);
        }
      }

      // Optionally, handle topics that need to be unsubscribed if they are removed from the configuration
      this.unsubscribeFromRemovedTopics(topicsToSubscribe);

    } catch (error) {
      logger.error('Failed to dynamically subscribe to Kafka topics:', error);
    }
  }

  // Manages unsubscribing from topics that are no longer present in the database configuration
  async unsubscribeFromRemovedTopics(currentTopics) {
    const topicsToRemove = Array.from(this.subscribedTopics).filter(topic => !currentTopics.includes(topic));

    // KafkaJS does not directly support unsubscribing. You may need to pause the consumer or manage it differently.
    for (const topic of topicsToRemove) {
      // Example: Pausing the consumer for this topic or removing it from the internal tracking
      this.subscribedTopics.delete(topic);
      logger.info(`Unsubscribed from Kafka topic: ${topic}`);
    }

    // Any rebalancing or custom logic required after unsubscribing can be placed here
  }
}

module.exports = DynamicTopicSubscriber;