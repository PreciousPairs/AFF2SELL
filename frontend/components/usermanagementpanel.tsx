// /frontend/components/UserManagementPanel.tsx
import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser, updateUser, deleteUser } from '../api/userServices';
import UserForm from './UserForm'; // A form component for creating/updating user details
import { Table, Button } from 'react-bootstrap'; // Assuming usage of React Bootstrap for UI components

const UserManagementPanel = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch all users on component mount
        const fetchUsers = async () => {
            const fetchedUsers = await getAllUsers();
            setUsers(fetchedUsers);
        };
        fetchUsers();
    }, []);

    const handleCreateUser = async (userData) => {
        const newUser = await createUser(userData);
        setUsers([...users, newUser]);
    };

    const handleUpdateUser = async (userId, userData) => {
        await updateUser(userId, userData);
        setUsers(users.map(user => user.id === userId ? { ...user, ...userData } : user));
    };

    const handleDeleteUser = async (userId) => {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
    };

    return (
        <div className="user-management-panel">
            <h2>User Management</h2>
            <UserForm onSubmit={handleCreateUser} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="secondary" onClick={() => handleUpdateUser(user.id, user)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserManagementPanel;