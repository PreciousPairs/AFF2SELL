import { useAuth } from '../hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </header>
  );
};
