import { useTenant } from '../hooks/useTenant';

// Inside DashboardPage component
const { tenantSettings } = useTenant();
// Use tenantSettings to adjust UI dynamically
