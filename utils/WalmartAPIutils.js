// utils/walmartApiUtils.js
const axios = require('axios');
const crypto = require('crypto');

exports.generateWalmartApiSignature = (consumerId, privateKey, keyVersion) => {
    const timestamp = Date.now();
    const dataToSign = `WM_CONSUMER.ID:${consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${keyVersion}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    signer.end();
    const signature = signer.sign(privateKey, 'base64');
    return { signature, timestamp, consumerId, keyVersion };
};