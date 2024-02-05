const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, updateUserPreferences } = require('../controllers/userController');

// Get all users
router.get('/', getAllUsers);

// Get a single user by ID
router.get('/:userId', getUserById);

// Create a new user
router.post('/', createUser);

// Update an existing user
router.put('/:userId', updateUser);

// Delete a user
router.delete('/:userId', deleteUser);

// Update user notification preferences
router.patch('/:userId/preferences', updateUserPreferences);

module.exports = router;
