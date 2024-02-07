// utils/kafkaConfig.js
require('dotenv').config();

const kafkaConfig = {
  clientId: process.env.KAFKA_CLIENT_ID || 'default-client-id',
  brokers: process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'],
  ssl: !!process.env.KAFKA_SSL,
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'plain', // or 'scram-sha-256', 'scram-sha-512'
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : null,
};

module.exports = kafkaConfig;