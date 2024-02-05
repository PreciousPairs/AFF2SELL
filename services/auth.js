const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming a Mongoose model
const RefreshToken = require('../models/RefreshToken'); // New model for storing refresh tokens

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.login = async (email, password) => {
  // Login logic remains the same

  // Save or update the refresh token in the database
  let refreshTokenDoc = await RefreshToken.findOne({ userId: user.id });
  if (!refreshTokenDoc) {
    refreshTokenDoc = new RefreshToken({ userId: user.id, token: refreshToken });
  } else {
    refreshTokenDoc.token = refreshToken;
  }
  await refreshTokenDoc.save();

  return { token, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
};

exports.refreshToken = async (token) => {
  // Enhanced refresh token logic to check against database
  const refreshTokenDoc = await RefreshToken.findOne({ token });
  if (!refreshTokenDoc) throw new Error('Refresh token not found');

  const payload = jwt.verify(token, REFRESH_SECRET);
  const newToken = jwt.sign({ userId: payload.userId, email: payload.email }, JWT_SECRET, { expiresIn: '1h' });

  return { token: newToken };
};

// Additional method for updating user roles
exports.updateUserRole = async (userId, newRole) => {
  // Implementation for updating user role in the database
};
