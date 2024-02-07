const jwt = require('jsonwebtoken');
const logger = require('../utils/logger'); // Assume a logging utility

const JWT_SECRET = process.env.JWT_SECRET;

const jwtMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        req.userData = decoded;
        next();
    } catch (error) {
        logger.error(`JWT verification error: ${error.message}`);
        return res.status(401).json({
            message: 'JWT verification failed'
        });
    }
};

module.exports = jwtMiddleware;