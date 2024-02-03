// fetchAndStoreItems.js
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { authenticateWalmartApi, generateSignature } = require('./auth');

async function fetchAndStoreItems() {
    const accessToken = await authenticateWalmartApi();
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('your_db_name');
    const itemsCollection = db.collection('items');

    // Assuming the use of Affiliate API for item lookup
    const consumerId = process.env.WM_CONSUMER_ID; // From environment variable
    const privateKey = process.env.PRIVATE_KEY; // Ensure this is securely managed
    const keyVersion = "2"; // Example key version
    const signature = generateSignature(consumerId, privateKey, keyVersion);
    const affiliateApiUrl = `https://developer.api.walmart.com/api-proxy/service/affil/product/v2/items`;

    try {
        const response = await axios.get(`${affiliateApiUrl}?publisherId=yourPublisherId&callback=foo`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'WM_SEC.KEY_VERSION': keyVersion,
                'WM_CONSUMER.ID': consumerId,
                'WM_CONSUMER.INTIMESTAMP': Date.now().toString(),
                'WM_SEC.AUTH_SIGNATURE': signature,
            },
        });

        if (response.data.items && response.data.items.length > 0) {
            await itemsCollection.insertMany(response.data.items);
            console.log('Items stored in MongoDB');
        }
    } catch (error) {
        console.error('Error fetching or storing items:', error);
    } finally {
        await client.close();
    }
}

module.exports = { fetchAndStoreItems };
