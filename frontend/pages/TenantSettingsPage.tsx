import React, { useEffect, useState } from 'react';
import TenantService from '../services/TenantService';

const TenantSettingsPage: React.FC = () => {
    const [tenant, setTenant] = useState(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetchTenant();
    }, []);

    const fetchTenant = async () => {
        try {
            const tenantId = 'your-tenant-id'; // This would be dynamically determined in a real application
            const fetchedTenant = await TenantService.fetchTenantById(tenantId);
            setTenant(fetchedTenant);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tenant settings:', error);
            setLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Tenant Settings</h1>
            {tenant && (
                <div>
                    <p>Name: {tenant.name}</p>
                    <p>Theme Color: {tenant.config.themeColor}</p>
                    {/* Form for updating tenant settings */}
                </div>
            )}
            {/* Additional UI for tenant settings update */}
        </div>
    );
};

export default TenantSettingsPage;
