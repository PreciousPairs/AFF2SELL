const EmailService = require('./EmailService');
const SmsService = require('./SmsService'); // Assuming you have this service
const PushNotificationService = require('./PushNotificationService'); // Assuming you have this service

class NotificationService {
    // Send email notification
    static async sendEmailNotification(to, subject, htmlContent) {
        try {
            await EmailService.sendEmail({ to, subject, html: htmlContent });
            console.log(`Email notification sent successfully to ${to}`);
        } catch (error) {
            console.error(`Failed to send email notification to ${to}`, error);
            throw error;
        }
    }

    // Send SMS notification
    static async sendSmsNotification(to, message) {
        try {
            await SmsService.sendSms(to, message); // Assuming SmsService has a sendSms method
            console.log(`SMS notification sent successfully to ${to}`);
        } catch (error) {
            console.error(`Failed to send SMS notification to ${to}`, error);
            throw error;
        }
    }

    // Send Push notification
    static async sendPushNotification(userId, title, body) {
        try {
            await PushNotificationService.sendPush(userId, { title, body }); // Assuming PushNotificationService has a sendPush method
            console.log(`Push notification sent successfully to user ID: ${userId}`);
        } catch (error) {
            console.error(`Failed to send push notification to user ID: ${userId}`, error);
            throw error;
        }
    }
}

module.exports = NotificationService;
