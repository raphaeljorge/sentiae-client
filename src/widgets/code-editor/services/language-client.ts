import * as monaco from 'monaco-editor';
import { MonacoLanguageClient } from 'monaco-languageclient';
import { listen } from 'vscode-ws-jsonrpc';

// Install Monaco services
const installMonacoServices = () => {
  // @ts-ignore - MonacoEnvironment is not properly typed
  const win = window as any;
  if (!win.MonacoEnvironment) {
    win.MonacoEnvironment = {
      getWorkerUrl: (moduleId: string, label: string) => {
        if (label === 'json') {
          return './json.worker.js';
        }
        if (label === 'typescript' || label === 'javascript') {
          return './typescript.worker.js';
        }
        return './editor.worker.js';
      }
    };
  }
};

export class LanguageClientManager {
  private client: MonacoLanguageClient | null = null;
  private websocket: WebSocket | null = null;
  private monaco: typeof monaco;

  constructor(monacoInstance: typeof monaco) {
    this.monaco = monacoInstance;
    installMonacoServices();
  }

  public async connect(serverUrl: string): Promise<MonacoLanguageClient> {
    if (this.client) {
      return this.client;
    }

    // Create WebSocket connection
    this.websocket = new WebSocket(serverUrl);
    
    // Wait for the socket to be ready
    await new Promise<void>((resolve, reject) => {
      if (!this.websocket) return reject(new Error('WebSocket not initialized'));
      this.websocket.onopen = () => resolve();
      this.websocket.onerror = (error) => reject(error);
    });

    // Create the language client
    return new Promise((resolve, reject) => {
      if (!this.websocket) return reject(new Error('WebSocket not initialized'));
      
      listen({
        webSocket: this.websocket,
        onConnection: async (connection) => {
          // Create and start the client
          const client = new MonacoLanguageClient({
            name: 'Sentiae Language Client',
            clientOptions: {
              documentSelector: ['typescript', 'javascript'],
              errorHandler: {
                error: () => ({ action: 1 }), // Continue
                closed: () => ({ action: 1 }) // DoNotRestart
              }
            },
            // @ts-ignore - connectionProvider is not properly typed
            connectionProvider: {
              get: () => Promise.resolve(connection)
            }
          });

          try {
            await client.start();
            this.client = client;
            resolve(client);
          } catch (err) {
            reject(err);
          }
        }
      });
    });
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.stop();
      this.client = null;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }
} 