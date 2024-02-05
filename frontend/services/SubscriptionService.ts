import axios, { AxiosResponse, AxiosError } from 'axios';

interface Subscription {
    id: string;
    userId: string;
    plan: string;
    startDate: string;
    endDate: string;
    status: 'active' | 'inactive';
}

interface ErrorResponse {
    message: string;
}

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/subscriptions`;

// Generic response handler
const handleResponse = <T>(response: AxiosResponse<T>): T => {
    return response.data;
};

// Generic error handler
const handleError = (error: AxiosError<ErrorResponse>): never => {
    console.error('API call failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'API call failed');
};

const SubscriptionService = {
    async fetchSubscriptions(): Promise<Subscription[]> {
        try {
            const response = await axios.get<Subscription[]>(`${API_BASE_URL}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async fetchSubscriptionById(subscriptionId: string): Promise<Subscription> {
        try {
            const response = await axios.get<Subscription>(`${API_BASE_URL}/${subscriptionId}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async createSubscription(subscriptionData: Partial<Subscription>): Promise<Subscription> {
        try {
            const response = await axios.post<Subscription>(`${API_BASE_URL}`, subscriptionData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async updateSubscription(subscriptionId: string, subscriptionData: Partial<Subscription>): Promise<Subscription> {
        try {
            const response = await axios.put<Subscription>(`${API_BASE_URL}/${subscriptionId}`, subscriptionData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async deleteSubscription(subscriptionId: string): Promise<void> {
        try {
            await axios.delete<void>(`${API_BASE_URL}/${subscriptionId}`);
        } catch (error) {
            handleError(error as AxiosError<ErrorResponse>);
        }
    },
};

export default SubscriptionService;
