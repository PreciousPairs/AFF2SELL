import React, { useEffect, useState, FormEvent } from 'react';
import { TenantService } from '../services';
import { useTenant } from '../hooks/useTenant';

// Extending the Settings interface to cover more complex scenarios
interface Settings {
  theme: string;
  notificationsEnabled: boolean;
  email: string;
  pageSize: number;
  customFields: Array<{ fieldId: string; value: string | number | boolean }>;
}

const defaultSettings: Settings = {
  theme: 'light',
  notificationsEnabled: true,
  email: '',
  pageSize: 10,
  customFields: [],
};

const SettingsPage: React.FC = () => {
  const { tenant } = useTenant();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const fetchedSettings = await TenantService.fetchSettings(tenant.id);
        setSettings(fetchedSettings);
        setError(null);
      } catch (err) {
        setError('Failed to fetch settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    if (tenant.id) fetchSettings();
  }, [tenant.id]);

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await TenantService.updateSettings(tenant.id, settings);
      alert('Settings updated successfully!');
      setError(null);
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, checked, type } = event.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Dynamic field handler for customFields array
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
    <div>
      <h1>Settings</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="theme">Theme:</label>
          <select name="theme" value={settings.theme} onChange={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" value={settings.email} onChange={handleChange} required />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleChange}
            />
            Enable Notifications
          </label>
        </div>
        <div>
          <label htmlFor="pageSize">Page Size:</label>
          <input type="number" name="pageSize" value={settings.pageSize} onChange={handleChange} min="1" max="100" />
        </div>
        {settings.customFields.map(field => (
          <div key={field.fieldId}>
            <label htmlFor={field.fieldId}>{field.fieldId}:</label>
            <input
              type="text"
              name={field.fieldId}
              value={field.value.toString()}
              onChange={(e) => handleCustomFieldChange(field.fieldId, e.target.value)}
            />
          </div>
        ))}
        <button type="submit" disabled={isLoading}>Save Settings</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SettingsPage;