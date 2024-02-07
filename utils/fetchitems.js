require('dotenv').config();
const axios = require('axios');
const { generateSignature } = require('./signatureGenerator');

async function fetchItemData(itemIds) {
    const timestamp = Date.now();
    const signature = generateSignature(process.env.WM_CONSUMER_ID, process.env.PRIVATE_KEY, process.env.KEY_VERSION, timestamp);

    const headers = {
        'WM_SEC.AUTH_SIGNATURE': signature,
        'WM_CONSUMER.ID': process.env.WM_CONSUMER_ID,
        'WM_CONSUMER.INTIMESTAMP': timestamp.toString(),
        'WM_SEC.KEY_VERSION': process.env.KEY_VERSION,
    };

    const url = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items?ids=${itemIds.join(',')}&publisherId=${process.env.PUBLISHER_ID}`;

    try {
        const response = await axios.get(url, { headers });
        return response.data.items;
    } catch (error) {
        console.error('Error fetching item data:', error);
        throw new Error('Failed to fetch item data');
    }
}