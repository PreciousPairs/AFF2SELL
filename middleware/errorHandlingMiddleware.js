// ./middleware/errorHandlingMiddleware.js
const logger = require('../utils/logger');

module.exports = function (err, req, res, next) {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred',
      status: err.status || 500,
    },
  });
};
