const { Kafka } = require('kafkajs');
const kafka = new Kafka({
const kafkaClientOptions = {
  clientId: 'saas_repricer',
  brokers: JSON.parse(process.env.KAFKA_BROKERS), // Expected as a JSON array
  ssl: true,
  sasl: {
    mechanism: 'plain', // or scram-sha-256, scram-sha-512
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD
  }
};
const kafka = new Kafka(kafkaClientOptions);
