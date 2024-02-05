// /frontend/services/ProductService.ts
import axios from 'axios';

const API_BASE_URL = '/api/products'; // Adjust based on your actual API endpoint

export default {
    async fetchProducts() {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch products', error);
            throw error;
        }
    },

    async fetchProductById(productId: string) {
        try {
            const response = await axios.get(`${API_BASE_URL}/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch product with ID ${productId}`, error);
            throw error;
        }
    },

    async createProduct(productData: object) {
        try {
            const response = await axios.post(`${API_BASE_URL}`, productData);
            return response.data;
        } catch (error) {
            console.error('Failed to create product', error);
            throw error;
        }
    },

    async updateProduct(productId: string, productData: object) {
        try {
            const response = await axios.put(`${API_BASE_URL}/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error(`Failed to update product with ID ${productId}`, error);
            throw error;
        }
    },

    async deleteProduct(productId: string) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/${productId}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to delete product with ID ${productId}`, error);
            throw error;
        }
    },
};
