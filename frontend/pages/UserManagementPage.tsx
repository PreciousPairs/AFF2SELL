import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import UserForm from '../components/UserForm'; // Component for user creation and update
import Notifier from '../components/common/Notifier';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const fetchedUsers = await UserService.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            Notifier.notifyError('Failed to load users.');
        }
    };

    const handleCreateNewUser = () => {
        setSelectedUser(null);
        setIsEditing(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handleDeleteUser = async (userId) => {
        try {
            await UserService.deleteUser(userId);
            fetchUsers(); // Refresh the list after deletion
            Notifier.notifySuccess('User deleted successfully.');
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error);
            Notifier.notifyError('Failed to delete user.');
        }
    };

    const handleSubmit = async (userData) => {
        try {
            if (selectedUser) {
                await UserService.updateUser(selectedUser.id, userData);
            } else {
                await UserService.createUser(userData);
            }
            setIsEditing(false);
            fetchUsers(); // Refresh the list after creation or update
            Notifier.notifySuccess(`User ${selectedUser ? 'updated' : 'created'} successfully.`);
        } catch (error) {
            console.error('Error submitting user data:', error);
            Notifier.notifyError(`Failed to ${selectedUser ? 'update' : 'create'} user.`);
        }
    };

    return (
        <div>
            <h1>User Management</h1>
            <button onClick={handleCreateNewUser}>Create New User</button>
            {isEditing && <UserForm user={selectedUser} onSubmit={handleSubmit} onCancel={() => setIsEditing(false)} />}
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => handleEditUser(user)}>Edit</button>
                        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserManagementPage;
