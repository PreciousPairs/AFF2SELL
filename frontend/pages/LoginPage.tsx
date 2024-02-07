import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotifierContext from '../contexts/NotifierContext'; // Assuming you have a NotifierContext for global notifications

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, loginWithGoogle, sendOTP, verifyOTP } = useAuth(); // Ensure verifyOTP is also defined in useAuth
    const notifier = useContext(NotifierContext); // Use NotifierContext for global notifications

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await loginWithGoogle();
            notifier.notifySuccess('Successfully logged in with Google.');
            navigate('/');
        } catch (error) {
            notifier.notifyError('Google login failed. Please try again.');
            console.error('Google login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (showOtpInput) {
                await verifyOTP(email, otp);
                notifier.notifySuccess('OTP Verified. Login successful.');
                navigate('/');
            } else {
                const otpRequired = await login(email, password);
                if (otpRequired) {
                    setShowOtpInput(true);
                    await sendOTP(email); // Trigger OTP sending
                    notifier.notifyInfo('OTP sent to your email. Please enter it below.');
                } else {
                    notifier.notifySuccess('Login successful.');
                    navigate('/');
                }
            }
        } catch (error) {
            notifier.notifyError('Login failed. Please check your credentials and try again.');
            console.error('Login error:', error);
        } finally {
            setLoading(false);
            if (!showOtpInput) {
                setShowOtpInput(false); // Ensure OTP input is hidden upon error or successful login without OTP
            }
        }
    };

    return (
        <div className="login-page">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                {!showOtpInput && (
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                )}
                {showOtpInput && (
                    <div className="form-group">
                        <label htmlFor="otp">OTP:</label>
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
                {!showOtpInput && (
                    <button type="button" onClick={handleGoogleLogin} disabled={loading}>
                        Sign in with Google
                    </button>
                )}
            </form>
        </div>
    );
};

export default LoginPage;