const Subscription = require('../models/Subscription');
const PaymentGateway = require('../utils/paymentGateway'); // Import your payment gateway module
const logger = require('../utils/logger');
const Joi = require('joi');

/**
 * Subscribe a user to a plan.
 * @param {string} userId - The ID of the user.
 * @param {string} planId - The ID of the plan to subscribe to.
 * @returns {Promise<object>} - The created subscription object.
 * @throws {Error} - If subscription creation fails.
 */
exports.subscribeToPlan = async (userId, planId) => {
  try {
    // Check if the user already has an active subscription
    const existingSubscription = await Subscription.findOne({ userId, status: 'active' });
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }

    // Fetch plan details from your plan repository
    const selectedPlan = await PlanRepository.findById(planId); // Replace with your plan retrieval logic

    if (!selectedPlan) {
      throw new Error('Selected plan not found');
    }

    // Create a new subscription
    const subscription = new Subscription({ userId, planId, status: 'active' });
    await subscription.save();

    // Process the initial payment
    await PaymentGateway.processInitialPayment(userId, selectedPlan.price); // Implement payment processing logic

    logger.info(`User ${userId} subscribed to plan ${planId}`);
    return subscription;
  } catch (error) {
    logger.error('Subscription creation failed', { userId, planId, error: error.message });
    throw error;
  }
};

/**
 * Unsubscribe a user from their active subscription.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - The updated subscription object with a 'cancelled' status.
 * @throws {Error} - If unsubscription fails or no active subscription is found.
 */
exports.unsubscribe = async (userId) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Set the subscription status to 'cancelled'
    subscription.status = 'cancelled';
    await subscription.save();

    // Process the subscription cancellation
    await PaymentGateway.processCancellation(userId); // Implement cancellation logic in your payment gateway

    logger.info(`User ${userId} unsubscribed from their active subscription`);
    return subscription;
  catch (error) {
    logger.error('Unsubscription failed', { userId, error: error.message });
    throw error;
  }
};

// Additional Subscription Management Features (from previous prompts):

// (Additions 27 to 47 from previous prompts)
// ...

/**
 * Get subscription details for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object|null>} - The subscription details or null if not found.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getSubscriptionDetails = async (userId) => {
  try {
    // Find the user's subscription
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      return null; // Return null when no subscription is found
    }

    // Fetch the plan details for the subscription
    const plan = await PlanRepository.findById(subscription.planId); // Replace with your plan retrieval logic

    if (!plan) {
      throw new Error('Plan for subscription not found');
    }

    // Combine subscription and plan details
    const subscriptionDetails = {
      userId: subscription.userId,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.createdAt,
      planName: plan.name,
      planPrice: plan.price,
    };

    return subscriptionDetails;
  } catch (error) {
    logger.error('Failed to retrieve subscription details', { userId, error: error.message });
    throw error;
  }
};

/**
 * Update the payment method for a user's subscription.
 * @param {string} userId - The ID of the user.
 * @param {object} paymentMethod - The updated payment method information.
 * @returns {Promise<object>} - The updated subscription object with the new payment method.
 * @throws {Error} - If payment method update fails.
 */
exports.updatePaymentMethod = async (userId, paymentMethod) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Update the payment method information
    subscription.paymentMethod = paymentMethod;
    await subscription.save();

    logger.info(`Payment method updated for user ${userId}`);
    return subscription;
  } catch (error) {
    logger.error('Payment method update failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Extend the subscription for a user.
 * @param {string} userId - The ID of the user.
 * @param {number} extensionMonths - The number of months to extend the subscription.
 * @returns {Promise<object>} - The updated subscription object with the extended end date.
 * @throws {Error} - If subscription extension fails.
 */
exports.extendSubscription = async (userId, extensionMonths) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Calculate the new end date after extension
    const currentEndDate = subscription.endDate;
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(currentEndDate.getMonth() + extensionMonths);

    // Update the subscription's end date
    subscription.endDate = newEndDate;
    await subscription.save();

    logger.info(`Subscription extended for user ${userId} by ${extensionMonths} months`);
    return subscription;
  } catch (error) {
    logger.error('Subscription extension failed', { userId, error: error.message });
    throw error;
  }
};

// Additional Subscription Management Features and Enhancements (as needed)

// Ensure all the added features, validations, and enhancements are incorporated into your subscription management system.

/**
 * Get all active subscriptions.
 * @returns {Promise<Array>} - An array of active subscription objects.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getActiveSubscriptions = async () => {
  try {
    // Find all active subscriptions
    const activeSubscriptions = await Subscription.find({ status: 'active' });
    return activeSubscriptions;
  } catch (error) {
    logger.error('Fetching active subscriptions failed', error);
    throw error;
  }
};

/**
 * Cancel a user's subscription.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - The cancelled subscription object.
 * @throws {Error} - If subscription cancellation fails.
 */
exports.cancelSubscription = async (userId) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Update the subscription status to 'cancelled'
    subscription.status = 'cancelled';
    await subscription.save();

    logger.info(`Subscription cancelled for user ${userId}`);
    return subscription;
  } catch (error) {
    logger.error('Subscription cancellation failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Reactivate a cancelled subscription for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - The reactivated subscription object.
 * @throws {Error} - If subscription reactivation fails.
 */
exports.reactivateSubscription = async (userId) => {
  try {
    // Find the user's cancelled subscription
    const subscription = await Subscription.findOne({ userId, status: 'cancelled' });
    if (!subscription) {
      throw new Error('Cancelled subscription not found');
    }

    // Update the subscription status to 'active'
    subscription.status = 'active';
    await subscription.save();

    logger.info(`Subscription reactivated for user ${userId}`);
    return subscription;
  } catch (error) {
    logger.error('Subscription reactivation failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Get subscription payment history for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array>} - An array of payment history objects for the user's subscription.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getPaymentHistory = async (userId) => {
  try {
    // Find all payment history records for the user's subscription
    const paymentHistory = await PaymentHistory.find({ userId });
    return paymentHistory;
  } catch (error) {
    logger.error('Fetching payment history failed', { userId, error: error.message });
    throw error;
  }
};

// Additional Subscription Management Features and Enhancements (as needed)

// Make sure to integrate these added features into your subscription management system and customize them according to your requirements.

/**
 * Get the next billing date for a user's subscription.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Date|null>} - The next billing date or null if no active subscription is found.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getNextBillingDate = async (userId) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      return null; // Return null if no active subscription is found
    }

    // Calculate the next billing date based on the subscription plan and billing cycle
    const { plan, billingCycle } = subscription;
    const today = new Date();

    if (billingCycle === 'monthly') {
      // Calculate the next billing date for monthly subscriptions
      const nextBillingDate = new Date(today);
      nextBillingDate.setMonth(today.getMonth() + 1);
      return nextBillingDate;
    } else if (billingCycle === 'annual') {
      // Calculate the next billing date for annual subscriptions
      const nextBillingDate = new Date(today);
      nextBillingDate.setFullYear(today.getFullYear() + 1);
      return nextBillingDate;
    } else {
      throw new Error('Invalid billing cycle');
    }
  } catch (error) {
    logger.error('Fetching next billing date failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Get the total revenue generated from subscriptions.
 * @returns {Promise<number>} - The total revenue from subscriptions.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getTotalRevenue = async () => {
  try {
    // Find all active subscriptions
    const activeSubscriptions = await Subscription.find({ status: 'active' });

    // Calculate the total revenue from active subscriptions
    const totalRevenue = activeSubscriptions.reduce((total, subscription) => {
      // You may customize the calculation based on your pricing model and plan details
      // Here, we assume each subscription has a price property
      return total + subscription.price;
    }, 0);

    return totalRevenue;
  } catch (error) {
    logger.error('Fetching total revenue failed', error);
    throw error;
  }
};

/**
 * Get the list of all active subscriptions for a specific plan.
 * @param {string} planId - The ID of the plan to filter subscriptions.
 * @returns {Promise<Array>} - An array of active subscriptions for the specified plan.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getActiveSubscriptionsByPlan = async (planId) => {
  try {
    // Find all active subscriptions with the specified plan ID
    const activeSubscriptions = await Subscription.find({ planId, status: 'active' });
    return activeSubscriptions;
  } catch (error) {
    logger.error('Fetching active subscriptions by plan failed', { planId

 */
exports.getActiveSubscriptionsByPlan = async (planId) => {
  try {
    // Find all active subscriptions with the specified plan ID
    const activeSubscriptions = await Subscription.find({ planId, status: 'active' });
    return activeSubscriptions;
  } catch (error) {
    logger.error('Fetching active subscriptions by plan failed', { planId, error: error.message });
    throw error;
  }
};

/**
 * Update the billing cycle for a user's subscription.
 * @param {string} userId - The ID of the user.
 * @param {string} newBillingCycle - The new billing cycle ('monthly' or 'annual').
 * @returns {Promise<object>} - The updated subscription object.
 * @throws {Error} - If validation fails or an error occurs during the update.
 */
exports.updateBillingCycle = async (userId, newBillingCycle) => {
  try {
    // Validate the new billing cycle
    if (newBillingCycle !== 'monthly' && newBillingCycle !== 'annual') {
      throw new Error('Invalid billing cycle');
    }

    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Update the billing cycle and next billing date
    subscription.billingCycle = newBillingCycle;

    // Calculate and set the new next billing date based on the updated billing cycle
    const today = new Date();
    if (newBillingCycle === 'monthly') {
      const nextBillingDate = new Date(today);
      nextBillingDate.setMonth(today.getMonth() + 1);
      subscription.nextBillingDate = nextBillingDate;
    } else if (newBillingCycle === 'annual') {
      const nextBillingDate = new Date(today);
      nextBillingDate.setFullYear(today.getFullYear() + 1);
      subscription.nextBillingDate = nextBillingDate;
    }

    // Save the updated subscription
    await subscription.save();
    return subscription;
  } catch (error) {
    logger.error('Updating billing cycle failed', { userId, error: error.message });
    throw error;
  }
};

// Additional Subscription Management Features and Enhancements (as needed)

/**
 * Cancel a user's subscription.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - The canceled subscription object.
 * @throws {Error} - If an error occurs during cancellation.
 */
exports.cancelSubscription = async (userId) => {
  try {
    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Cancel the subscription by changing its status to 'cancelled'
    subscription.status = 'cancelled';

    // Save the updated subscription
    await subscription.save();
    return subscription;
  } catch (error) {
    logger.error('Canceling subscription failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Reactivate a user's previously canceled subscription.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object>} - The reactivated subscription object.
 * @throws {Error} - If an error occurs during reactivation.
 */
exports.reactivateSubscription = async (userId) => {
  try {
    // Find the user's canceled subscription
    const subscription = await Subscription.findOne({ userId, status: 'cancelled' });
    if (!subscription) {
      throw new Error('Cancelled subscription not found');
    }

    // Reactivate the subscription by changing its status to 'active'
    subscription.status = 'active';

    // Save the updated subscription
    await subscription.save();
    return subscription;
  } catch (error) {
    logger.error('Reactivating subscription failed', { userId, error: error.message });
    throw error;
  }
};

/**
 * Get the subscription details for a specific user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<object|null>} - The subscription details or null if not found.
 * @throws {Error} - If an error occurs during retrieval.
 */
exports.getSubscriptionDetails = async (userId) => {
  try {
    // Find the user's subscription
    const subscription = await Subscription.findOne({ userId });
    if (!subscription) {
      logger.error('Subscription not found', { userId });
      return null; // Return null when subscription is not found
    }

    // Return the subscription details
    return subscription.toObject();
  } catch (error) {
    logger.error('Failed to retrieve subscription details', { userId, error: error.message });
    throw error;
  }
};

// ... Continue adding more features and enhancements as needed ...

// ... Previous code ...

// Additional Subscription Management Features and Enhancements (as needed)

/**
 * Extend a user's subscription by a specified number of billing cycles.
 * @param {string} userId - The ID of the user.
 * @param {number} numberOfCycles - The number of billing cycles to extend the subscription.
 * @returns {Promise<object>} - The extended subscription object.
 * @throws {Error} - If validation fails or an error occurs during extension.
 */
exports.extendSubscription = async (userId, numberOfCycles) => {
  try {
    // Validate the number of cycles
    if (numberOfCycles <= 0) {
      throw new Error('Invalid number of cycles for extension');
    }

    // Find the user's active subscription
    const subscription = await Subscription.findOne({ userId, status: 'active' });
    if (!subscription) {
      throw new Error('Active subscription not found');
    }

    // Extend the subscription by updating the next billing date
    const today = new Date();
    const nextBillingDate = new Date(subscription.nextBillingDate);
    for (let i = 0; i < numberOfCycles; i++) {
      if (subscription.billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (subscription.billingCycle === 'annual') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }
    }
    subscription.nextBillingDate = nextBillingDate;

    // Save the updated subscription
    await subscription.save();
    return subscription;
  } catch (error) {
    logger.error('Extending subscription failed', { userId, error: error.message });
    throw error;
  }
};

// ... Continue adding more features and enhancements as needed ...

// End of script

