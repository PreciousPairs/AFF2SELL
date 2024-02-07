// Load environment variables from .env file at the beginning
require('dotenv').config();

const express = require('express');
const helmet = require('helmet'); // Security middleware for setting various HTTP headers
const cors = require('cors'); // Middleware to enable CORS
const rateLimit = require('express-rate-limit'); // Middleware for rate-limiting
const { errors } = require('celebrate'); // Middleware for Joi validation errors
const morgan = require('morgan'); // HTTP request logger middleware
const { createLogger, format, transports } = require('winston'); // For advanced logging
const { consumeMessages } = require('./kafka/consumer');
const { processMessage } = require('./services/messageProcessor');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');
const healthCheckRoute = require('./routes/healthCheckRoute'); // Implement a health check route

// Create a Winston logger instance
const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'server.log' }),
  ],
});

// Initialize Express app
const app = express();

// Apply Helmet for security headers
app.use(helmet());

// Configure CORS with options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN, // e.g., "https://example.com"
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Enable HTTP request logging with Morgan
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(apiLimiter);

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Add a health check route for monitoring the application's health
app.use('/health', healthCheckRoute);

// Consume messages from Kafka topic
const topic = process.env.KAFKA_TOPIC; // Use environment variable for Kafka topic name
async function startKafkaConsumer() {
  try {
    logger.info(`Starting Kafka consumer for topic: ${topic}`);
    await consumeMessages(topic, processMessage);
  } catch (error) {
    logger.error('Error starting Kafka consumer:', error);
  }
}
startKafkaConsumer();

// Celebrate errors middleware for handling Joi validation errors
app.use(errors());

// Apply global error handling middleware
app.use(errorHandlingMiddleware(logger));

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});