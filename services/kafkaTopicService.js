const dbService = require('../database/dbService'); // Placeholder for actual DB service

async function fetchTopicsToSubscribe() {
    try {
        const topicsConfig = await dbService.getKafkaTopics(); // Fetch Kafka topics configuration
        const topics = topicsConfig.map(config => config.topicName);
        console.log(`Fetched topics for subscription: ${topics.join(', ')}`);
        return topics;
    } catch (error) {
        console.error('Failed to fetch Kafka topics for subscription:', error);
        throw new Error('Error fetching Kafka topics');
    }
}

module.exports = { fetchTopicsToSubscribe };