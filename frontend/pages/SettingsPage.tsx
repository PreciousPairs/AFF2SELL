import React, { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { TenantService } from '../services';
import { useTenant } from '../hooks/useTenant';
import Notifier from '../components/common/Notifier';

interface CustomField {
  fieldId: string;
  value: string | number | boolean;
  type: 'text' | 'number' | 'checkbox';
}

interface Settings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  email: string;
  pageSize: number;
  customFields: CustomField[];
}

const defaultSettings: Settings = {
  theme: 'light',
  notificationsEnabled: true,
  email: '',
  pageSize: 10,
  customFields: [
    { fieldId: 'customNotification', value: true, type: 'checkbox' },
    { fieldId: 'dashboardLayout', value: 'grid', type: 'text' }
  ],
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenant.id) navigate('/login'); // Redirect if tenant is not identified

    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const fetchedSettings = await TenantService.fetchSettings(tenant.id);
        setSettings(fetchedSettings || defaultSettings);
        setError(null);
      } catch (err) {
        setError('Failed to fetch settings. Please try again.');
        Notifier.notifyError('Failed to fetch settings.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [tenant.id, navigate]);

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await TenantService.updateSettings(tenant.id, settings);
      Notifier.notifySuccess('Settings updated successfully!');
    } catch (err) {
      setError('Failed to update settings. Please try again.');
      Notifier.notifyError('Failed to update settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, checked, type } = event.target;
    if (name.startsWith('customField_')) {
      const fieldId = name.split('_')[1];
      handleCustomFieldChange(fieldId, type === 'checkbox' ? checked : value);
    } else {
      setSettings(prevSettings => ({
        ...prevSettings,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleCustomFieldChange = (fieldId: string, value: string | number | boolean) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      customFields: prevSettings.customFields.map(field =>
        field.fieldId === fieldId ? { ...field, value } : field
      ),
    }));
  };

  if (isLoading) return <p>Loading settings...</p>;
  if (error) return <p>Error loading settings: {error}</p>;

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <form onSubmit={handleFormSubmit}>
        {/* Theme Selection */}
        <div>
          <label htmlFor="theme">Theme:</label>
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        {/* Other Settings Fields */}
        
        {/* Dynamic Custom Fields */}
        {settings.customFields.map((field, index) => (
          <div key={index}>
            <label htmlFor={`customField_${field.fieldId}`}>{field.fieldId}:</label>
            {field.type === 'checkbox' ? (
              <input
                type="checkbox"
                name={`customField_${field.fieldId}`}
                checked={Boolean(field.value)}
                onChange={handleChange}
              />
            ) : (
              <input
                type={field.type}
                name={`customField_${field.fieldId}`}
                value={String(field.value)}
                onChange={handleChange}
              />
            )}
          </div>
        ))}

        <button type="submit" disabled={isLoading}>Save Settings</button>
      </form>
    </div>
  );
};

export default SettingsPage;