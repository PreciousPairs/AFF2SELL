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

// Decrypt encrypted data
function decryptData(encryptedData) {
    const decipher = crypto.createDecipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Generate a hash for given data
function generateHash(data) {
    return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

// Generate a random string of given length
function generateRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Verify if provided data matches the given hash
function verifyHash(data, hash) {
    const computedHash = generateHash(data);
    return computedHash === hash;
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function validatePassword(password) {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

module.exports = { ssl, encryptData, decryptData, generateHash, generateRandomString, verifyHash, validateEmail, validatePassword };