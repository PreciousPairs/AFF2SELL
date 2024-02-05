import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';

interface Tenant {
    id: string;
    name: string;
    settings: any; // Extend as needed
}

interface TenantContextType {
    tenant: Tenant | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    fetchTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const tenantReducer = (state: any, action: any) => {
    switch (action.type) {
        case 'FETCH_TENANT_START':
            return { ...state, isLoading: true, isError: false, errorMessage: '' };
        case 'FETCH_TENANT_SUCCESS':
            return { ...state, tenant: action.payload, isLoading: false };
        case 'FETCH_TENANT_ERROR':
            return { ...state, isLoading: false, isError: true, errorMessage: action.payload };
        default:
            return state;
    }
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = React.useReducer(tenantReducer, {
        tenant: null,
        isLoading: false,
        isError: false,
        errorMessage: '',
    });

    const fetchTenant = useCallback(async () => {
        dispatch({ type: 'FETCH_TENANT_START' });
        try {
            const response = await axios.get('/api/tenant');
            dispatch({ type: 'FETCH_TENANT_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({ type: 'FETCH_TENANT_ERROR', payload: 'Failed to load tenant data' });
        }
    }, []);

    useEffect(() => {
        fetchTenant();
    }, [fetchTenant]);

    return <TenantContext.Provider value={{ ...state, fetchTenant }}>{children}</TenantContext.Provider>;
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (!context) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
};
