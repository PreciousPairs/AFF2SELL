// /services/AuthService.js

require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const OTPService = require('./OTPService'); // Assume this service handles OTP generation and verification

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthService {
  static async register(email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return this.generateAuthTokens(newUser);
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    return this.generateAuthTokens(user);
  }

  static async googleLogin(tokenId) {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, email_verified, name } = ticket.getPayload();
    if (!email_verified) {
      throw new Error('Google account not verified');
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId: ticket.getUserId(),
      });
    }

    return this.generateAuthTokens(user);
  }

  static async verifyOTP(email, otp) {
    const isValid = await OTPService.verifyOTP(email, otp);
    if (!isValid) {
      throw new Error('Invalid OTP');
    }

    const user = await User.findOne({ email });
    return this.generateAuthTokens(user);
  }

  static async generateAuthTokens(user) {
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: '7d' });

    // Save refresh token in the database
    await new RefreshToken({ token: refreshToken, user: user.id }).save();

    return { token, refreshToken, user };
  }

  static async refreshAuthToken(refreshToken) {
    try {
      const data = jwt.verify(refreshToken, REFRESH_SECRET);
      const user = await User.findById(data.userId);
      if (!user) {
        throw new Error('User not found');
      }
      return this.generateAuthTokens(user);
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }
class EnhancedAuthService {
  // Existing methods (login, logout, register, etc.)

  static async enableTwoFactorAuthentication(userId) {
    const user = await this.findUserById(userId);
    // Generate and save 2FA secret for the user
    const twoFactorSecret = TwoFactorAuthenticationService.generateSecret();
    user.twoFactorSecret = twoFactorSecret;
    await user.save();

    // Return QR code or manual setup key for user to enable 2FA in an authenticator app
    return TwoFactorAuthenticationService.getQRCode(user.email, twoFactorSecret);
  }

  static async verifyTwoFactorToken(userId, token) {
    const user = await this.findUserById(userId);
    const isTokenValid = TwoFactorAuthenticationService.verifyToken(user.twoFactorSecret, token);
    if (!isTokenValid) throw new Error('Invalid 2FA token');

    // Update user session or status to reflect successful 2FA verification
  }

  // Utility method to find user by ID
  static async findUserById(userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
  }

  // Additional methods for role-based access control, session management...
}
}

module.exports = AuthService;