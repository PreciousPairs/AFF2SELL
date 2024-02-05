import { Request, Response } from 'express';
import UserService from '../services/UserService';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import EmailService from '../services/EmailService'; // Assuming this service handles email operations
import LoggerService from '../services/LoggerService'; // Custom logging service for user activities

class UserController {
    // User registration with email verification
    static async registerUser(req: Request, res: Response) {
        try {
            const { email, password, role } = req.body;
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await UserService.create({ email, password: hashedPassword, role, verified: false });

            const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            await EmailService.sendVerificationEmail(user.email, verificationToken);

            res.status(201).json({ message: 'User registered successfully. Please verify your email.', user });
            LoggerService.log('User Registration', user._id, 'User registered successfully');
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
            LoggerService.error('User Registration Error', error);
        }
    }

    // User email verification
    static async verifyEmail(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            await UserService.verifyUser(payload.userId);

            res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
            LoggerService.log('Email Verification', payload.userId, 'Email verified successfully');
        } catch (error) {
            res.status(500).json({ message: 'Error verifying email', error: error.message });
            LoggerService.error('Email Verification Error', error);
        }
    }

    // User login with JWT and refresh token mechanism
    static async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const user = await UserService.findByEmail(email);
            if (!user || !user.verified) {
                return res.status(401).json({ message: 'Invalid credentials or email not verified' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_REFRESH, { expiresIn: '7d' });
            // Assuming UserService.updateRefreshToken stores refreshToken securely
            await UserService.updateRefreshToken(user._id, refreshToken);

            res.json({ message: 'Login successful', accessToken, refreshToken });
            LoggerService.log('User Login', user._id, 'Login successful');
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
            LoggerService.error('Login Error', error);
        }
    }

  // Assume UserService and other required services are already imported

// Update User Details
static async updateUserDetails(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        const updates = req.body;
        // Ensure sensitive fields are handled appropriately
        const updatedUser = await UserService.updateDetails(userId, updates);
        res.status(200).json({ message: 'User details updated successfully', updatedUser });
        LoggerService.log('Update User Details', userId, 'User details updated successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error updating user details', error: error.message });
        LoggerService.error('Update User Details Error', error);
    }
}

// Delete User
static async deleteUser(req: Request, res: Response) {
    try {
        const userId = req.params.userId;
        await UserService.deleteUser(userId);
        res.status(204).send(); // No content to send back
        LoggerService.log('Delete User', userId, 'User deleted successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
        LoggerService.error('Delete User Error', error);
    }
}

// Refresh Access Token
static async refreshAccessToken(req: Request, res: Response) {
    try {
        const { refreshToken } = req.body;
        const userId = await UserService.validateRefreshToken(refreshToken);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ message: 'Access token refreshed successfully', accessToken: newAccessToken });
        LoggerService.log('Refresh Access Token', userId, 'Access token refreshed successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error refreshing access token', error: error.message });
        LoggerService.error('Refresh Access Token Error', error);
    }
}

}

export default UserController;
