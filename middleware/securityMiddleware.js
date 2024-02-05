// Example middleware to enforce security headers
exports.enforceSecurityHeaders = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "script-src 'self'");
  next();
};
