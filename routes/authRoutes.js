const express = require('express');
const { login, register, refreshToken } = require('../controllers/authController');
const router = express.Router();

// User login
router.post('/login', login);

// User registration
router.post('/register', register);

// Refresh token
router.post('/refresh-token', refreshToken);

module.exports = router;
