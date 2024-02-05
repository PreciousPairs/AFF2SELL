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

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/products`;

// Configuring axios globally if authentication is needed across the application
axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

const handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
};

const handleError = (error: AxiosError<ErrorResponse>): never => {
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
