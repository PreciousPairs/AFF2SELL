const { Kafka } = require('kafkajs');
const { checkTenantSubscription } = require('./tenantSubscriptionService');

const kafka = new Kafka({
    clientId: 'subscription-service',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
});

const consumer = kafka.consumer({ groupId: 'subscription-group' });

// Function to consume messages and manage based on tenant subscription
async function manageSubscriptions(topic) {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { tenantId, data } = JSON.parse(message.value.toString());
            const subscription = await checkTenantSubscription(tenantId);

            if (subscription.isValid) {
                // Proceed with processing the data for the tenant
                console.log(`Tenant ${tenantId} with valid subscription processed: `, data);
                // Process data according to tenant's subscription
            } else {
                console.log(`Tenant ${tenantId} subscription invalid or expired. Skipping data: `, data);
                // Handle tenants with invalid or expired subscriptions
            }
        },
    });
}

module.exports = { manageSubscriptions };
