// utils/gracefulShutdown.js

function gracefulShutdown(producer, logger) {
    process.on('SIGINT', async () => {
        logger.info('SIGINT signal received. Initiating graceful shutdown...');
        await producer.disconnect();
        logger.info('Kafka producer disconnected.');
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        logger.info('SIGTERM signal received. Initiating graceful shutdown...');
        await producer.disconnect();
        logger.info('Kafka producer disconnected.');
        process.exit(0);
    });
}

module.exports = { gracefulShutdown };