module.exports = function(consumerOrProducer, logger, serviceName) {
    const shutdown = async () => {
        logger.info(`${serviceName} is shutting down.`);
        try {
            await consumerOrProducer.disconnect();
            logger.info(`${serviceName} successfully disconnected.`);
        } catch (error) {
            logger.error(`Error during ${serviceName} shutdown:`, error);
        } finally {
            process.exit(0);
        }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
};