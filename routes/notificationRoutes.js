const express = require('express');
const router = express.Router();
const { updateUserPreferences } = require('../controllers/userController');
const { sendNotification } = require('../services/notificationService');

// Route to update user notification preferences
router.patch('/users/:userId/preferences', updateUserPreferences);

// Test route to send a notification (for demonstration purposes)
router.post('/test-notification', async (req, res) => {
    try {
        const { templateKey, userCriteria } = req.body;
        await sendNotification(templateKey, userCriteria);
        res.status(200).json({ message: "Test notification sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
