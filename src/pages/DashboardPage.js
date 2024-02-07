import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingService, ProductService, TenantService } from '../services';
import { useAuth, useTenant, useWebSocket } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import NotifierContext from '../contexts/NotifierContext';
import LoadingIndicator from '../components/common/LoadingIndicator';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const { messages } = useWebSocket();
  const navigate = useNavigate();
  const notifier = useContext(NotifierContext);

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
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}</h1>
      <SystemHealthIndicator status={systemHealth.status} />
      <ProductList products={products} onSelect={handleProductSelect} />
      <StrategyList strategies={strategies} onSelect={handleStrategySelect} />
      <button onClick={fetchDashboardData} disabled={loading}>Refresh Data</button>
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

// Extended interfaces with additional analytics and metadata
interface Product extends BasicProduct {
  salesData: SalesData[];
  feedback: ProductFeedback[];
}

interface Strategy extends BasicStrategy {
  performanceMetrics: StrategyPerformanceMetrics;
}

interface SalesData {
  date: Date;
  unitsSold: number;
}

interface ProductFeedback {
  userId: string;
  rating: number;
  comment: string;
  date: Date;
}

interface StrategyPerformanceMetrics {
  effectivenessRating: number;
  appliedCount: number;
  successRate: number;
}

// New interface for real-time notifications within the dashboard
interface DashboardNotification {
  id: string;
  type: 'SystemHealth' | 'ProductUpdate' | 'StrategyUpdate';
  message: string;
  timestamp: Date;
}import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardPage = () => {
    const [pricingStrategies, setPricingStrategies] = useState([]);
    const [subscriptionDetails, setSubscriptionDetails] = useState({});
    const [systemHealth, setSystemHealth] = useState({});
    const [isAdmin, setIsAdmin] = useState(false); // This should be set based on user role

    useEffect(() => {
        // Fetch Pricing Strategies
        const fetchPricingStrategies = async () => {
            try {
                const { data } = await axios.get('/api/pricing');
                setPricingStrategies(data);
            } catch (error) {
                console.error('Error fetching pricing strategies', error);
            }
        };

        // Fetch Subscription Details
        const fetchSubscriptionDetails = async () => {
            try {
                const { data } = await axios.get('/api/subscriptions');
                setSubscriptionDetails(data);
            } catch (error) {
                console.error('Error fetching subscription details', error);
            }
        };

        // Fetch System Health (for admins)
        const fetchSystemHealth = async () => {
            if (isAdmin) {
                try {
                    const { data } = await axios.get('/api/system-health');
                    setSystemHealth(data);
                } catch (error) {
                    console.error('Error fetching system health status', error);
                }
            }
        };

        fetchPricingStrategies();
        fetchSubscriptionDetails();
        if (isAdmin) {
            fetchSystemHealth();
        }
    }, [isAdmin]);

    return (
        <div className="dashboard-page">
            <h2>Dashboard</h2>
            <section>
                <h3>Recent Pricing Strategies</h3>
                {pricingStrategies.map(strategy => (
                    <div key={strategy.id}>{strategy.name}</div>
                ))}
            </section>
            <section>
                <h3>Subscription Details</h3>
                <div>Plan: {subscriptionDetails.plan}</div>
                <div>Status: {subscriptionDetails.status}</div>
            </section>
            {isAdmin && (
                <section>
                    <h3>System Health</h3>
                    <div>Status: {systemHealth.status}</div>
                </section>
            )}
        </div>
    );
};

export default DashboardPage;
