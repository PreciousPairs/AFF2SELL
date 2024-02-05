const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmailVerification, sendPasswordResetEmail } = require('./EmailService'); // Hypothetical email services

class UserService {
  // Register a new user with hashed password and send email verification
  static async register(userData) {
    try {
      const { email, password } = userData;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ ...userData, password: hashedPassword });
      await newUser.save();

      // Send email verification
      sendEmailVerification(newUser);

      return newUser;
    } catch (error) {
      throw new Error(`Error registering user: ${error.message}`);
    }
  }

  // Authenticate a user and return a JWT
  static async authenticate(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { user, token };
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  // Update user profile
  static async updateProfile(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      return user;
    } catch (error) {
      throw new Error(`Error updating user profile: ${error.message}`);
    }
  }

  // Change user password
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error('Current password is incorrect');
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
    } catch (error) {
      throw new Error(`Error changing user password: ${error.message}`);
    }
  }

  // Initiate password reset process
  static async initiatePasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate password reset token and send email
      const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
      sendPasswordResetEmail(user, resetToken);
    } catch (error) {
      throw new Error(`Error initiating password reset: ${error.message}`);
    }
  }

  // Reset password using token
  static async resetPassword(resetToken, newPassword) {
    try {
      const payload = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
      const user = await User.findById(payload.userId);

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
    } catch (error) {
      throw new Error(`Error resetting password: ${error.message}`);
    }
  }

  // Delete a user
  static async deleteUser(userId) {
    try {
      await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
}

module.exports = UserService;
