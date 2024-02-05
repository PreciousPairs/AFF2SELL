import axios from 'axios';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const UserService = {
    async getUsers(): Promise<User[]> {
        try {
            const response = await axios.get('/api/users');
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch users');
        }
    },

    async getUserById(userId: string): Promise<User> {
        try {
            const response = await axios.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch user');
        }
    },

    async createUser(userData: Partial<User>): Promise<User> {
        try {
            const response = await axios.post('/api/users', userData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to create user');
        }
    },

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
        try {
            const response = await axios.put(`/api/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw new Error('Failed to update user');
        }
    },

    async deleteUser(userId: string): Promise<void> {
        try {
            await axios.delete(`/api/users/${userId}`);
        } catch (error) {
            throw new Error('Failed to delete user');
        }
    },
};

export default UserService;
