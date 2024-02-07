// utils/notificationService.js

function sendNotification(message) {
    // Logic to send notifications, such as emails, SMS, or push notifications
    console.log('Notification sent:', message);
}

function alertAdmin(message) {
    // Logic to alert system administrators or relevant stakeholders
    console.log('Admin alert:', message);
}

module.exports = { sendNotification, alertAdmin };