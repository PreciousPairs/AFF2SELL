const logger = require('./logger'); // Import the logger configured earlier
const { moveToDLQ } = require('../services/deadLetterQueueService'); // Assume a service for handling DLQ

async function handleProcessingError(priceInfo, error) {
    logger.error(`Error processing message: ${JSON.stringify(priceInfo)}`, error);

    const maxRetries = 3;
    let attempt = 0;
    let success = false;

    while (attempt < maxRetries && !success) {
        try {
            await processCompetitorPrice(priceInfo); // Assume an asynchronous function
            logger.info(`Successful processing after retry for product ID: ${priceInfo.productId}`);
            success = true; // Mark as success to exit loop
        } catch (retryError) {
            attempt++;
            logger.warn(`Retry ${attempt} for product ID: ${priceInfo.productId} failed. Error: ${retryError.message}`);
        }
    }

    if (!success) {
        logger.error(`Max retries reached for product ID: ${priceInfo.productId}. Moving to DLQ.`);
        await moveToDLQ(priceInfo); // Function to move the message to a Dead Letter Queue for further investigation
    }
}

module.exports = { handleProcessingError };