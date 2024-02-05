// Dashboard.tsx located at /frontend/pages/Dashboard.tsx
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { WebSocketContext } from '../contexts/WebSocketContext';
import ProductService from '../services/ProductService';
import PricingService from '../services/PricingService';
import HealthService from '../services/HealthService';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/SystemHealthIndicator';
import { Product, PricingStrategy, SystemHealth } from '../types'; // Assume these types are defined according to your data structure

const Dashboard: React.FC = () => {
  // State hooks for managing data with proper typing
  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<PricingStrategy[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);

  // Contexts for managing user and real-time data
  const { user } = useContext(AuthContext);
  const { messages } = useContext(WebSocketContext);

  // Effects for initial data loading and listening to WebSocket messages
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    handleRealTimeUpdates();
  }, [messages]);

  // Function to load products, strategies, and system health with error handling
  const loadInitialData = async () => {
    try {
      const [fetchedProducts, fetchedStrategies, healthStatus] = await Promise.all([
        ProductService.fetchProducts(),
        PricingService.fetchStrategies(),
        HealthService.getSystemHealth(),
      ]);
      setProducts(fetchedProducts);
      setStrategies(fetchedStrategies);
      setSystemHealth(healthStatus);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Optionally, implement a mechanism to display errors to the user
    }
  };

  // Function to handle real-time updates via WebSocket
  const handleRealTimeUpdates = () => {
    messages.forEach((message) => {
      // Example: Refresh data on PRICE_UPDATE messages
      if (message.type === 'PRICE_UPDATE') {
        loadInitialData(); // Reload data to reflect changes
      }
      // Additional real-time message handling can be implemented here
    });
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      {systemHealth && <SystemHealthIndicator status={systemHealth} />}
      <ProductList products={products} />
      <StrategyList strategies={strategies} />
      {/* Additional UI components and functionalities can be added here */}
    </div>
  );
};

export default Dashboard;
