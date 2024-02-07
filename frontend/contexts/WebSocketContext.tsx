import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the WebSocketContext
const WebSocketContext = createContext<any>(null);

// Define the WebSocketProvider component
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const apiUrl = 'wss://your-api-websocket-url'; // Replace 'your-api-websocket-url' with your actual WebSocket URL
        const ws = new WebSocket(apiUrl);
        setSocket(ws);

        ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        return () => {
            ws.close();
        };
    }, []);

    // Provide the WebSocket context value to children components
    return (
        <WebSocketContext.Provider value={{ messages }}>
            {children}
        </WebSocketContext.Provider>
    );
};

// Define the useWebSocket hook to consume the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);