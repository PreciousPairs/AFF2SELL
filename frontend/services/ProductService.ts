// Import axios and types for handling responses and errors
import axios, { AxiosResponse, AxiosError } from 'axios';

// Define TypeScript interfaces for product and error response
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
    category?: string;
}

interface ErrorResponse {
    message: string;
}

// Use environment variable for API base URL
const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/products`;

// Axios global configuration for authentication
axios.interceptors.request.use(config => {
    // Retrieve the token from local storage or another state management solution
    const token = localStorage.getItem('token');
    if (token) {
        // Append the authorization token to every request if available
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Generic response handler to extract data
const handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
};

// Generic error handler to log and throw errors
const handleError = (error: AxiosError<ErrorResponse>): never => {
    // Log error message or a default message if the error response is not available
    console.error('API call failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'API call failed');
};

export default {
    async fetchProducts(): Promise<Product[]> {
        try {
            const response = await axios.get<Product[]>(`${API_BASE_URL}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async fetchProductById(productId: string): Promise<Product> {
        try {
            const response = await axios.get<Product>(`${API_BASE_URL}/${productId}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async createProduct(productData: Partial<Product>): Promise<Product> {
        try {
            const response = await axios.post<Product>(`${API_BASE_URL}`, productData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
        try {
            const response = await axios.put<Product>(`${API_BASE_URL}/${productId}`, productData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async deleteProduct(productId: string): Promise<void> {
        try {
            await axios.delete<void>(`${API_BASE_URL}/${productId}`);
        } catch (error) {
            handleError(error as AxiosError<ErrorResponse>);
        }
    },
};
