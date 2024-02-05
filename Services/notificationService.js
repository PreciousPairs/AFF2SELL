const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); // Assume a utility function for sending emails

exports.sendPriceUpdateNotification = async (productId, oldPrice, newPrice) => {
  // Fetch users interested in price updates
  const users = await User.find({ isSubscribedForUpdates: true });
  users.forEach(user => {
    // Send email notification
    sendEmail(user.email, 'Price Update Notification', `The price of product ID ${productId} has changed from ${oldPrice} to ${newPrice}.`);
  });
};
