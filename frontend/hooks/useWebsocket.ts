import { useEffect, useState } from 'react';

interface Message {
  type: string;
  data: any;
}

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onmessage = (event) => {
      const message: Message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    return () => {
      ws.close();
    };
  }, [url]);

  return { messages, socket };
};