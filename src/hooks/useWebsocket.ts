import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Custom WebSocket Hook
 * @param {string} url - WebSocket server URL
 * @param {number} reconnectInterval - Time in ms before reconnecting
 * @returns {object} - { messages, sendMessage, status }
 */
interface WebSocketHook {
    messages: string[];
    sendMessage: (message: string) => void;
    status: 'connecting' | 'connected' | 'disconnected' | 'error';
}
const useWebSocket = (url: string, reconnectInterval: number = 3000) => {
    const [messages, setMessages] = useState<string>('');
    const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
    const socketRef = useRef<WebSocket | null>(null);
    const connectWebSocket = useCallback(() => {
        socketRef.current = new WebSocket(url);
        socketRef.current.onopen = () => {
            // console.log('Connected to WebSocket server.');
            if (socketRef?.current) socketRef?.current.send(JSON.stringify({ client_type: 'frontend' }));
            setStatus('connected');
        };

        socketRef.current.onmessage = (event) => {
            // console.log('Received message: ', event.data);
            setMessages(event.data);
        };

        socketRef.current.onerror = (error) => {
            // console.error('WebSocket error: ', error);
            setStatus('error');
        };

        socketRef.current.onclose = () => {
            // console.log('WebSocket closed. Attempting reconnect...');
            setStatus('disconnected');
            // setTimeout(connectWebSocket, reconnectInterval); // Reconnect
        };
    }, [url, reconnectInterval]);

    useEffect(() => {
        return () => socketRef.current?.close();
    }, [url, reconnectInterval]);

    // Function to send a message
    const sendMessage = (message: object) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        }
    };
    // Function to manually close the WebSocket connection
    const closeWebSocket = () => {
        socketRef.current?.close();
    };

    return { messages, sendMessage, status, connectWebSocket, closeWebSocket };
};

export default useWebSocket;
