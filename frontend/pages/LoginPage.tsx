import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Notifier from '../components/common/Notifier';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, sendOTP } = useAuth(); // Assuming loginWithGoogle and sendOTP are defined in useAuth

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState(''); // OTP state for two-factor authentication
    const [loading, setLoading] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false); // To show OTP input after successful email/password auth

    const handleGoogleLogin = () => {
        // Redirect user to Google's OAuth consent page
        loginWithGoogle().then(() => navigate('/')).catch((error) => {
            Notifier.notifyError('Google login failed. Please try again.');
            console.error('Google login error:', error);
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (showOtpInput) {
                // Verify OTP
                await verifyOTP(email, otp); // Assuming verifyOTP is a method in useAuth
                navigate('/');
            } else {
                // Perform initial login; if OTP is required, backend will indicate so
                const otpRequired = await login(email, password);
                if (otpRequired) {
                    // If backend requires OTP, show OTP input field
                    setShowOtpInput(true);
                    await sendOTP(email); // Send OTP to email or phone
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            setLoading(false);
            setShowOtpInput(false); // Reset OTP input in case of error
            Notifier.notifyError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!showOtpInput}
                        disabled={showOtpInput}
                    />
                </div>
                {showOtpInput && (
                    <div className="form-group">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>
                )}
                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : showOtpInput ? 'Verify OTP' : 'Login'}
                </button>
                <button type="button" onClick={handleGoogleLogin} disabled={loading}>
                    Sign in with Google
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
