const { sendEmail, sendSMS, pushNotification } = require('../utils/notificationMethods');

exports.notifyUsers = async (notificationType, message) => {
  const users = await getUsersToNotify(notificationType); // Assume this function fetches users based on notification preferences
  users.forEach(user => {
    if (user.notificationPreferences.email) {
      sendEmail(user.email, message);
    }
    if (user.notificationPreferences.sms) {
      sendSMS(user.phone, message);
    }
    if (user.notificationPreferences.pushNotification) {
      pushNotification(user.deviceId, message);
    }
  });
};
