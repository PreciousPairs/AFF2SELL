const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class PasswordService {
    // Hash Password
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Verify Password
    static async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    // Generate Reset Token
    static generateResetToken(userId) {
        const resetToken = jwt.sign({ id: userId }, process.env.JWT_RESET_SECRET, { expiresIn: '1h' });
        return resetToken;
    }

    // Verify Reset Token
    static async verifyResetToken(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
            return decoded.id; // Return userId for further validation
        } catch (error) {
            console.error('Invalid or expired reset token', error);
            throw new Error('Invalid or expired reset token');
        }
    }
}

module.exports = PasswordService;
