import React, { useEffect, useState } from 'react';
import UserService from '../services/UserService';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
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
            setErrorMessage('Error fetching users');
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRefreshUsers = () => {
        fetchUsers();
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <ErrorMessage message={errorMessage} />;

    return (
        <div>
            <h1>Users</h1>
            <button onClick={handleRefreshUsers}>Refresh</button>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
            <div>
                <h2>Create New User</h2>
                <UserForm onSubmit={handleCreateUser} />
            </div>
        </div>
    );
};

interface UserFormProps {
    onSubmit: (userData: any) => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit }) => {
    const [userData, setUserData] = useState<{ name: string; email: string }>({ name: '', email: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(userData);
        setUserData({ name: '', email: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={userData.name} onChange={handleInputChange} />
            </label>
            <label>
                Email:
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} />
            </label>
            <button type="submit">Create User</button>
        </form>
    );
};

const handleCreateUser = async (userData: any) => {
    try {
        await UserService.createUser(userData);
        // Optionally refresh the users list after creation
    } catch (error) {
        console.error('Error creating user:', error);
    }
};

export default UsersPage;