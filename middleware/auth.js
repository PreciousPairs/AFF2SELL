const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Assume a logging utility

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (options = {}) => {
    return (req, res, next) => {
        try {
            // Check if authentication is optional for this route
            if (options.optional && options.optional.includes(req.path)) {
                return next();
            }

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
};

module.exports = authMiddleware;