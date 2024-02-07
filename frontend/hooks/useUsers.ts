import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, addUser, updateUser, deleteUser } from '../services/userService';

const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const addNewUser = async (userData) => {
        try {
            const newUser = await addUser(userData);
            setUsers(prev => [...prev, newUser]);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateExistingUser = async (id, userData) => {
        try {
            const updatedUser = await updateUser(id, userData);
            setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
        } catch (err) {
            setError(err.message);
        }
    };

    const removeUser = async (id) => {
        try {
            await deleteUser(id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return { users, loading, error, addNewUser, updateExistingUser, removeUser };
};
