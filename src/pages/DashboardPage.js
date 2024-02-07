import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PricingService,
  ProductService,
  TenantService,
  SubscriptionService,
  SystemHealthService,
} from '../services';
import { useAuth, useTenant, useWebSocket } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import NotifierContext from '../contexts/NotifierContext';
import LoadingIndicator from '../components/common/LoadingIndicator';
import axios from 'axios';
import ErrorBoundary from '../components/common/ErrorBoundary';
import FilterComponent from '../components/FilterComponent';
import PaginationComponent from '../components/PaginationComponent';
import { Product, Strategy, SystemHealth, SubscriptionDetails } from '../types'; // Assuming these types are defined in your project

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const { messages } = useWebSocket('/path/to/websocket');
  const navigate = useNavigate();
  const notifier = useContext(NotifierContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [subscriptionDetails, setSubscriptionDetails] = useState<SubscriptionDetails>({});
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
      switch (msg.type) {
        case 'SYSTEM_HEALTH_UPDATE':
          setSystemHealth(prevState => ({ ...prevState, ...msg.status }));
          break;
        case 'PRODUCT_UPDATE':
          setProducts(prev => [...prev, msg.product]);
          break;
        case 'STRATEGY_UPDATE':
          setStrategies(prev => [...prev, msg.strategy]);
          break;
        default:
          console.log('Unhandled message type:', msg.type);
      }
    });
  }, [messages]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedStrategies, fetchedSubscriptionDetails, healthStatus] = await Promise.all([
        ProductService.fetchProducts(tenant.id),
        PricingService.fetchStrategies(tenant.id),
        SubscriptionService.fetchDetails(tenant.id),
        SystemHealthService.fetchStatus(tenant.id),
      ]);
      setProducts(fetchedProducts);
      setStrategies(fetchedStrategies);
      setSubscriptionDetails(fetchedSubscriptionDetails);
      setSystemHealth(healthStatus);
    } catch (error) {
      notifier.notifyError('Failed to load dashboard data. Please try again later.');
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <ErrorBoundary>
      <div className="dashboard">
        <h1>Welcome, {user?.name}</h1>
        <SystemHealthIndicator status={systemHealth.status} lastChecked={systemHealth.lastChecked} issues={systemHealth.issues} />
        <FilterComponent onFilterChange={fetchDashboardData} />
        <ProductList products={products} onSelect={handleProductSelect} />
        <PaginationComponent data={products} onPageChange={fetchDashboardData} />
        <StrategyList strategies={strategies} onSelect={handleStrategySelect} />
        {user?.role === 'admin' && (
          <div>
            <h3>Subscription Details</h3>
            <p>Plan: {subscriptionDetails.plan}</p>
            <p>Status: {subscriptionDetails.status}</p>
            <h3>System Health</h3>
            <p>Status: {systemHealth.status}</p>
          </div>
        )}
        <button onClick={fetchDashboardData} disabled={loading}>Refresh Data</button>
      </div>
    </ErrorBoundary>
  );

  function handleProductSelect(productId: string) {
    navigate(`/products/${productId}`);
  }

  function handleStrategySelect(strategyId: string) {
    navigate(`/strategies/${strategyId}`);
  }
};

export default DashboardPage;