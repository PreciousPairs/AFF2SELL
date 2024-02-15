// Import axios for making HTTP requests
import axios from 'axios';

// Base URL for the pricing strategy service
const API_BASE_URL = '/api/strategies';

export const PricingStrategyService = {
    async fetchStrategies() {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch strategies', error);
            throw error;
        }
    },

    async fetchStrategyById(strategyId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${strategyId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch strategy with ID ${strategyId}`, error);
            throw error;
        }
    },

    async createStrategy(strategyData: object) {
        try {
            const response = await axios.post(`${API_BASE_URL}`, strategyData);
            return response.data;
        } catch (error) {
            console.error('Failed to create strategy', error);
            throw error;
        }
    },

    async updateStrategy(strategyId: string, strategyData: object) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${strategyId}`, strategyData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update strategy with ID ${strategyId}`, error);
            throw error;
        }
    },

    async deleteStrategy(strategyId: string) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${strategyId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to delete strategy with ID ${strategyId}`, error);
            throw error;
        }
    },
};
