// /frontend/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<any>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        // Initialize WebSocket connection
        const ws = new WebSocket('wss://your-api-websocket-url');
        setSocket(ws);

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => {
            ws.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
