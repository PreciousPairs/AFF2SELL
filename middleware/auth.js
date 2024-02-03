// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed'
        });
    }
};

module.exports = authMiddleware;
