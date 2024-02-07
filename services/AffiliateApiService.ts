import axios from 'axios';
import crypto from 'crypto'; // Importing the crypto module for cryptographic functionality
import { Logger } from '../utils/logger';

interface Signature {
    signature: string;
    timestamp: string;
    consumerId: string;
    keyVersion: string;
}

class AffiliateApiService {
    private consumerId: string = process.env.WM_CONSUMER_ID || '';
    private privateKey: string = Buffer.from(process.env.PRIVATE_KEY || '', 'base64').toString('ascii');
    private keyVersion: string = process.env.KEY_VERSION || '1';
    private baseUrl: string = 'https://affiliate.api.walmart.com';

    constructor() {
        if (!this.consumerId || !this.privateKey || !this.keyVersion) {
            Logger.error("Walmart Affiliate API credentials are not properly configured.");
            throw new Error("API credentials configuration error.");
        }
    }

    private generateSignature(): Signature {
        const timestamp = Date.now().toString();
        const dataToSign = `WM_CONSUMER.ID:${this.consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${this.keyVersion}`;

        const signer = crypto.createSign('RSA-SHA256');
        signer.update(dataToSign);
        signer.end();

        return {
            signature: signer.sign({ key: this.privateKey, passphrase: '' }, 'base64'),
            timestamp,
            consumerId: this.consumerId,
            keyVersion: this.keyVersion,
        };
    }

    public async fetchItemDetails(itemId: string) {
        Logger.info(`Fetching details for item ID: ${itemId}`);
        try {
            const { signature, timestamp, consumerId, keyVersion } = this.generateSignature();
            const response = await axios.get(`${this.baseUrl}/v3/items/${itemId}`, {
                headers: {
                    'WM_SEC.KEY_VERSION': keyVersion,
                    'WM_CONSUMER.ID': consumerId,
                    'WM_CONSUMER.INTIMESTAMP': timestamp,
                    'WM_SEC.AUTH_SIGNATURE': signature,
                },
            });

            Logger.info(`Successfully fetched details for item ID: ${itemId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                Logger.error(`Walmart API responded with status ${error.response.status} for item ID: ${itemId}`, error);
            } else {
                Logger.error('Failed to fetch item details from Walmart Affiliate API', error);
            }
            throw new Error('Failed to fetch item details');
        }
    }
}

export default new AffiliateApiService();