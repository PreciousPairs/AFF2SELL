import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingService, UserService, SubscriptionService, TenantService } from '../services';
import { useAuth, useTenant } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import Notifier from '../components/common/Notifier';
// Assume all necessary components are imported correctly

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const [products, setProducts] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [systemHealth, setSystemHealth] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [tenant, isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const fetchedProducts = await ProductService.fetchProducts(tenant.id);
      const fetchedStrategies = await PricingService.fetchStrategies(tenant.id);
      const healthStatus = await TenantService.getSystemHealth(tenant.id);
      setProducts(fetchedProducts);
      setStrategies(fetchedStrategies);
      setSystemHealth(healthStatus);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      Notifier.notifyError('Failed to load dashboard data');
    }
  };

  // Handlers for product and strategy selection
  const handleProductSelect = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleStrategySelect = (strategyId: string) => {
    navigate(`/strategies/${strategyId}`);
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <SystemHealthIndicator status={systemHealth} />
      <ProductList products={products} onSelect={handleProductSelect} />
      <StrategyList strategies={strategies} onSelect={handleStrategySelect} />
      {/* Additional components and functionalities as needed */}
    </div>
  );
};

export default DashboardPage;
