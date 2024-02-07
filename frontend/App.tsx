import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';
import ProductDetailPage from './pages/ProductDetailPage'; // Assuming this exists
import StrategyDetailPage from './pages/StrategyDetailPage'; // Assuming this exists
import { AuthProvider } from './hooks/useAuth';
import { TenantProvider } from './hooks/useTenant';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <TenantProvider>
                    <div className="app-container">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/pricing" element={<PricingPage />} />
                                <Route path="/products/:productId" element={<ProductDetailPage />} />
                                <Route path="/strategies/:strategyId" element={<StrategyDetailPage />} />
                                {/* Add more routes as needed */}
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </TenantProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;