import React, { useEffect, useState } from 'react';
import StrategyService from '../services/StrategyService';
import StrategyForm from '../components/StrategyForm'; // Assume this is a form component for strategy data
import Notifier from '../components/common/Notifier';

const StrategyManagementPage: React.FC = () => {
    const [strategies, setStrategies] = useState([]);
    const [selectedStrategy, setSelectedStrategy] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchStrategies();
    }, []);

    const fetchStrategies = async () => {
        try {
            const fetchedStrategies = await StrategyService.fetchStrategies();
            setStrategies(fetchedStrategies);
        } catch (error) {
            console.error('Error fetching strategies:', error);
            Notifier.notifyError('Failed to load strategies.');
        }
    };

    const handleCreateNewStrategy = () => {
        setSelectedStrategy(null);
        setIsEditing(true);
    };

    const handleEditStrategy = (strategy) => {
        setSelectedStrategy(strategy);
        setIsEditing(true);
    };

    const handleDeleteStrategy = async (strategyId) => {
        try {
            await StrategyService.deleteStrategy(strategyId);
            fetchStrategies(); // Refresh the list after deletion
            Notifier.notifySuccess('Strategy deleted successfully.');
        } catch (error) {
            console.error(`Error deleting strategy with ID ${strategyId}:`, error);
            Notifier.notifyError('Failed to delete strategy.');
        }
    };

    return (
        <div>
            <h1>Strategy Management</h1>
            <button onClick={handleCreateNewStrategy}>Create New Strategy</button>
            {isEditing && <StrategyForm strategy={selectedStrategy} />}
            <ul>
                {strategies.map(strategy => (
                    <li key={strategy.id}>
                        {strategy.name}
                        <button onClick={() => handleEditStrategy(strategy)}>Edit</button>
                        <button onClick={() => handleDeleteStrategy(strategy.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StrategyManagementPage;
