const User = require('../models/User'); // Model for user data
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWTs
require('dotenv').config(); // For accessing environment variables

class UserService {
    // Register a new user with hashed password and role
    static async create({ email, password, role = 'user' }) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, role, verified: false });
        await newUser.save();
        return newUser;
    }

    // Authenticate a user and return a JWT
    static async authenticate(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { user, token };
    }

    // Verify a user's email
    static async verifyUser(userId) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.verified = true;
        await user.save();
        return user;
    }

    // Update user details
    static async updateDetails(userId, updates) {
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        return updatedUser;
    }

    // Delete a user
    static async deleteUser(userId) {
        await User.findByIdAndDelete(userId);
    }

    // Password reset functionality
    static async resetPassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });
    }

    // Refresh token validation and update
    static async validateRefreshToken(token) {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        return decoded.userId;
    }

    static async updateRefreshToken(userId, refreshToken) {
        await User.findByIdAndUpdate(userId, { refreshToken });
    }
}

module.exports = UserService;
