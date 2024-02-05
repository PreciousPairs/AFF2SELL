import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => Promise<void>;
    sendOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string) => Promise<void>;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: any): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
        case 'LOGOUT_START':
        case 'VERIFY_OTP_START':
            return { ...state, isLoading: true, isError: false, errorMessage: '' };
        case 'LOGIN_SUCCESS':
            return { ...state, user: action.payload, isLoading: false };
        case 'LOGOUT_SUCCESS':
            return { ...state, user: null, isLoading: false };
        case 'AUTH_ERROR':
            return { ...state, isLoading: false, isError: true, errorMessage: action.payload };
        default:
            return state;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(authReducer, {
        user: null,
        isLoading: false,
        isError: false,
        errorMessage: '',
    });

    // Simulate token refresh by periodically checking if the user is logged in
    useEffect(() => {
        const interval = setInterval(() => {
            // Assume refreshToken is a method to refresh authentication token
            // refreshToken().catch((error) => console.error('Token refresh failed', error));
        }, 1000 * 60 * 15); // every 15 minutes

        return () => clearInterval(interval);
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.response?.data?.message || 'Login failed' });
        }
    }, []);

    const logout = useCallback(async () => {
        dispatch({ type: 'LOGOUT_START' });
        try {
            await axios.post('/api/auth/logout');
            dispatch({ type: 'LOGOUT_SUCCESS' });
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: 'Logout failed' });
        }
    }, []);

    const loginWithGoogle = useCallback(async () => {
        // Handle Google login logic
    }, []);

    const sendOTP = useCallback(async (email: string) => {
        // Handle sending OTP logic
    }, []);

    const verifyOTP = useCallback(async (email: string, otp: string) => {
        // Handle verifying OTP logic
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                loginWithGoogle,
                sendOTP,
                verifyOTP,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
