import axios, { AxiosResponse, AxiosError } from 'axios';

interface Tenant {
    id: string;
    name: string;
    config: {
        themeColor: string;
        logoUrl: string;
    };
}

interface ErrorResponse {
    message: string;
}

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/tenants`;

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

const handleError = (error: AxiosError<ErrorResponse>): never => {
    console.error('API call failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'API call failed');
};

const TenantService = {
    async fetchTenants(): Promise<Tenant[]> {
        try {
            const response = await axios.get<Tenant[]>(`${API_BASE_URL}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async fetchTenantById(tenantId: string): Promise<Tenant> {
        try {
            const response = await axios.get<Tenant>(`${API_BASE_URL}/${tenantId}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async updateTenant(tenantId: string, tenantData: Partial<Tenant>): Promise<Tenant> {
        try {
            const response = await axios.put<Tenant>(`${API_BASE_URL}/${tenantId}`, tenantData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },
};

export default TenantService;
