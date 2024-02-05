import axios, { AxiosResponse, AxiosError } from 'axios';

interface PricingStrategy {
    id: string;
    name: string;
    description: string;
    rules: Array<object>; // Adjust according to your rule structure
}

interface ErrorResponse {
    message: string;
}

const API_BASE_URL = `${process.env.REACT_APP_API_BASE_URL}/strategies`;

const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

const handleError = (error: AxiosError<ErrorResponse>): never => {
    console.error('API call failed:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'API call failed');
};

const StrategyService = {
    async fetchStrategies(): Promise<PricingStrategy[]> {
        try {
            const response = await axios.get<PricingStrategy[]>(`${API_BASE_URL}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async fetchStrategyById(strategyId: string): Promise<PricingStrategy> {
        try {
            const response = await axios.get<PricingStrategy>(`${API_BASE_URL}/${strategyId}`);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async createStrategy(strategyData: Partial<PricingStrategy>): Promise<PricingStrategy> {
        try {
            const response = await axios.post<PricingStrategy>(`${API_BASE_URL}`, strategyData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async updateStrategy(strategyId: string, strategyData: Partial<PricingStrategy>): Promise<PricingStrategy> {
        try {
            const response = await axios.put<PricingStrategy>(`${API_BASE_URL}/${strategyId}`, strategyData);
            return handleResponse(response);
        } catch (error) {
            return handleError(error as AxiosError<ErrorResponse>);
        }
    },

    async deleteStrategy(strategyId: string): Promise<void> {
        try {
            await axios.delete<void>(`${API_BASE_URL}/${strategyId}`);
        } catch (error) {
            handleError(error as AxiosError<ErrorResponse>);
        }
    },
};

export default StrategyService;
