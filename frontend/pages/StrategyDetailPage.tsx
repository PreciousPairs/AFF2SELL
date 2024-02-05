// /frontend/pages/StrategyDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PricingStrategyService } from '../services/PricingStrategyService';
import Notifier from '../components/common/Notifier';

const StrategyDetailPage: React.FC = () => {
    const { strategyId } = useParams<{ strategyId: string }>();
    const [strategy, setStrategy] = useState<any | null>(null); // Define a more specific type
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStrategy = async () => {
            try {
                const fetchedStrategy = await PricingStrategyService.fetchStrategyById(strategyId);
                setStrategy(fetchedStrategy);
            } catch (error) {
                Notifier.notifyError('Failed to fetch strategy details');
            }
        };
        fetchStrategy();
    }, [strategyId]);

    const handleDelete = async () => {
        try {
            await PricingStrategyService.deleteStrategy(strategyId);
            Notifier.notifySuccess('Strategy successfully deleted');
            navigate('/strategies'); // Assuming you have a route set up for listing strategies
        } catch (error) {
            Notifier.notifyError('Failed to delete strategy');
        }
    };

    // Add form and logic for updating strategy details

    return (
        <div>
            <h1>Strategy Details</h1>
            {strategy && (
                <>
                    <p>{strategy.name}</p>
                    {/* Display more strategy details */}
                    <button onClick={handleDelete}>Delete Strategy</button>
                    {/* Add button and functionality for editing strategy details */}
                </>
            )}
        </div>
    );
};

export default StrategyDetailPage;
