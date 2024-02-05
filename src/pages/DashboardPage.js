import React, { useState, useEffect } from 'react';
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
