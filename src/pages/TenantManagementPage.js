import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TenantManagementPage = () => {
    const [tenants, setTenants] = useState([]);
    const [newTenant, setNewTenant] = useState({ name: '', apiKey: '' });

    useEffect(() => {
        // Fetch tenant settings
        const fetchTenants = async () => {
            const { data } = await axios.get('/api/tenants');
            setTenants(data);
        };
        fetchTenants();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTenant(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/tenants', newTenant);
            setTenants([...tenants, response.data]);
            setNewTenant({ name: '', apiKey: '' }); // Reset form after successful addition
            alert('Tenant added successfully!');
        } catch (error) {
            console.error('Failed to add tenant', error);
            alert('Failed to add tenant.');
        }
    };

    return (
        <div className="tenant-management-page">
            <h2>Tenant Management</h2>
            <div className="tenant-form">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Tenant Name" value={newTenant.name} onChange={handleChange} required />
                    <input type="text" name="apiKey" placeholder="API Key" value={newTenant.apiKey} onChange={handleChange} required />
                    <button type="submit">Add Tenant</button>
                </form>
            </div>
            <div className="tenant-list">
                <h3>Existing Tenants</h3>
                {tenants.map(tenant => (
                    <div key={tenant.id}>
                        <p>Name: {tenant.name}</p>
                        <p>API Key: {tenant.apiKey}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TenantManagementPage;
