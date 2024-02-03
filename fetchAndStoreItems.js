// fetchAndStoreItems.js
const { MongoClient } = require('mongodb');
const axios = require('axios');
const { authenticateWalmartApi } = require('./auth');

async function fetchAndStoreItems() {
    const accessToken = await authenticateWalmartApi();
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('your_db_name');
    const itemsCollection = db.collection('items');

    let nextPageUrl = 'https://marketplace.walmartapis.com/v3/items';
    while (nextPageUrl) {
        try {
            const response = await axios.get(nextPageUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` },
            });

            if (response.data.items && response.data.items.length > 0) {
                await itemsCollection.insertMany(response.data.items);
                console.log('Items stored in MongoDB');
                nextPageUrl = response.data.nextPage || null;
            } else {
                nextPageUrl = null;
            }
        } catch (error) {
            console.error('Error fetching or storing items:', error);
            nextPageUrl = null;
        }
    }

    await client.close();
}

module.exports = { fetchAndStoreItems };
