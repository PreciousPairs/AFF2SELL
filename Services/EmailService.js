const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    static transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Send Verification Email
    static async sendVerificationEmail(toEmail, verificationToken) {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await this.sendEmail({
            to: toEmail,
            subject: 'Verify Your Email Address',
            html: `<p>Please verify your email address by clicking on the link below:</p><a href="${verificationUrl}">Verify Email</a>`,
        });
    }

    // Send Password Reset Email
    static async sendPasswordResetEmail(toEmail, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await this.sendEmail({
            to: toEmail,
            subject: 'Password Reset Request',
            html: `<p>To reset your password, please click on the link below:</p><a href="${resetUrl}">Reset Password</a><p>If you did not request a password reset, please ignore this email.</p>`,
        });
    }

    // Generic Send Email Method
    static async sendEmail({ to, subject, html }) {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to: ${to}`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}

module.exports = EmailService;
