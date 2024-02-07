const logger = require('../utils/logger');

module.exports = function errorHandlingMiddleware(err, req, res, next) {
  // Log the error details
  logger.error('Unhandled error', { error: err.message, stack: err.stack });

  // Set the default status code to 500 (Internal Server Error)
  let statusCode = 500;
  let errorMessage = 'An unexpected error occurred';

  // Check if the error is a known type (e.g., validation error, database error)
  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request
    errorMessage = err.message;
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409; // Conflict (duplicate key error)
    errorMessage = 'Duplicate key error';
  }

  // Send the error response with appropriate status code and message
  res.status(statusCode).json({
    error: {
      message: errorMessage,
      status: statusCode,
    },
  });
};