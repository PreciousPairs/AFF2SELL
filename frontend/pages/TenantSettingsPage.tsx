import React, { useEffect, useState } from 'react';
import TenantService from '../services/TenantService';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';

const TenantSettingsPage: React.FC = () => {
    const [tenant, setTenant] = useState<any | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchTenant();
    }, []);

    const fetchTenant = async () => {
        setLoading(true);
        setIsError(false);
        try {
            const tenantId = 'your-tenant-id';
            const fetchedTenant = await TenantService.fetchTenantById(tenantId);
            setTenant(fetchedTenant);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Error fetching tenant settings');
            console.error('Error fetching tenant settings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <ErrorMessage message={errorMessage} />;

    return (
        <div>
            <h1>Tenant Settings</h1>
            {tenant && (
                <div>
                    <p>Name: {tenant.name}</p>
                    <p>Theme Color: {tenant.config.themeColor}</p>
                    <TenantSettingsForm tenant={tenant} />
                </div>
            )}
        </div>
    );
};

interface TenantSettingsFormProps {
    tenant: {
        id: string;
        name: string;
        config: {
            themeColor: string;
        };
    };
}

const TenantSettingsForm: React.FC<TenantSettingsFormProps> = ({ tenant }) => {
    const [newSettings, setNewSettings] = useState({
        name: tenant.name,
        themeColor: tenant.config.themeColor,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSettings(prevSettings => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await TenantService.updateTenantSettings(tenant.id, newSettings);
        } catch (error) {
            console.error('Error updating tenant settings:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" name="name" value={newSettings.name} onChange={handleInputChange} />
            </label>
            <label>
                Theme Color:
                <input type="text" name="themeColor" value={newSettings.themeColor} onChange={handleInputChange} />
            </label>
            <button type="submit">Save Settings</button>
        </form>
    );
};

export default TenantSettingsPage;