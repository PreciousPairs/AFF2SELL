const mongoose = require('mongoose');

const customerFeedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
});

const CustomerFeedback = mongoose.model('CustomerFeedback', customerFeedbackSchema);

// Create a new customer feedback entry
CustomerFeedback.createFeedback = async (feedbackData) => {
  try {
    const newFeedback = new CustomerFeedback(feedbackData);
    await newFeedback.save();
    return newFeedback;
  } catch (error) {
    throw error;
  }
};

// Update customer feedback by ID
CustomerFeedback.updateFeedback = async (feedbackId, updatedData) => {
  try {
    const feedback = await CustomerFeedback.findByIdAndUpdate(feedbackId, updatedData, { new: true });
    return feedback;
  } catch (error) {
    throw error;
  }
};

// Retrieve customer feedback by ID
CustomerFeedback.getFeedbackById = async (feedbackId) => {
  try {
    const feedback = await CustomerFeedback.findById(feedbackId);
    return feedback;
  } catch (error) {
    throw error;
  }
};

// Retrieve all customer feedback entries
CustomerFeedback.getAllFeedback = async () => {
  try {
    const feedbackEntries = await CustomerFeedback.find({});
    return feedbackEntries;
  } catch (error) {
    throw error;
  }
};

// Delete customer feedback by ID
CustomerFeedback.deleteFeedbackById = async (feedbackId) => {
  try {
    const deletedFeedback = await CustomerFeedback.findByIdAndDelete(feedbackId);
    return deletedFeedback;
  } catch (error) {
    throw error;
  }
};

// Search customer feedback entries by resolved status
CustomerFeedback.searchFeedbackByResolvedStatus = async (resolvedStatus) => {
  try {
    const feedbackEntries = await CustomerFeedback.find({ resolved: resolvedStatus });
    return feedbackEntries;
  } catch (error) {
    throw error;
  }
};

module.exports = CustomerFeedback;
