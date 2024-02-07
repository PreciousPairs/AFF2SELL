import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingService, ProductService, TenantService } from '../services';
import { useAuth, useTenant, useWebSocket } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import NotifierContext from '../contexts/NotifierContext';
import LoadingIndicator from '../components/common/LoadingIndicator';
import DashboardCustomizationPanel from '../components/DashboardCustomizationPanel';
import DashboardFeedbackForm from '../components/DashboardFeedbackForm';

// Assuming additional components AdminDashboardContent, UserDashboardContent, and DefaultDashboardContent are implemented

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const { messages } = useWebSocket('/dashboard-notifications');
  const navigate = useNavigate();
  const notifier = useContext(NotifierContext);
  const [preferences, setPreferences] = useState<UserPreferences>({ /* Initial preferences state */ });

  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({ status: 'good', lastChecked: new Date(), issues: [] });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [tenant, isAuthenticated, navigate]);

  useEffect(() => {
    messages.forEach(msg => {
      // Handle different types of real-time notifications
    });
  }, [messages]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedStrategies, healthStatus] = await Promise.all([
        ProductService.fetchProducts(tenant.id),
        PricingService.fetchStrategies(tenant.id),
        TenantService.getSystemHealth(tenant.id),
      ]);
      setProducts(fetchedProducts);
      setStrategies(fetchedStrategies);
      setSystemHealth(healthStatus);
    } catch (error) {
      notifier.notifyError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = (updatedPreferences: UserPreferences) => {
    // Update user preferences state
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <SystemHealthIndicator status={systemHealth.status} />
      <ProductList products={products} onSelect={(id) => navigate(`/products/${id}`)} />
      <StrategyList strategies={strategies} onSelect={(id) => navigate(`/strategies/${id}`)} />
      <DashboardCustomizationPanel preferences={preferences} updatePreferences={updatePreferences} />
      {renderDashboardContent(user)}
      <DashboardFeedbackForm />
      <button onClick={fetchDashboardData} disabled={loading}>Refresh Data</button>
    </div>
  );
};

const renderDashboardContent = (user: User) => {
  switch (user.role) {
    case 'admin':
      return <AdminDashboardContent />;
    case 'user':
      return <UserDashboardContent />;
    default:
      return <DefaultDashboardContent />;
  }
};

export default DashboardPage;