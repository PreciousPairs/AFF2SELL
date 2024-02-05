const Product = require('../models/Product');
const PricingStrategy = require('../models/PricingStrategy');
const { fetchExternalMarketData } = require('../utils/externalMarketData');
const { predictOptimalPrice } = require('../services/machineLearningService');

exports.evaluatePricingStrategies = async () => {
  const strategies = await PricingStrategy.find({ isActive: true });
  for (const strategy of strategies) {
    const products = await Product.find({});

    for (const product of products) {
      // Fetch external market data for the product
      const marketData = await fetchExternalMarketData(product.id);
      
      // Predict optimal price based on market data and historical sales
      const predictedOptimalPrice = await predictOptimalPrice(product.id, marketData);

      // Evaluate if product meets the strategy's criteria
      let adjustedPrice = product.currentPrice;
      if (product.stock < strategy.criteria.stockThreshold) {
        adjustedPrice *= (1 + strategy.actions.priceIncreasePercentage / 100);
      }

      // Adjust price based on competitor pricing
      if (marketData.competitorPrice < product.currentPrice) {
        adjustedPrice *= (1 - strategy.actions.priceDecreasePercentage / 100);
      }

      // Apply event-based pricing adjustments
      if (strategy.criteria.event && marketData.event === strategy.criteria.event) {
        adjustedPrice *= (1 + strategy.actions.eventPriceAdjustmentPercentage / 100);
      }

      // Ensure the adjusted price does not fall below the cost or exceed the maximum threshold
      adjustedPrice = Math.max(product.costPrice * (1 + strategy.actions.minimumProfitMargin / 100), adjustedPrice);
      adjustedPrice = Math.min(adjustedPrice, product.maximumPrice);

      // Compare with predicted optimal price and choose the best one
      product.currentPrice = Math.min(adjustedPrice, predictedOptimalPrice);

      await product.save();
    }
  }
};
