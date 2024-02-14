const axios = require('axios');
const { MongoClient } = require('mongodb');
const { generateSignature } = require('./auth'); // Ensure this handles Affiliate API signature generation

async function fetchCompetitorPricesAndShippingRates(itemId) {
    // Generate the authentication headers required by the Walmart Affiliate API
    const timestamp = Date.now().toString();
    const signature = generateSignature(
        process.env.WM_CONSUMER_ID,
        process.env.PRIVATE_KEY, // Ensure the private key is correctly formatted for signature generation
        process.env.KEY_VERSION,
        timestamp
    );

    // Define the Affiliate API URL, adjusting parameters as necessary for your use case
    const affiliateApiUrl = `https://affiliate.api.walmart.com/v3/items/${itemId}`;

    try {
        // Establish a connection to MongoDB
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db("your_db_name"); // Replace with your actual database name
        const competitorDataCollection = db.collection("competitor_data");

        // Fetch data from the Affiliate API
        const response = await axios.get(affiliateApiUrl, {
            headers: {
                'WM_SEC.KEY_VERSION': process.env.KEY_VERSION,
                'WM_CONSUMER.ID': process.env.WM_CONSUMER_ID,
                'WM_CONSUMER.INTIMESTAMP': timestamp,
                'WM_SEC.AUTH_SIGNATURE': signature,
            },
        });

        // Example response handling - adjust according to the actual API response structure
        const { salePrice, standardShipRate, name, categoryPath } = response.data;
        await competitorDataCollection.updateOne(
            { itemId },
            { $set: { salePrice, standardShipRate, name, categoryPath, updatedAt: new Date() } },
            { upsert: true }
        );

        console.log(`Competitor data for item ${itemId} updated.`);
    } catch (error) {
        console.error(`Error fetching competitor data for item ${itemId}:`, error);
    }
}

module.exports = { fetchCompetitorPricesAndShippingRates };
