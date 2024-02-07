import { useState, useEffect, useCallback } from 'react';
import { fetchSubscriptions, addSubscription, updateSubscription, deleteSubscription } from '../services/subscriptionService';

const useSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadSubscriptions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchSubscriptions();
            setSubscriptions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions]);

    const addNewSubscription = async (subscriptionData) => {
        try {
            const newSubscription = await addSubscription(subscriptionData);
            setSubscriptions(prev => [...prev, newSubscription]);
        } catch (err) {
            setError(err.message);
        }
    };

    const updateExistingSubscription = async (id, subscriptionData) => {
        try {
            const updatedSubscription = await updateSubscription(id, subscriptionData);
            setSubscriptions(prev => prev.map(subscription => subscription.id === id ? updatedSubscription : subscription));
        } catch (err) {
            setError(err.message);
        }
    };

    const removeSubscription = async (id) => {
        try {
            await deleteSubscription(id);
            setSubscriptions(prev => prev.filter(subscription => subscription.id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return { subscriptions, loading, error, addNewSubscription, updateExistingSubscription, removeSubscription };
};
