const { Kafka } = require('kafkajs');
require('dotenv').config();

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

const consumer = kafka.consumer({ groupId: 'subscription-service-group' });

async function consumeTenantSubscriptionUpdates(tenantId) {
    await consumer.connect();
    const tenantTopic = `tenant_${tenantId}_subscription_updates`;

    await consumer.subscribe({ topic: tenantTopic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const subscriptionDetails = JSON.parse(message.value.toString());
            console.log(`Received subscription update for tenant ID: ${tenantId}`, subscriptionDetails);
            // Process subscription update (e.g., update database, send notifications)
        },
    });
}

module.exports = { consumeTenantSubscriptionUpdates };
