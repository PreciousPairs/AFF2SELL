const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

exports.generateRefreshToken = async (user) => {
  const expiresIn = new Date();
  expiresIn.setDate(expiresIn.getDate() + 7); // Set expiry date to 7 days from now

  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
  await new RefreshToken({
    token: refreshToken,
    user: user._id,
    expiresAt: expiresIn,
  }).save();

  return refreshToken;
};

exports.refreshAccessToken = async (token) => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const user = { _id: payload.userId }; // Fetch user details as needed
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  } catch (error) {
    throw new Error('Token expired or invalid');
  }
};
