const Subscription = require('../models/Subscription');

exports.subscribeToPlan = async (userId, planId) => {
  const subscription = new Subscription({ userId, planId, status: 'active' });
  await subscription.save();
  return subscription;
};

exports.unsubscribe = async (userId) => {
  const subscription = await Subscription.findOne({ userId, status: 'active' });
  if (!subscription) {
    throw new Error('Active subscription not found');
  }
  subscription.status = 'cancelled';
  await subscription.save();
  return subscription;
};
