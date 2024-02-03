// fetchCompetitorPrices.js
const axios = require('axios');
const { MongoClient } = require('mongodb');
const { authenticateWalmartApi } = require('./auth');

async function fetchAndStoreCompetitorPricesAndShippingRates(itemId) {
    const accessToken = await authenticateWalmartApi();
    const affiliateApiUrl = `https://marketplace.walmartapis.com/v3/items/${itemId}`;

    try {
        const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db("your_db_name");
        const competitorDataCollection = db.collection("competitor_data");

        const response = await axios.get(affiliateApiUrl, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        const { salePrice, standardShipRate, name, categoryPath } = response.data;
        await competitorDataCollection.updateOne(
            { itemId },
            { $set: { salePrice, standardShipRate, name, categoryPath, updatedAt: new Date() } },
            { upsert: true }
        );

        console.log(`Competitor data for item ${itemId} updated.`);
    } catch (error) {
        console.error(`Error fetching competitor data for item ${itemId}:`, error);
    } finally {
        if (client) await client.close();
    }
}

module.exports = { fetchAndStoreCompetitorPricesAndShippingRates };
