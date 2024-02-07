import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PricingService, ProductService, TenantService } from '../services';
import { useAuth, useTenant, useWebSocket } from '../hooks';
import ProductList from '../components/ProductList';
import StrategyList from '../components/StrategyList';
import SystemHealthIndicator from '../components/common/SystemHealthIndicator';
import Notifier from '../components/common/Notifier';
import LoadingIndicator from '../components/common/LoadingIndicator';

// Assuming these interfaces are defined according to your data structure
interface Product {
  id: string;
  name: string;
  description: string;
  msrp: number; // Manufacturer's Suggested Retail Price
  salePrice: number; // Current sale price
  stockLevel: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  upc: string; // Universal Product Code
  tags: string[];
  customFields: Record<string, any>;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  type: 'dynamicPricing' | 'fixedPricing' | 'discountBased';
  rules: PricingRule[];
  isActive: boolean;
  targetProducts: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
}

interface PricingRule {
  id: string;
  condition: RuleCondition;
  action: RuleAction;
  priority: number;
}

interface RuleCondition {
  type: 'price' | 'stockLevel' | 'category' | 'tag';
  comparison: 'equals' | 'greaterThan' | 'lessThan' | 'includes';
  value: string | number | boolean;
}

interface RuleAction {
  type: 'setPrice' | 'increaseBy' | 'decreaseBy' | 'applyDiscount';
  amount: number;
}

interface SystemHealth {
  status: 'good' | 'warning' | 'critical';
  lastChecked: Date;
  issues: SystemIssue[];
}

interface SystemIssue {
  id: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  detectedAt: Date;
  resolvedAt?: Date;
  metadata: Record<string, any>;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { tenant } = useTenant();
  const { messages } = useWebSocket(); // Use WebSocket context for real-time updates
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({ status: 'good' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [tenant, isAuthenticated]);

  useEffect(() => {
    // Handle real-time updates for system health, products, and strategies
    messages.forEach(msg => {
      switch (msg.type) {
        case 'SYSTEM_HEALTH_UPDATE':
          setSystemHealth(msg.status);
          break;
        case 'PRODUCT_UPDATE':
          setProducts(prev => [...prev, msg.product]); // Simplified; adjust based on actual message structure
          break;
        case 'STRATEGY_UPDATE':
          setStrategies(prev => [...prev, msg.strategy]); // Simplified; adjust based on actual message structure
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
      Notifier.notifyError('Failed to load dashboard data. Please try again later.');
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
      {/* Consider adding a "Refresh" button to manually refresh dashboard data */}
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