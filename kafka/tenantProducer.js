const { Kafka } = require('kafkajs');

// Initialize Kafka client with SSL if required
const kafka = new Kafka({
    clientId: 'multi-tenant-app',
    brokers: [process.env.KAFKA_BROKER], // Assume broker addresses are stored in environment variables
    ssl: {
        rejectUnauthorized: true,
        ca: [process.env.KAFKA_CA], // Certificate authority for SSL, if applicable
    },
});

const producer = kafka.producer();

// Function to send messages with tenant information
async function sendTenantMessage(tenantId, topic, message) {
    await producer.connect();
    // Ensure the message includes tenantId for multi-tenancy support
    const payload = { tenantId, ...message };
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify(payload) }],
    });
    await producer.disconnect();
}

module.exports = { sendTenantMessage };
