// utils/retryHandler.js
const logger = require('./logger'); // Assuming a custom logger module

exports.retryOperation = async (operation, retries = 5) => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === retries - 1) throw error;
      attempt++;
      logger.warn(`Retry ${attempt} failed, trying again...`);
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt)); // Exponential back-off
    }
  }
};