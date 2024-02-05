import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PricingStrategyPage = () => {
    const [strategies, setStrategies] = useState([]);
    const [newStrategy, setNewStrategy] = useState({ name: '', criteria: '', actions: '', isActive: false });

    useEffect(() => {
        // Fetch existing pricing strategies
        const fetchStrategies = async () => {
            const { data } = await axios.get('/api/pricing');
            setStrategies(data);
        };
        fetchStrategies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewStrategy(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/pricing', newStrategy);
            setStrategies([...strategies, newStrategy]);
            setNewStrategy({ name: '', criteria: '', actions: '', isActive: false }); // Reset form
            alert('Pricing strategy added successfully!');
        } catch (error) {
            console.error('Failed to add pricing strategy', error);
            alert('Failed to add pricing strategy.');
        }
    };

    return (
        <div className="pricing-strategy-page">
            <h2>Pricing Strategy Management</h2>
            <div className="strategy-form">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Strategy Name" value={newStrategy.name} onChange={handleInputChange} required />
                    <input type="text" name="criteria" placeholder="Criteria" value={newStrategy.criteria} onChange={handleInputChange} required />
                    <input type="text" name="actions" placeholder="Actions" value={newStrategy.actions} onChange={handleInputChange} required />
                    <label>
                        <input type="checkbox" name="isActive" checked={newStrategy.isActive} onChange={handleInputChange} />
                        Active
                    </label>
                    <button type="submit">Add Strategy</button>
                </form>
            </div>
            <div className="strategy-list">
                <h3>Existing Strategies</h3>
                {strategies.map((strategy, index) => (
                    <div key={index}>
                        <p>Name: {strategy.name}</p>
                        <p>Criteria: {strategy.criteria}</p>
                        <p>Actions: {strategy.actions}</p>
                        <p>Status: {strategy.isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingStrategyPage;
