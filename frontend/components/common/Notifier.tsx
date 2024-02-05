// /frontend/components/common/Notifier.tsx

import React, { useState, useEffect } from 'react';

type NotificationType = 'error' | 'info' | 'success';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

let nextId = 0;

const Notifier: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Function to trigger notifications
  const notify = (type: NotificationType, message: string) => {
    const notification = { id: nextId++, type, message };
    setNotifications((prev) => [...prev, notification]);

    // Automatically dismiss after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  // Expose the notify function globally or via context if needed
  // For simplicity, we'll assume global exposure here
  useEffect(() => {
    window.notify = notify;
  }, []);

  return (
    <div className="notifier">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      ))}
    </div>
  );
};

/* Notifier container */
.notifier {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Base styles for individual notifications */
.notification {
  padding: 10px 20px;
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  animation: slideIn 0.3s ease-out forwards;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Type-specific styles */
.notification.error {
  background-color: #d32f2f; /* Red */
}

.notification.info {
  background-color: #1976d2; /* Blue */
}

.notification.success {
  background-color: #388e3c; /* Green */
}


export default Notifier;
