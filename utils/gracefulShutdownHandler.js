const { logInfo, logError } = require('./logger');

module.exports = (services, serviceName) => {
    const shutdown = async () => {
        logInfo(`${serviceName} is initiating a graceful shutdown.`);
        try {
            await Promise.all(services.map(service => service.disconnect()));
            logInfo(`${serviceName} has successfully disconnected.`);
        } catch (error) {
            logError(`Error during ${serviceName} shutdown:`, error);
        } finally {
            process.exit(0);
        }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
};