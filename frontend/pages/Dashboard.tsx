import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import ProductService from '../services/ProductService';
import PricingService from '../services/PricingService';
import HealthService from '../services/HealthService';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/SystemHealthIndicator';
import LoadingSpinner from '../components/LoadingSpinner'; // Assume this is a generic loading spinner component
import AlertComponent from '../components/AlertComponent'; // Assume this handles error and success messages
import { Product, PricingStrategy, SystemHealth } from '../types';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useContext(AuthContext);
  const { sendMessage, receiveMessage } = useContext(WebSocketContext);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const subscription = receiveMessage((message) => {
      if (message.type === 'PRICE_UPDATE' || message.type === 'STRATEGY_UPDATE') {
        loadInitialData();
      }
    });
    return () => subscription.unsubscribe();
  }, [receiveMessage]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedStrategies, healthStatus] = await Promise.all([
        ProductService.fetchProducts(),
        PricingService.fetchStrategies(),
        HealthService.getSystemHealth(),
      ]);
      setProducts(fetchedProducts);
      setStrategies(fetchedStrategies);
      setSystemHealth(healthStatus);
      setError(null);
    } catch (error) {
      setError('Failed to load data. Please refresh the page or contact support if the issue persists.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      {error && <AlertComponent type="error" message={error} />}
      {systemHealth && <SystemHealthIndicator status={systemHealth} />}
      <ProductList products={products} onProductUpdate={() => loadInitialData()} />
      <StrategyList strategies={strategies} onStrategyUpdate={() => loadInitialData()} />
    </div>
  );
};

export default Dashboard;
