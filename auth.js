// auth.js
const axios = require('axios');
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

module.exports = { authenticateWalmartApi };
