// services/marketDataService.js
require('dotenv').config();
const axios = require('axios');
const { generateWalmartApiSignature } = require('../utils/walmartApiUtils');

exports.fetchRealTimeMarketData = async (itemId) => {
    const { signature, timestamp, consumerId, keyVersion } = generateWalmartApiSignature(
        process.env.WM_CONSUMER_ID,
        process.env.PRIVATE_KEY,
        process.env.KEY_VERSION
    );

    try {
        const response = await axios.get(`https://affiliate.api.walmart.com/v3/items/${itemId}`, {
            headers: {
                'WM_SEC.AUTH_SIGNATURE': signature,
                'WM_CONSUMER.ID': consumerId,
                'WM_CONSUMER.INTIMESTAMP': timestamp.toString(),
                'WM_SEC.KEY_VERSION': keyVersion,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch real-time market data from Walmart Affiliate API:', error);
        throw new Error('Market data fetch failed');
    }
};