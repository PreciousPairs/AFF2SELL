// utils/dynamicTopicSubscriber.js
const { kafkaConsumer } = require('./kafkaConsumer'); // Import the Kafka consumer utility
const dbService = require('../database/dbService'); // Simulate fetching topic subscriptions from a database

/**
 * Subscribes to Kafka topics dynamically based on configurations stored in a database.
 * This allows for flexible topic subscriptions that can be updated without redeploying the service.
 */
exports.subscribeToDynamicTopics = async () => {
    try {
        // Fetch the list of topics to subscribe to from the database service
        const topicsToSubscribe = await dbService.fetchTopicsForSubscription();

        // Subscribe to each topic using the Kafka consumer
        await Promise.all(
            topicsToSubscribe.map(async (topic) => {
                await kafkaConsumer.subscribe({ topic, fromBeginning: true });
                console.log(`Successfully subscribed to Kafka topic: ${topic}`);
            })
        );

        console.log(`Subscribed to topics: ${topicsToSubscribe.join(', ')}`);
    } catch (error) {
        // Log and handle errors encountered during the subscription process
        console.error('Failed to subscribe to dynamic topics:', error);
    }
};