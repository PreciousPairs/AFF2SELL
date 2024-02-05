// Require the necessary modules
const { Kafka } = require('kafkajs');
require('dotenv').config();

// Initialize the Kafka client with SSL and SASL configurations if provided
const kafka = new Kafka({
    clientId: 'repricer-subscription-service',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: process.env.KAFKA_SSL === 'true' ? { rejectUnauthorized: true } : undefined,
    sasl: process.env.KAFKA_SASL_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_SASL_USERNAME,
        password: process.env.KAFKA_SASL_PASSWORD
    } : undefined,
});

const producer = kafka.producer();

// Function to publish subscription updates for a specific tenant
async function publishTenantSubscriptionUpdate(tenantId, subscriptionDetails) {
    await producer.connect();

    // Construct a tenant-specific topic for subscription updates
    const tenantTopic = `tenant_${tenantId}_subscription_updates`;

    try {
        await producer.send({
            topic: tenantTopic,
            messages: [{ value: JSON.stringify(subscriptionDetails) }],
        });
        console.log(`Subscription update published for tenant ID: ${tenantId}`);
    } catch (error) {
        console.error(`Failed to publish subscription update for tenant ID: ${tenantId}`, error);
    } finally {
        await producer.disconnect();
    }
}

module.exports = { publishTenantSubscriptionUpdate };
