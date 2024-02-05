import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                email: formData.email,
                password: formData.password
            });
            if (response.status === 201) {
                // Redirect to login page upon successful registration
                history.push('/login');
            }
        } catch (err) {
            setError(err.response.data.error || 'An error occurred during registration.');
        }
    };

    return (
        <div className="registration-page">
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegistrationPage;
