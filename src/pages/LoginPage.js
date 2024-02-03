import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import './LoginPage.css'; // Assume styling for .error-message and .loading

const LoginPage = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLoginSuccess = async (googleData) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                body: JSON.stringify({
                    token: googleData.tokenId,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (data.success) {
                // Handle successful authentication here (e.g., update context, redirect)
                history.push('/dashboard');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
            console.error('Login Error:', error);
        }
        setLoading(false);
    };

    const handleLoginFailure = (response) => {
        setError('Login Failed. Please try again.');
        console.error('Login Failed:', response);
    };

    return (
        <div>
            {loading && <p className="loading">Logging in...</p>}
            {error && <p className="error-message">{error}</p>}
            <GoogleLogin
                clientId="YOUR_CLIENT_ID"
                buttonText="Login with Google"
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    );
};
