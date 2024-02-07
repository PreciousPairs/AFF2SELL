const jwt = require('jsonwebtoken');

exports.authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      // Extract token from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
      
      // Verify the token and decode user information
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Check if roles are specified and user's role is authorized
        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        
        // Attach decoded user information to the request object
        req.user = decoded;
        
        // Continue to the next middleware or route handler
        next();
      });
    } catch (error) {
      // Handle any unexpected errors
      console.error('Authorization error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};