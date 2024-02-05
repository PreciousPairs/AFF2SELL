// /frontend/contexts/NotificationContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

type NotificationType = 'error' | 'info' | 'success';
interface Notification { id: number; type: NotificationType; message: string; }
interface NotificationContextType { notify: (type: NotificationType, message: string) => void; }

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let nextId = 0;

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notify = (type: NotificationType, message: string) => {
        const notification: Notification = { id: nextId++, type, message };
        setNotifications((prev) => [...prev, notification]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 5000);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {/* Notification display component can also be included here */}
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
