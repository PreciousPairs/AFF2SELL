const mongoose = require('mongoose');

const kafkaMessageSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  partition: Number,
  key: String,
  value: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'received', 'processed', 'error'], default: 'sent' },
});

const KafkaMessage = mongoose.model('KafkaMessage', kafkaMessageSchema);

// Create a new Kafka message
KafkaMessage.createKafkaMessage = async (messageData) => {
  try {
    const newMessage = new KafkaMessage(messageData);
    await newMessage.save();
    return newMessage;
  } catch (error) {
    throw error;
  }
};

// Update a Kafka message by ID
KafkaMessage.updateKafkaMessage = async (messageId, updatedData) => {
  try {
    const message = await KafkaMessage.findByIdAndUpdate(messageId, updatedData, { new: true });
    return message;
  } catch (error) {
    throw error;
  }
};

// Retrieve a Kafka message by ID
KafkaMessage.getKafkaMessageById = async (messageId) => {
  try {
    const message = await KafkaMessage.findById(messageId);
    return message;
  } catch (error) {
    throw error;
  }
};

// Retrieve all Kafka messages
KafkaMessage.getAllKafkaMessages = async () => {
  try {
    const messages = await KafkaMessage.find({});
    return messages;
  } catch (error) {
    throw error;
  }
};

// Delete a Kafka message by ID
KafkaMessage.deleteKafkaMessageById = async (messageId) => {
  try {
    const deletedMessage = await KafkaMessage.findByIdAndDelete(messageId);
    return deletedMessage;
  } catch (error) {
    throw error;
  }
};

// Search Kafka messages by status
KafkaMessage.searchKafkaMessagesByStatus = async (status) => {
  try {
    const messages = await KafkaMessage.find({ status });
    return messages;
  } catch (error) {
    throw error;
  }
};

module.exports = KafkaMessage;
