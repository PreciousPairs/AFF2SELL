const winston = require('winston');
require('dotenv').config();

// Configure Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        // Console transport for development
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        // File transport for production - logs all levels
        new winston.transports.File({ filename: 'combined.log' }),
        // File transport for errors - logs only error level
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ],
});

class LoggerService {
    static logMessage(level, message, meta = {}) {
        logger.log(level, message, meta);
    }

    static info(message, meta = {}) {
        this.logMessage('info', message, meta);
    }

    static warn(message, meta = {}) {
        this.logMessage('warn', message, meta);
    }

    static error(message, meta = {}) {
        this.logMessage('error', message, meta);
    }

    static debug(message, meta = {}) {
        if (process.env.NODE_ENV !== 'production') {
            this.logMessage('debug', message, meta);
        }
    }
}

module.exports = LoggerService;
