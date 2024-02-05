const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Helmet for setting various HTTP headers for app security
exports.applySecurityMiddlewares = (app) => {
  app.use(helmet());
};

// Rate limiting to prevent brute-force attacks
exports.rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});

