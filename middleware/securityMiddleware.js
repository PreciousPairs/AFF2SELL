// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('../utils/logger');

// Initialize Express app
const app = express();

// Set up JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Rate limiting configuration
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// CORS configuration
const corsOptions = {
  origin: 'https://yourtrusteddomain.com', // Change to your trusted domain
  optionsSuccessStatus: 200,
};

// Apply security middlewares to the app
app.use(rateLimiter); // Rate limiting middleware
app.use(cors(corsOptions)); // CORS middleware
app.use(helmet()); // Helmet middleware

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = decoded;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return res.status(401).json({
      message: 'Authentication failed'
    });
  }
};

// Error handling middleware
const errorHandlingMiddleware = (err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred',
      status: err.status || 500,
    },
  });
};

// Apply middleware to the app
app.use(authMiddleware);
app.use(errorHandlingMiddleware);

// Export the app
module.exports = app;