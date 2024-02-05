// controllers/pricingController.js
const Pricing = require('../models/pricingModel'); // Mongoose model
const PricingStrategy = require('../models/PricingStrategy');
exports.updatePricing = async (req, res) => {
    try {
        const { itemId, newPrice } = req.body;
        await Pricing.updateOne({ itemId }, { $set: { price: newPrice } });
        res.json({ message: 'Price updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating price', error: error.message });
    }
};

exports.getPricingStrategies = async (req, res) => {
    try {
        const strategies = await PricingStrategy.find({ isActive: true });
        res.json(strategies.map(strategy => ({
            id: strategy._id,
            name: strategy.name,
            criteria: strategy.criteria,
            actions: strategy.actions,
            isActive: strategy.isActive
        })));
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch pricing strategies' });
    }
};

exports.getPricing = async (req, res) => {
    try {
        const pricing = await Pricing.find({});
        res.json(pricing);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pricing data', error: error.message });
    }
};
