// middleware/permissions.js
const User = require('../models/User');

exports.checkPermissions = (allowedRoles) => {
  return async (req, res, next) => {
    const { userId } = req.user; // Assuming the user's ID is attached to the request by authentication middleware
    try {
      const user = await User.findById(userId);
      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "You don't have permission to perform this action." });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error checking permissions.' });
    }
  };
};
