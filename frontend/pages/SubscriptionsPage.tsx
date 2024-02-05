import React, { useEffect, useState } from 'react';
import SubscriptionService from '../services/SubscriptionService';

const SubscriptionsPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState([]);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        try {
            const fetchedSubscriptions = await SubscriptionService.fetchSubscriptions();
            setSubscriptions(fetchedSubscriptions);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
        }
    };

    return (
        <div>
            <h1>Subscriptions</h1>
            <ul>
                {subscriptions.map(subscription => (
                    <li key={subscription.id}>{subscription.plan} - {subscription.status}</li>
                ))}
            </ul>
            {/* Add functionality to create, update, and delete subscriptions */}
        </div>
    );
};

export default SubscriptionsPage;
