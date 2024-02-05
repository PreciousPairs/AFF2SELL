const PricingStrategy = require('../models/PricingStrategy');

exports.createPricingStrategy = async (strategyData) => {
  if (!strategyData.name || !strategyData.criteria || !strategyData.actions) {
    throw new Error('Missing required fields');
  }
  const strategy = new PricingStrategy(strategyData);
  await strategy.save();
  return strategy;
};

exports.updatePricingStrategy = async (id, strategyData) => {
  const strategy = await PricingStrategy.findById(id);
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  Object.assign(strategy, strategyData);
  await strategy.save();
  return strategy;
};

exports.deletePricingStrategy = async (id) => {
  const strategy = await PricingStrategy.findByIdAndDelete(id);
  if (!strategy) {
    throw new Error('Strategy not found');
  }
  return strategy;
};
