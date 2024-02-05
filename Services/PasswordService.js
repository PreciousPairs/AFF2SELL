const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class PasswordService {
  // Hash Password
  static async hashPassword(password) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password: ${error.message}`);
    }
  }

  // Verify Password
  static async verifyPassword(password, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }

  // Generate Reset Token
  static generateResetToken(userId) {
    try {
      const resetToken = jwt.sign({ id: userId }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
      return resetToken;
    } catch (error) {
      throw new Error(`Error generating reset token: ${error.message}`);
    }
  }

  // Verify Reset Token
  static async verifyResetToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      return decoded.id; // Return userId for further validation
    } catch (error) {
      throw new Error(`Invalid or expired reset token: ${error.message}`);
    }
  }

  // Generate a unique salt for password hashing
  static async generateSalt() {
    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      return salt;
    } catch (error) {
      throw new Error(`Error generating salt: ${error.message}`);
    }
  }

  // Hash Password with a generated salt
  static async hashPasswordWithSalt(password, salt) {
    try {
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error(`Error hashing password with salt: ${error.message}`);
    }
  }

  // Verify Password Complexity
  static isPasswordComplex(password) {
    // Implement password complexity rules (e.g., length, special characters, etc.)
    // Return true if the password meets the complexity requirements, false otherwise
    const minLength = 8; // Minimum password length
    const hasUppercase = /[A-Z]/.test(password); // Check for at least one uppercase letter
    const hasLowercase = /[a-z]/.test(password); // Check for at least one lowercase letter
    const hasDigit = /[0-9]/.test(password); // Check for at least one digit
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password); // Check for at least one special character

    // Customize the complexity requirements as needed
    if (
      password.length >= minLength &&
      hasUppercase &&
      hasLowercase &&
      hasDigit &&
      hasSpecialChar
    ) {
      return true;
    } else {
      throw new Error('Password does not meet complexity requirements');
    }
  }
}

module.exports = PasswordService;
