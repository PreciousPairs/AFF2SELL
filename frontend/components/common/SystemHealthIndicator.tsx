// /frontend/components/common/SystemHealthIndicator.tsx

import React from 'react';

interface SystemHealthIndicatorProps {
  status: 'healthy' | 'degraded' | 'down';
}

const SystemHealthIndicator: React.FC<SystemHealthIndicatorProps> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'green';
      case 'degraded':
        return 'yellow';
      case 'down':
        return 'red';
      default:
        return 'gray'; // Default color for unknown status
    }
  };

  return (
    <div style={{ color: getStatusColor(status) }}>
      System Status: <strong>{status.toUpperCase()}</strong>
    </div>
  );
};

export default SystemHealthIndicator;
