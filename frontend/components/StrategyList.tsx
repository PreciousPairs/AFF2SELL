// /frontend/components/StrategyList.tsx
import React from 'react';
import { PricingStrategy } from '../types'; // Assuming PricingStrategy type is defined

interface StrategyListProps {
    strategies: PricingStrategy[];
    onSelect: (strategyId: string) => void;
}

const StrategyList: React.FC<StrategyListProps> = ({ strategies, onSelect }) => {
    return (
        <ul>
            {strategies.map((strategy) => (
                <li key={strategy.id} onClick={() => onSelect(strategy.id)}>
                    {strategy.name}
                </li>
            ))}
        </ul>
    );
};

export default StrategyList;
