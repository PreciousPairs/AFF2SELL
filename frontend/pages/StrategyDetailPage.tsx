import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PricingStrategyService } from '../services/PricingStrategyService';
import Notifier from '../components/common/Notifier';
import LoadingIndicator from '../components/common/LoadingIndicator'; // Import LoadingIndicator component for loading state
import ErrorMessage from '../components/common/ErrorMessage'; // Import ErrorMessage component for error state

const StrategyDetailPage: React.FC = () => {
    const { strategyId } = useParams<{ strategyId: string }>();
    const [strategy, setStrategy] = useState<any | null>(null); // Define a more specific type
    const [isLoading, setIsLoading] = useState<boolean>(true); // Define loading state
    const [isError, setIsError] = useState<boolean>(false); // Define error state
    const [errorMessage, setErrorMessage] = useState<string>(''); // Define error message
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStrategy = async () => {
            setIsLoading(true);
            setIsError(false);
            try {
                const fetchedStrategy = await PricingStrategyService.fetchStrategyById(strategyId);
                setStrategy(fetchedStrategy);
            } catch (error) {
                setIsError(true);
                setErrorMessage('Failed to fetch strategy details');
                Notifier.notifyError('Failed to fetch strategy details');
            } finally {
                setIsLoading(false);
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

    return (
        <div>
            <h1>Strategy Details</h1>
            {isLoading && <LoadingIndicator />} {/* Display loading indicator */}
            {isError && <ErrorMessage message={errorMessage} />} {/* Display error message */}
            {strategy && (
                <>
                    <p>Name: {strategy.name}</p>
                    {/* Display more strategy details */}
                    <div>
                        <button onClick={handleDelete}>Delete Strategy</button>
                        {/* Add button and functionality for editing strategy details */}
                        <Link to={`/strategies/${strategyId}/edit`}>
                            <button>Edit Strategy</button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default StrategyDetailPage;