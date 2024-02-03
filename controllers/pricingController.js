// controllers/pricingController.js
const Pricing = require('../models/pricingModel'); // Mongoose model

exports.updatePricing = async (req, res) => {
    try {
        const { itemId, newPrice } = req.body;
        await Pricing.updateOne({ itemId }, { $set: { price: newPrice } });
        res.json({ message: 'Price updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating price', error: error.message });
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
