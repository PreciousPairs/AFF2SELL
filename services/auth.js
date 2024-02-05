const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming a Mongoose model
const RefreshToken = require('../models/RefreshToken'); // Model for storing refresh tokens

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Predefined roles in the system
const VALID_ROLES = ['admin', 'user', 'editor'];

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

  // Save or update the refresh token in the database
  let refreshTokenDoc = await RefreshToken.findOneAndUpdate({ userId: user.id }, { token: refreshToken }, { new: true, upsert: true });
  await refreshTokenDoc.save();

  return { token, refreshToken, user: { id: user.id, email: user.email, role: user.role } };
};

exports.refreshToken = async (token) => {
  const refreshTokenDoc = await RefreshToken.findOne({ token });
  if (!refreshTokenDoc) throw new Error('Refresh token not found');

  try {
    const payload = jwt.verify(token, REFRESH_SECRET);
    const newToken = jwt.sign({ userId: payload.userId, email: payload.email, role: payload.role }, JWT_SECRET, { expiresIn: '1h' });
    return { token: newToken };
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

exports.updateUserRole = async (userId, newRole) => {
  if (!VALID_ROLES.includes(newRole)) {
    throw new Error(`Invalid role. Valid roles are: ${VALID_ROLES.join(', ')}`);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.role === newRole) {
    throw new Error('User already has this role');
  }

  user.role = newRole;
  await user.save();
  return { message: 'User role updated successfully', userId, newRole };
};

exports.logout = async (userId) => {
  await RefreshToken.findOneAndRemove({ userId });
  return { message: 'Logout successful' };
};
