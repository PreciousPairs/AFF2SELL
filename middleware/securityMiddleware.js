// ./middleware/securityMiddleware.js
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

const corsOptions = {
  origin: 'https://yourtrusteddomain.com',
  optionsSuccessStatus: 200,
};

exports.securityMiddlewares = (app) => {
  app.use(rateLimiter);
  app.use(cors(corsOptions));
  app.use(helmet());
};
