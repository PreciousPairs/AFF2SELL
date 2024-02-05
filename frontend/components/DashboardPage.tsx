import React from 'react';
import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, logout, error } = useAuth();

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <header>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default DashboardPage;
