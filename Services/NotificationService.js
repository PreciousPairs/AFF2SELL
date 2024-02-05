const EmailService = require('./EmailService');
const SmsService = require('./SmsService');
const PushNotificationService = require('./PushNotificationService');
const User = require('../models/User');
const NotificationTemplate = require('../utils/NotificationTemplate');
const NotificationScheduler = require('../utils/NotificationScheduler');
const NotificationLogger = require('../utils/NotificationLogger'); // For logging and analytics

class NotificationService {
    static async sendNotification(userId, notificationType, templateData) {
        // Retrieve user and their preferences
        const user = await User.findById(userId).lean();
        if (!user) {
            console.error('User not found:', userId);
            return;
        }

        // Prepare notification content using templates
        const { title, body } = NotificationTemplate.generate(notificationType, templateData, user.preferences.language);

        // Determine and send notifications based on user preferences
        await Promise.all([
            this.handleEmailNotification(user, title, body),
            this.handleSmsNotification(user, body),
            this.handlePushNotification(user, title, body),
        ]);

        // Log successful notifications for analytics
        NotificationLogger.log(userId, notificationType, templateData);
    }

    static async handleEmailNotification(user, title, body) {
        if (user.preferences.notifications.email) {
            try {
                await EmailService.sendEmail(user.email, title, body);
                console.log(`Email notification sent to ${user.email}`);
            } catch (error) {
                console.error(`Error sending email to ${user.email}`, error);
            }
        }
    }

    static async handleSmsNotification(user, body) {
        if (user.preferences.notifications.sms && user.phone) {
            try {
                await SmsService.sendSms(user.phone, body);
                console.log(`SMS notification sent to ${user.phone}`);
            } catch (error) {
                console.error(`Error sending SMS to ${user.phone}`, error);
            }
        }
    }

    static async handlePushNotification(user, title, body) {
        if (user.preferences.notifications.push) {
            try {
                await PushNotificationService.sendPush(user._id, { title, body });
                console.log(`Push notification sent to user ID ${user._id}`);
            } catch (error) {
                console.error(`Error sending push notification to user ID ${user._id}`, error);
            }
        }
    }

    // Batch and scheduled notifications
    static async sendBatchNotifications(userIds, notificationType, templateData) {
        NotificationScheduler.processBatch(userIds, async (userId) => {
            await this.sendNotification(userId, notificationType, templateData);
        });
    }

    static scheduleNotification(userId, notificationType, templateData, dateTime) {
        NotificationScheduler.schedule(userId, notificationType, templateData, dateTime, this.sendNotification);
    }
}

module.exports = NotificationService;
