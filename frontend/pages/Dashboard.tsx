import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingService, ProductService, TenantService } from '../services';
import { useAuth, useTenant, useWebSocket } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import Notifier from '../components/common/Notifier';
import LoadingIndicator from '../components/common/LoadingIndicator'; // Assuming this component exists for loading states

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const { messages } = useWebSocket(); // Use WebSocket context for real-time updates
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const [loading, setLoading] = useState(true); // State to manage loading indicator

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [tenant, isAuthenticated, navigate]);

  useEffect(() => {
    // Real-time update handling
    const healthUpdate = messages.find(msg => msg.type === 'SYSTEM_HEALTH_UPDATE');
    if (healthUpdate) {
      setSystemHealth(healthUpdate.status);
    }
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
      console.error('Failed to load dashboard data:', error);
      Notifier.notifyError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <SystemHealthIndicator status={systemHealth.status} />
      <ProductList products={products} onSelect={handleProductSelect} />
      <StrategyList strategies={strategies} onSelect={handleStrategySelect} />
      {/* Additional UI components and functionalities */}
    </div>
  );

  function handleProductSelect(productId: string) {
    navigate(`/products/${productId}`);
  }

  function handleStrategySelect(strategyId: string) {
    navigate(`/strategies/${strategyId}`);
  }
};

export default DashboardPage;
