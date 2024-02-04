const { Kafka } = require('kafkajs');

const kafkaClientOptions = {
  clientId: 'saas_repricer',
  brokers: [process.env.KAFKA_BROKER],
  ssl: {
    rejectUnauthorized: true,
  },
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD,
  },
};

const kafka = new Kafka(kafkaClientOptions);

module.exports = kafka;
