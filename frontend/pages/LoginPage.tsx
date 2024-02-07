import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import NotifierContext from '../contexts/NotifierContext';
import Layout from '../components/layout';
import withAuth from '../lib/withAuth';
import { useStore } from '../stores/store';
import LoginButton from '../components/common/LoginButton';

const LoginPage: React.FC<{ next?: string }> = ({ next }) => {
    const navigate = useNavigate();
    const { userStore } = useStore();
    const { login, loginWithGoogle, sendOTP, verifyOTP } = useAuth();
    const notifier = useContext(NotifierContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        const greetings = ["Good morning", "Good afternoon", "Good evening"];
        const index = Math.floor(hour / 8);
        setGreeting(greetings[index]);
        userStore.suggestInitialSettings(); // Suggest initial settings based on AI insights
    }, [userStore]);

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
                    await sendOTP(email);
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
        }
    };

    return (
        <Layout>
            <div style={{ textAlign: 'center', margin: '0 20px' }}>
                <Head>
                    <title>Log in | Repricer AI</title>
                    <meta name="description" content="Login to access your AI-driven repricing dashboard." />
                </Head>
                <p style={{ margin: '45px auto', fontSize: '44px', fontWeight: 400 }}>{greeting}, Log in to Repricer AI</p>
                <p>Unlock the power of AI for dynamic pricing strategies.</p>
                <form onSubmit={handleSubmit}>
                    {/* Form inputs and Google login button */}
                </form>
                <LoginButton next={next} />
            </div>
        </Layout>
    );
};

export default withAuth(observer(LoginPage), { logoutRequired: true });