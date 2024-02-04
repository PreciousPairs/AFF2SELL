const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Load SSL certificates for Kafka SSL configuration
const ssl = {
    rejectUnauthorized: true,
    ca: [fs.readFileSync(path.join(__dirname, 'ca.pem'), 'utf-8')],
    key: fs.readFileSync(path.join(__dirname, 'service.key'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, 'service.cert'), 'utf-8'),
};

// Encrypt sensitive data before storing in the database
function encryptData(data) {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

module.exports = { ssl, encryptData };
