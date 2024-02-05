// /services/pricing/processProductUpdates.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Product = require('../../models/ProductModel'); // Adjust according to your structure

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Kafka Consumer configuration
const kafka = new Kafka({
  clientId: 'pricing-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : null,
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'plain', // Adjust mechanism as needed
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : null,
});

const consumer = kafka.consumer({ groupId: 'pricing-update-group' });

// Function to process incoming product updates
async function processProductUpdates() {
  await consumer.connect();
  console.log('Kafka consumer connected.');

  // Subscribe to topics dynamically if needed. Here's an example to subscribe to a single topic:
  await consumer.subscribe({ topic: 'product-updates', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message from ${topic}:${partition}`);
      const update = JSON.parse(message.value.toString());

      // Assuming update contains productId and newPrice
      const { productId, newPrice } = update;

      // Update the product in the database
      await Product.updateOne({ _id: productId }, { $set: { currentPrice: newPrice } });

      console.log(`Product ${productId} updated with new price: ${newPrice}`);
    },
  });
}

// Execute the function
processProductUpdates().catch(err => console.error('Error in processing product updates:', err));
