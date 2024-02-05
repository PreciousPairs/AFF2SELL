const CustomerFeedback = require('../models/CustomerFeedback');

exports.submitFeedback = async (feedbackData) => {
  const feedback = new CustomerFeedback(feedbackData);
  await feedback.save();
  return feedback;
};

exports.resolveFeedback = async (id) => {
  const feedback = await CustomerFeedback.findByIdAndUpdate(id, { resolved: true }, { new: true });
  if (!feedback) {
    throw new Error('Feedback not found');
  }
  return feedback;
};
