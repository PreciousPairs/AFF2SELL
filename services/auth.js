const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming a Mongoose model
const RefreshToken = require('../models/RefreshToken'); // New model for storing refresh tokens

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.login = async (email, password) => {
exports.updateUserRole = async (userId, newRole) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.role = newRole;
  await user.save();
};

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

const User = require('../models/User'); // Import the User model

// Assuming we have predefined roles in the system
const VALID_ROLES = ['admin', 'user', 'editor']; // Example roles

exports.updateUserRole = async (userId, newRole) => {
  // Validate the newRole against the predefined VALID_ROLES
  if (!VALID_ROLES.includes(newRole)) {
    throw new Error(`Invalid role. Valid roles are: ${VALID_ROLES.join(', ')}`);
  }

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Check if the new role is different from the current role
  if (user.role === newRole) {
    throw new Error('User already has this role');
  }

  // Update the user's role
  user.role = newRole;
  await user.save();

 exports.logout = async (userId) => {
  // Invalidate the refresh token
  await RefreshToken.findOneAndRemove({ userId });
  
  return { message: 'Logout successful' };
};

  return { message: 'User role updated successfully', userId, newRole };
};

};
