import React, { useState, useEffect } from 'react';

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        // Include other fields as necessary
    });

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Form fields for user data */}
            <div>
                <label>Name</label>
                <input name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div>
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} />
            </div>
            <button type="submit">{user ? 'Update User' : 'Create User'}</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
};

export default UserForm;
