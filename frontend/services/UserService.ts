import axios, { AxiosResponse, AxiosError } from 'axios';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

interface ErrorResponse {
    message: string;
}

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/users`;

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

const handleError = (error: AxiosError<ErrorResponse>): never => {
    console.error('API call failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'API call failed');
};

const UserService = {
    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get<User[]>(`${API_BASE_URL}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async getUserById(userId: string): Promise<User> {
        try {
            const response = await axios.get<User>(`${API_BASE_URL}/${userId}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async createUser(userData: Partial<User>): Promise<User> {
        try {
            const response = await axios.post<User>(`${API_BASE_URL}`, userData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
        try {
            const response = await axios.put<User>(`${API_BASE_URL}/${userId}`, userData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async deleteUser(userId: string): Promise<void> {
        try {
            await axios.delete<void>(`${API_BASE_URL}/${userId}`);
        } catch (error) {
            handleError(error as AxiosError<ErrorResponse>);
        }
    },
};

export default UserService;
