// helpers/headerValidationHelper.js

/**
 * Validates the presence and format of required Walmart Affiliate API request headers.
 * @param {Object} headers - The request headers.
 * @throws {Error} If any required header is missing or invalid.
 */
exports.validateAPIRequestHeaders = (headers) => {
    const requiredHeaders = ['WM_SEC.KEY_VERSION', 'WM_CONSUMER.ID', 'WM_CONSUMER.INTIMESTAMP', 'WM_SEC.AUTH_SIGNATURE'];
    const missingHeaders = requiredHeaders.filter(header => !headers[header]);
    
    if (missingHeaders.length) {
        throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    if (!/^\d+$/.test(headers['WM_CONSUMER.INTIMESTAMP'])) {
        throw new Error('WM_CONSUMER.INTIMESTAMP must be a valid Unix epoch timestamp in milliseconds.');
    }

    // Ensure the timestamp is within an acceptable range to avoid "timestamp expired" errors.
    if (!isTimestampFresh(headers['WM_CONSUMER.INTIMESTAMP'])) {
        throw new Error('WM_CONSUMER.INTIMESTAMP expired or out of acceptable range.');
    }

    // Here, you could add more sophisticated checks, such as validating the signature's format if necessary.
};

/**
 * Checks if the provided timestamp is within the acceptable range of current time.
 * @param {string} timestamp - The Unix epoch timestamp in milliseconds.
 * @returns {boolean} Whether the timestamp is within the acceptable range.
 */
const isTimestampFresh = (timestamp) => {
    const requestTime = new Date(parseInt(timestamp, 10));
    const currentTime = new Date();
    // Allow a 5-minute window; adjust as necessary
    return Math.abs(currentTime - requestTime) / 60000 <= 5;
};