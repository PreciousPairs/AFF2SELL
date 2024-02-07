const logger = require('./logger'); // Custom logger module for structured logging

// This function attempts to reprocess a message with a specified retry limit.
// If processing fails after all retries, the message is moved to a DLQ.
async function handleProcessingError(processFunction, message, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            // Attempt to process the message
            await processFunction(message);
            logger.info(`Message processed successfully on attempt ${attempt + 1}: ${JSON.stringify(message)}`);
            return; // Exit the loop and function upon successful processing
        } catch (error) {
            attempt++;
            logger.warn(`Processing attempt ${attempt} failed: ${error.message}`, { message });

            // Check if max retries have been reached
            if (attempt >= maxRetries) {
                logger.error(`Max retries reached, moving message to DLQ: ${JSON.stringify(message)}`);
                await moveToDLQ(message); // Move the message to a DLQ for further investigation
                break; // Exit the loop after moving the message to DLQ
            }
        }
    }
}

// Export the error handling function for use in message processing scripts
module.exports = { handleProcessingError };