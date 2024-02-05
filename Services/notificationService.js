const { sendEmail, sendSMS, sendPushNotification } = require('../utils/notificationUtils');

exports.notifyUser = async (userId, message) => {
  const user = await User.findById(userId);
  switch (user.preferredNotificationMethod) {
    case 'email':
      await sendEmail(user.email, 'Notification', message);
      break;
    case 'sms':
      await sendSMS(user.phone, message);
      break;
    case 'push':
      await sendPushNotification(user.pushToken, message);
      break;
    default:
      console.log('Unsupported notification method');
  }
};
