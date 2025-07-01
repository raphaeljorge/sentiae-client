import { useEffect, useRef, useState } from 'react';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { LanguageClientManager } from '../services/language-client';

const SERVER_URL = 'ws://localhost:3001'; // Update this with your language server URL

export function useLanguageClient(monaco: any) {
  const clientManager = useRef<LanguageClientManager | null>(null);
  const [client, setClient] = useState<MonacoLanguageClient | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!monaco) return;

    // Initialize the client manager
    clientManager.current = new LanguageClientManager(monaco);

    // Connect to the language server
    const connectToServer = async () => {
      try {
        const newClient = await clientManager.current?.connect(SERVER_URL);
        if (newClient) {
          setClient(newClient);
          setError(null);
          console.log('Language Server Connected');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to connect to language server'));
        console.error('Failed to connect to language server:', err);
      }
    };

    connectToServer();

    // Cleanup on unmount
    return () => {
      clientManager.current?.disconnect().catch(console.error);
    };
  }, [monaco]);

  return {
    client,
    error,
    isConnected: !!client,
    reconnect: async () => {
      try {
        await clientManager.current?.disconnect();
        if (clientManager.current && monaco) {
          const newClient = await clientManager.current.connect(SERVER_URL);
          setClient(newClient);
          setError(null);
          console.log('Language Server Reconnected');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to reconnect to language server'));
        console.error('Failed to reconnect to language server:', err);
      }
    },
  };
} 