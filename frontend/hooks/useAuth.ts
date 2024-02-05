import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Extending the interface to include new functionalities
interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>; // Returns a boolean indicating if OTP is required
    logout: () => void;
    loginWithGoogle: () => Promise<void>; // Added for Google OAuth login
    sendOTP: (email: string) => Promise<void>; // Added for sending OTP
    verifyOTP: (email: string, otp: string) => Promise<void>; // Added for verifying OTP
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        // Adapted implementation to include OTP check
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            if (response.data.user) {
                setUser(response.data.user);
                return response.data.otpRequired; // Assume backend response includes if OTP is needed
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        // Simplified for illustrative purposes
        try {
            const response = await axios.get('/api/auth/google');
            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Google login failed');
        }
    }, []);

    const sendOTP = useCallback(async (email: string) => {
        try {
            await axios.post('/api/auth/send-otp', { email });
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    }, []);

    const verifyOTP = useCallback(async (email: string, otp: string) => {
        try {
            const response = await axios.post('/api/auth/verify-otp', { email, otp });
            if (response.data.user) {
                setUser(response.data.user);
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
    }, []);

    const logout = useCallback(() => {
        // Adapted to clear user state and possibly call a logout API endpoint
        setUser(null);
        // Optionally call backend to invalidate session
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loginWithGoogle, sendOTP, verifyOTP }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
