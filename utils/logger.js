// logger.js
const { createLogger, transports, format } = require('winston');
require('dotenv').config();
const Prometheus = require('prom-client');

// Configure Prometheus to collect metrics
const counter = new Prometheus.Counter({
  name: 'log_messages_total',
  help: 'Total number of log messages',
  labelNames: ['level'],
});

// Determine the environment to adjust logging levels and transports
const environment = process.env.NODE_ENV || 'development';
const isProduction = environment === 'production';

// Define custom logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};

// Custom format combining timestamp, label, level, and message
const logFormat = format.combine(
  format.label({ label: 'pricing-service' }),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(info => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`),
  format.colorize({ all: !isProduction }),
);

// Define transports based on the environment
const loggerTransports = [
  new transports.Console({
    level: isProduction ? 'warn' : 'debug', // More verbose logging in non-production environments
  }),
  // In production, additionally log to a file system or external logging service
  ...(isProduction ? [new transports.File({ filename: 'logs/error.log', level: 'error' })] : []),
];

// Create the Winston logger
const logger = createLogger({
  levels,
  format: logFormat,
  transports: loggerTransports,
});

// Enhance logger methods to increment Prometheus counters
Object.keys(levels).forEach(level => {
  const originalMethod = logger[level];
  logger[level] = (message, ...meta) => {
    counter.inc({ level });
    originalMethod.call(logger, message, ...meta);
  };
});

// Export the enhanced logger
module.exports = logger;

// Example of using the logger
// const logger = require('./logger');
// logger.info('Informational message');
// logger.error('Error message');