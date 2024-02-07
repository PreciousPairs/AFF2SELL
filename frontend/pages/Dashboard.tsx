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
}

// Include this panel in the DashboardPage for users to access customization options.
const DashboardCustomizationPanel: React.FC<UserPreferencesProps> = ({ preferences, updatePreferences }) => {
  // Panel for users to customize dashboard settings, like theme, layout, etc.
};

// Dynamically render content based on user role
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

// Feedback form for users to submit feedback from the dashboard
const DashboardFeedbackForm: React.FC = () => {
  // Form for submitting feedback from the dashboard
};