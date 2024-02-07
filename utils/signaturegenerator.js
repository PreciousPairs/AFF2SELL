const crypto = require('crypto');

function generateSignature(consumerId, privateKey, keyVersion, timestamp) {
    const dataToSign = `WM_CONSUMER.ID:${consumerId}\nWM_CONSUMER.INTIMESTAMP:${timestamp}\nWM_SEC.KEY_VERSION:${keyVersion}`;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(dataToSign);
    signer.end();
    return signer.sign(privateKey, 'base64');
}