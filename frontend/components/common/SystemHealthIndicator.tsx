// /frontend/components/common/SystemHealthIndicator.tsx
import React from 'react';

interface SystemHealthIndicatorProps {
    status: 'healthy' | 'degraded' | 'down';
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ status }) => {
    let statusColor = '#2ecc71'; // green for healthy
    if (status === 'degraded') {
        statusColor = '#f1c40f'; // yellow for degraded
    } else if (status === 'down') {
        statusColor = '#e74c3c'; // red for down
    }

    return (
        <div style={{ backgroundColor: statusColor, color: 'white', padding: '10px', borderRadius: '5px' }}>
            System Status: {status.toUpperCase()}
        </div>
    );
};

export default SystemHealthIndicator;
