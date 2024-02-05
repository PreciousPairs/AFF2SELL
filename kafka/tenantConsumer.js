const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'multi-tenant-app',
    brokers: [process.env.KAFKA_BROKER],
    ssl: {
        rejectUnauthorized: true,
        ca: [process.env.KAFKA_CA],
    },
});

const consumer = kafka.consumer({ groupId: 'multi-tenant-group' });

// Function to consume messages and process based on tenantId
async function consumeTenantMessages(topic) {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const payload = JSON.parse(message.value.toString());
            const tenantId = payload.tenantId;
            // Process the message based on tenantId
            console.log(`Processing message for tenant ${tenantId}: `, payload);
            // Add logic to handle the message per tenant requirements
        },
    });
}

module.exports = { consumeTenantMessages };
