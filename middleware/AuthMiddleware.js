const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService'); // Assuming UserService can find users by ID

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user details and attach to the request object
        const user = await UserService.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else {
            console.error('Authentication Middleware Error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = authMiddleware;
