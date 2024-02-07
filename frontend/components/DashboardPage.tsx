import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingIndicator from '../components/common/LoadingIndicator';
import ErrorMessage from '../components/common/ErrorMessage';
import ProfileSettings from '../components/ProfileSettings';
import NotificationList from '../components/NotificationList';
import { fetchUserNotifications } from '../services/notificationService';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, error, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState<boolean>(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardData = async () => {
    try {
      const fetchedNotifications = await fetchUserNotifications(user.id);
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (error) {
    return <ErrorMessage message={`Error: ${error}`} />;
  }

  if (!user) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <header>
        <span>Welcome, {user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <section>
        <h2>Profile Settings</h2>
        <ProfileSettings user={user} />
      </section>
      <section>
        <h2>Notifications</h2>
        {loadingNotifications ? (
          <LoadingIndicator />
        ) : (
          <NotificationList notifications={notifications} />
        )}
      </section>
      <section>
        <h2>Recent Activity</h2>
        {/* Add recent activity component */}
      </section>
    </div>
  );
};

export default DashboardPage;