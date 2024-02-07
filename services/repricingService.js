// services/repricingService.js
const { fetchHistoricalPricingData, calculateOptimalPrice } = require('./analytics/pricingDataAnalysis');
const { fetchRealTimeMarketData } = require('./external/marketDataService');
const productService = require('./database/productService'); // Assume this manages product data operations
const kafkaService = require('./messaging/kafkaService'); // For publishing price update events
const { logError, sendAlert, retryOperation } = require('../utils/errorHandling');
const logger = require('../utils/logger'); // Custom logger for structured logging

async function applyDynamicRepricingWithMarketData(productId) {
    const context = { productId };
    try {
        // Fetch real-time competitor data and historical pricing
        const [realTimeData, historicalData] = await Promise.all([
            fetchRealTimeMarketData(productId),
            fetchHistoricalPricingData(productId),
        ]);

        // Determine the optimal price based on analysis
        const optimalPrice = calculateOptimalPrice(realTimeData.competitorPrice, historicalData);

        // Update the product price in the database
        await retryOperation(() => productService.updateProductPrice(productId, optimalPrice), context);

        // Log successful price update
        logger.info(`Product ID ${productId} price updated to ${optimalPrice} based on dynamic repricing.`);

        // Publish price update event to Kafka for downstream processing
        await retryOperation(() => kafkaService.publishPriceUpdate(productId, optimalPrice), context);
        logger.info(`Published price update for Product ID ${productId} to Kafka.`);
    } catch (error) {
        logError(error, context);
        sendAlert(error, context);
        logger.error(`Error applying dynamic repricing for Product ID ${productId}:`, error);
        // Consider implementing specific recovery or fallback strategies here
    }
}

module.exports = { applyDynamicRepricingWithMarketData };