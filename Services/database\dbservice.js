// database/dbService.js
const { MongoClient } = require('mongodb');

class DBService {
  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI);
  }

  async connect() {
    await this.client.connect();
  }

  async getKafkaTopics() {
    try {
      const db = this.client.db('yourDatabaseName');
      const topics = await db.collection('kafkaTopics').find({}).toArray();
      return topics.map(topic => topic.name);
    } catch (error) {
      console.error('Error fetching Kafka topics from the database:', error);
      throw error;
    }
  }
}

const dbService = new DBService();
dbService.connect(); // Establish database connection
module.exports = dbService;