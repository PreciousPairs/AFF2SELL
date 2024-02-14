require('dotenv').config();
const axios = require('axios');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const winston = require('winston'); // For structured logging

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'competitor-data-fetch.log' }),
  ],
});

// Signature generation for Walmart Affiliate API authentication
function generateSignature(consumerId, privateKey, keyVersion, timestamp) {
    const dataToSign = `WM_CONSUMER.ID:${consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${keyVersion}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    signer.end();
    return signer.sign(privateKey, 'base64');
}

async function fetchCompetitorPricesAndShippingRates(itemId) {
    const timestamp = Date.now().toString();
    const signature = generateSignature(
        process.env.WM_CONSUMER_ID,
        process.env.PRIVATE_KEY,
        process.env.KEY_VERSION,
        timestamp
    );

    const affiliateApiUrl = `https://affiliate.api.walmart.com/v3/items/${itemId}`;

    try {
        await MongoClient.connect(process.env.MONGODB_URI, (err, client) => {
            if (err) {
                logger.error('Database connection failed', { error: err });
                return;
            }
            const db = client.db(process.env.DB_NAME);
            const competitorDataCollection = db.collection("competitor_data");

            axios.get(affiliateApiUrl, {
                headers: {
                    'WM_SEC.KEY_VERSION': process.env.KEY_VERSION,
                    'WM_CONSUMER.ID': process.env.WM_CONSUMER_ID,
                    'WM_CONSUMER.INTIMESTAMP': timestamp,
                    'WM_SEC.AUTH_SIGNATURE': signature,
                },
            }).then(response => {
                const { id, salePrice, standardShipRate, name, categoryPath } = response.data.item;
                competitorDataCollection.updateOne(
                    { itemId: id },
                    { $set: { salePrice, standardShipRate, name, categoryPath, updatedAt: new Date() } },
                    { upsert: true }
                ).then(() => {
                    logger.info(`Competitor data for item ${id} successfully updated.`);
                }).catch(dbError => {
                    logger.error('Error updating MongoDB', { error: dbError });
                });
            }).catch(apiError => {
                logger.error('Error fetching data from Affiliate API', { error: apiError });
            }).finally(() => {
                client.close();
            });
        });
    } catch (error) {
        logger.error('Unexpected error occurred', { error: error });
    }
}

module.exports = { fetchCompetitorPricesAndShippingRates };
