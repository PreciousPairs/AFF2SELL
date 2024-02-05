// /frontend/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage'; // Assuming this exists
import { AuthProvider } from './hooks/useAuth';
import { TenantProvider } from './hooks/useTenant'; // Assuming useTenant is context-based
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './styles/App.css'; // Assuming a centralized stylesheet

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <TenantProvider> 
                    {/* Wrap the entire app with Auth and Tenant context providers */}
                    <div className="app-container">
                        <Header />
                        <main>
                            <Routes>
                                <Route path="/" element={<DashboardPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/settings" element={<SettingsPage />} />
                                <Route path="/pricing" element={<PricingPage />} />
                                <Route path="/products/:productId" element={<ProductDetailPage />} />
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
