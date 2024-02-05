import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false); // This should be determined by user role

    useEffect(() => {
        // Fetch subscription details
        const fetchSubscriptions = async () => {
            const { data } = await axios.get('/api/subscriptions');
            setSubscriptions(data);
        };
        fetchSubscriptions();
    }, []);

    const handleCancelSubscription = async (subscriptionId) => {
        try {
            await axios.delete(`/api/subscriptions/${subscriptionId}`);
            setSubscriptions(subscriptions.filter(sub => sub.id !== subscriptionId));
            alert('Subscription cancelled successfully.');
        } catch (error) {
            console.error('Failed to cancel subscription', error);
            alert('Failed to cancel subscription.');
        }
    };

    return (
        <div className="subscription-page">
            <h2>Subscription Management</h2>
            {isAdmin ? (
                <div className="subscription-list">
                    {subscriptions.map(subscription => (
                        <div key={subscription.id}>
                            <p>User ID: {subscription.userId}</p>
                            <p>Plan: {subscription.plan}</p>
                            <p>Status: {subscription.status}</p>
                            <button onClick={() => handleCancelSubscription(subscription.id)}>Cancel Subscription</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p>Your Plan: {subscriptions[0]?.plan}</p>
                    <p>Status: {subscriptions[0]?.status}</p>
                    <button onClick={() => handleCancelSubscription(subscriptions[0]?.id)}>Cancel Subscription</button>
                </div>
            )}
        </div>
    );
};

export default SubscriptionPage;
