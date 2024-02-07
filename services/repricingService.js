// services/repricingService.js
const { fetchHistoricalPricingData, calculateOptimalPrice } = require('./pricingDataAnalysis');
const { fetchRealTimeMarketData } = require('./marketDataService');
const { updateProductPriceInDatabase } = require('./databaseService'); // Handles database operations
const { publishPriceUpdate } = require('./kafkaService'); // Publishes price updates to Kafka

exports.applyDynamicRepricingWithMarketData = async (productId) => {
    try {
        // Fetch real-time competitor data and historical pricing
        const competitorData = await fetchRealTimeMarketData(productId);
        const historicalPricing = await fetchHistoricalPricingData(productId);

        // Calculate optimal price based on competitor and historical data
        const { newPrice } = calculateOptimalPrice({
            competitorPricing: competitorData.salePrice,
            historicalPricing,
        });

        // Update product price in the database
        await updateProductPriceInDatabase(productId, newPrice);
        console.log(`Updated optimal price for product ID ${productId} in database: ${newPrice}`);

        // Publish the price update event to Kafka for downstream processing
        await publishPriceUpdate({ productId, newPrice });
        console.log(`Published new price for product ID ${productId} to Kafka: ${newPrice}`);
    } catch (error) {
        console.error(`Error applying dynamic repricing for product ID ${productId}:`, error);
        // Implement error handling strategy, such as logging, alerting, or retrying
    }
};