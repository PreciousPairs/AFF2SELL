const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserService {
    // Register a new user
    static async create({ email, password, role }) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const newUser = new User({ email, password, role });
            await newUser.save();
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    // Find user by email
    static async findByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Verify user's email
    static async verifyUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.verified = true;
            await user.save();
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update user details
    static async updateDetails(userId, updates) {
        try {
            const user = await User.findByIdAndUpdate(userId, updates, { new: true });
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Delete a user
    static async deleteUser(userId) {
        try {
            await User.findByIdAndDelete(userId);
        } catch (error) {
            throw error;
        }
    }

    // Validate refresh token and return user ID
    static async validateRefreshToken(refreshToken) {
        try {
            const payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
            return payload.userId;
        } catch (error) {
            throw error;
        }
    }

    // Update refresh token for a user
    static async updateRefreshToken(userId, refreshToken) {
        try {
            await User.findByIdAndUpdate(userId, { refreshToken });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
