// utils/gracefulShutdown.js
const { consumer } = require('../kafka/consumer');

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing Kafka consumer');
    await consumer.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing Kafka consumer');
    await consumer.disconnect();
    process.exit(0);
});
