const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  status: { type: String, required: true, default: 'active' },
  endDate: Date,
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Create a new subscription
Subscription.createSubscription = async (subscriptionData) => {
  try {
    const newSubscription = new Subscription(subscriptionData);
    await newSubscription.save();
    return newSubscription;
  } catch (error) {
    throw error;
  }
};

// Update a subscription by ID
Subscription.updateSubscription = async (subscriptionId, updatedData) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(subscriptionId, updatedData, { new: true });
    return subscription;
  } catch (error) {
    throw error;
  }
};

// Retrieve a subscription by ID
Subscription.getSubscriptionById = async (subscriptionId) => {
  try {
    const subscription = await Subscription.findById(subscriptionId);
    return subscription;
  } catch (error) {
    throw error;
  }
};

// Retrieve all subscriptions
Subscription.getAllSubscriptions = async () => {
  try {
    const subscriptions = await Subscription.find({});
    return subscriptions;
  } catch (error) {
    throw error;
  }
};

// Delete a subscription by ID
Subscription.deleteSubscriptionById = async (subscriptionId) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(subscriptionId);
    return deletedSubscription;
  } catch (error) {
    throw error;
  }
};

// Search subscriptions by status
Subscription.searchSubscriptionsByStatus = async (status) => {
  try {
    const subscriptions = await Subscription.find({ status });
    return subscriptions;
  } catch (error) {
    throw error;
  }
};

module.exports = Subscription;
