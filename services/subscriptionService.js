exports.upgradeSubscriptionPlan = async (userId, newPlanId) => {
  const user = await User.findById(userId);
  const currentSubscription = await Subscription.findOne({ user: userId, status: 'active' });
  // Apply business logic for upgrading plan
  currentSubscription.plan = newPlanId;
  await currentSubscription.save();

  // Consider promotional discounts or trial periods
  applyPromotionalOffer(user, newPlanId);
};
