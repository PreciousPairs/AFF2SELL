const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config();

// Seller API Credentials
let sellerAccessToken = '';
let sellerTokenExpiration = 0;

// Affiliate API Credentials
const consumerId = process.env.WM_CONSUMER_ID;
// Decode privateKey assuming it's base64 encoded in the environment variable
const privateKey = Buffer.from(process.env.PRIVATE_KEY, 'base64').toString('ascii');
const keyVersion = process.env.KEY_VERSION;

// Refresh Interval and Retry Configurations
const refreshTokenInterval = 60000; // Refresh token every minute for both APIs
const maxRetryAttempts = 3;
const retryDelay = 2000; // 2 seconds delay between retries

// Utility function for delay with exponential backoff
const delay = (attempt) => new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));

// Authenticate with Walmart Seller API with Exponential Backoff Retry Strategy
async function authenticateSellerApi(attempt = 0) {
    if (Date.now() < sellerTokenExpiration) return sellerAccessToken;
    if (attempt >= maxRetryAttempts) throw new Error('Maximum Seller API authentication attempts exceeded.');

    const clientId = process.env.WALMART_SELLER_CLIENT_ID;
    const clientSecret = process.env.WALMART_SELLER_CLIENT_SECRET;
    const authUrl = 'https://marketplace.walmartapis.com/v3/token';
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(authUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        sellerAccessToken = response.data.access_token;
        sellerTokenExpiration = Date.now() + response.data.expires_in * 1000 - 30000;
        // Re-authenticate before the token expires
        setTimeout(authenticateSellerApi, refreshTokenInterval);
    } catch (error) {
        console.error(`Attempt ${attempt + 1} - Seller API Auth Error:`, error.message);
        await delay(attempt);
        return authenticateSellerApi(attempt + 1);
    }
}

// Generate Signature for Walmart Affiliate API Requests
// Automatically refreshes the signature based on operational requirements
function generateAffiliateSignature() {
    const timestamp = Date.now();
    const dataToSign = `WM_CONSUMER.ID:${consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${keyVersion}`;

    try {
        const signer = crypto.createSign('RSA-SHA256');
        signer.update(dataToSign);
        signer.end();
        return {
            signature: signer.sign(privateKey, 'base64'),
            timestamp,
            consumerId,
            keyVersion,
        };
    } catch (error) {
        console.error('Affiliate API Signature Generation Error:', error);
        throw new Error('Failed to generate signature for Affiliate API');
    }
}

// Initializes the authentication process for the Seller API upon script load
authenticateSellerApi();

module.exports = {
    getAccessToken: () => sellerAccessToken, // Accessor for Seller API Token
    generateAffiliateSignature, // Method for Affiliate API Signature
};
