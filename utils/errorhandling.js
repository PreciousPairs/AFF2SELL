// utils/errorHandling.js

const { sendNotification } = require('./notificationService');

function logError(error, context) {
    console.error('Error occurred:', error);
    // Log error details with context
}

function sendAlert(error, context) {
    const errorMessage = `Error occurred: ${error.message}`;
    sendNotification(errorMessage); // Example: Sending notification to relevant stakeholders
}

async function retryOperation(operation, context) {
    try {
        await operation();
    } catch (error) {
        logError(error, context);
        sendAlert(error, context);
        throw error; // Rethrow error for further handling
    }
}

module.exports = { logError, sendAlert, retryOperation };