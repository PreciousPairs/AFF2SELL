// /services/pricing/sendProductUpdates.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const mongoose = require('mongoose');
const Product = require('../../models/ProductModel'); // Adjust according to your structure
const TenantSettings = require('../../models/TenantSettingsModel'); // Adjust according to your structure

// Initialize MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// Kafka Producer configuration
const kafka = new Kafka({
  clientId: 'pricing-service',
  brokers: process.env.KAFKA_BROKERS.split(','),
  ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : null,
  sasl: process.env.KAFKA_SASL_USERNAME ? {
    mechanism: 'plain', // Assuming 'plain' but adjust as needed
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD,
  } : null,
});

const producer = kafka.producer();

// Main function to fetch product details and send updates
async function fetchAndSendProductUpdates() {
  await producer.connect();
  
  // Retrieve all active tenants
  const activeTenants = await TenantSettings.find({ isActive: true });

  for (let tenant of activeTenants) {
    // Retrieve all products for the tenant
    const products = await Product.find({ tenantId: tenant.tenantId });

    for (let product of products) {
      // Construct the message payload
      const payload = {
        productId: product._id.toString(),
        currentPrice: product.currentPrice,
        // Additional product details can be added here
      };

      // Send the product update to the designated Kafka topic
      await producer.send({
        topic: tenant.kafkaTopicForUpdates, // Ensure this field exists in your TenantSettings model
        messages: [{ value: JSON.stringify(payload) }],
      });

      console.log(`Product update for ${product._id} sent to ${tenant.kafkaTopicForUpdates}`);
    }
  }

  await producer.disconnect();
  console.log('Kafka producer disconnected.');
}

// Execute the function
fetchAndSendProductUpdates().catch(err => console.error('Error in sending product updates:', err));
