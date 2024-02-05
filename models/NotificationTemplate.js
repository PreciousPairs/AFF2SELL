const mongoose = require('mongoose');

const notificationTemplateSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    channels: {
        type: [String], // e.g., ['email', 'sms', 'push']
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('NotificationTemplate', notificationTemplateSchema);
