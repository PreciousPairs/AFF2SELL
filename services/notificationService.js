const { sendEmail, sendSMS, pushNotification } = require('../utils/notificationUtils');
const User = require('../models/User');
const { getTemplateByKey } = require('./templateService');

exports.sendNotification = async (templateKey, userCriteria = {}) => {
    const template = await getTemplateByKey(templateKey);
    const users = await User.find(userCriteria);

    users.forEach(user => {
        const { preferences } = user;
        template.channels.forEach(channel => {
            if (preferences.notifications[channel]) {
                const message = template.message; // In practice, you might want to personalize this message.
                switch (channel) {
                    case 'email':
                        sendEmail(user.email, template.title, message);
                        break;
                    case 'sms':
                        sendSMS(user.phone, message);
                        break;
                    case 'push':
                        pushNotification(user.pushToken, message);
                        break;
                    default:
                        console.log(`Unsupported notification channel: ${channel}`);
                }
            }
        });
    });
};
