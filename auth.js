// auth.js
const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

let accessToken = '';
let tokenExpiration = 0;

async function authenticateWalmartApi() {
    if (Date.now() < tokenExpiration) {
        return accessToken;
    }

    const clientId = process.env.WALMART_CLIENT_ID;
    const clientSecret = process.env.WALMART_CLIENT_SECRET;
    const authUrl = 'https://marketplace.walmartapis.com/v3/token';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(authUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000 - 30000; // 30 seconds buffer
        return accessToken;
    } catch (error) {
        console.error('Error authenticating with Walmart API:', error);
        throw new Error('Authentication failed');
    }
}

/**
 * Generates the signature for the Walmart Affiliate API request.
 */
function generateSignature(consumerId, privateKey, keyVersion) {
    const timestamp = Date.now().toString();
    const dataToSign = `WM_CONSUMER.ID:${consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${keyVersion}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    signer.end();
    const signature = signer.sign(privateKey, 'base64');
    return signature;
}

module.exports = { authenticateWalmartApi, generateSignature };
