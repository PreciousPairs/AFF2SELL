import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import UserForm from '../components/UserForm';
import Notifier from '../components/common/Notifier';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const fetchedUsers = await UserService.getUsers();
            setUsers(fetchedUsers);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Failed to load users.');
            console.error('Error fetching users:', error);
            Notifier.notifyError('Failed to load users.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNewUser = () => {
        setSelectedUser(null);
        setIsEditing(true);
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setIsEditing(true);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            await UserService.deleteUser(userId);
            fetchUsers();
            Notifier.notifySuccess('User deleted successfully.');
        } catch (error) {
            console.error(`Error deleting user with ID ${userId}:`, error);
            Notifier.notifyError('Failed to delete user.');
        }
    };

    const handleSubmit = async (userData: any) => {
        try {
            if (selectedUser) {
                await UserService.updateUser(selectedUser.id, userData);
            } else {
                await UserService.createUser(userData);
            }
            setIsEditing(false);
            fetchUsers();
            Notifier.notifySuccess(`User ${selectedUser ? 'updated' : 'created'} successfully.`);
        } catch (error) {
            console.error('Error submitting user data:', error);
            Notifier.notifyError(`Failed to ${selectedUser ? 'update' : 'create'} user.`);
        }
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <ErrorMessage message={errorMessage} />;

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