import React, { useEffect, useState } from 'react';
import SubscriptionService from '../services/SubscriptionService';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import SubscriptionForm from '../components/SubscriptionForm';

const SubscriptionsPage: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        setIsError(false);
        try {
            const fetchedSubscriptions = await SubscriptionService.fetchSubscriptions();
            setSubscriptions(fetchedSubscriptions);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Error fetching subscriptions');
            console.error('Error fetching subscriptions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateSubscription = async (newSubscription: any) => {
        try {
            const createdSubscription = await SubscriptionService.createSubscription(newSubscription);
            setSubscriptions(prevSubscriptions => [...prevSubscriptions, createdSubscription]);
        } catch (error) {
            console.error('Error creating subscription:', error);
            setIsError(true);
            setErrorMessage('Failed to create subscription. Please try again.');
        }
    };

    const handleUpdateSubscription = async (updatedSubscription: any) => {
        try {
            await SubscriptionService.updateSubscription(updatedSubscription);
            setSubscriptions(prevSubscriptions =>
                prevSubscriptions.map(subscription =>
                    subscription.id === updatedSubscription.id ? updatedSubscription : subscription
                )
            );
        } catch (error) {
            console.error('Error updating subscription:', error);
            setIsError(true);
            setErrorMessage('Failed to update subscription. Please try again.');
        }
    };

    const handleDeleteSubscription = async (subscriptionId: string) => {
        try {
            await SubscriptionService.deleteSubscription(subscriptionId);
            setSubscriptions(prevSubscriptions =>
                prevSubscriptions.filter(subscription => subscription.id !== subscriptionId)
            );
        } catch (error) {
            console.error('Error deleting subscription:', error);
            setIsError(true);
            setErrorMessage('Failed to delete subscription. Please try again.');
        }
    };

    if (isLoading) return <LoadingIndicator />;
    if (isError) return <ErrorMessage message={errorMessage} />;

    return (
        <div>
            <h1>Subscriptions</h1>
            <ul>
                {subscriptions.map(subscription => (
                    <li key={subscription.id}>
                        {subscription.plan} - {subscription.status}
                        <button onClick={() => handleUpdateSubscription(subscription)}>Edit</button>
                        <button onClick={() => handleDeleteSubscription(subscription.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <SubscriptionForm onSubmit={handleCreateSubscription} />
        </div>
    );
};

export default SubscriptionsPage;