import type { FlowNode } from '@/shared/lib/flow/workflow';
import { createDynamicNodes } from '@/shared/ui/flow/dynamic-node-factory';

/**
 * NodeApiClient - A client for interacting with node APIs
 * This class provides methods for fetching node definitions from APIs
 * and converting them to FlowNodes
 */
export class NodeApiClient {
  private baseUrl: string;
  
  /**
   * Creates a new NodeApiClient
   * @param baseUrl The base URL for the API
   */
  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Sets the base URL for the API
   * @param baseUrl The base URL for the API
   */
  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Fetches all node definitions from the API
   * @param endpoint The API endpoint (will be appended to baseUrl)
   * @returns Promise with array of FlowNodes
   */
  async fetchAllNodes(endpoint: string = '/nodes'): Promise<FlowNode[]> {
    try {
      const url = this.resolveUrl(endpoint);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the response data
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array of node definitions');
      }
      
      // Create nodes from the JSON definitions
      return createDynamicNodes(data);
    } catch (error) {
      console.error('Error fetching nodes from API:', error);
      throw error;
    }
  }
  
  /**
   * Fetches a single node definition from the API
   * @param nodeId The ID of the node to fetch
   * @param endpoint The API endpoint (will be appended to baseUrl)
   * @returns Promise with a FlowNode
   */
  async fetchNode(nodeId: string, endpoint: string = '/nodes'): Promise<FlowNode> {
    try {
      const url = this.resolveUrl(`${endpoint}/${nodeId}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Create a node from the JSON definition
      const nodes = createDynamicNodes([data]);
      
      if (nodes.length === 0) {
        throw new Error('Failed to create node from API response');
      }
      
      return nodes[0];
    } catch (error) {
      console.error('Error fetching node from API:', error);
      throw error;
    }
  }
  
  /**
   * Resolves a URL by combining the base URL and the endpoint
   * @param endpoint The API endpoint
   * @returns The full URL
   */
  private resolveUrl(endpoint: string): string {
    // If the endpoint is a full URL, use it as is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    
    // If the baseUrl ends with a slash and the endpoint starts with a slash,
    // remove the slash from the endpoint
    if (this.baseUrl.endsWith('/') && endpoint.startsWith('/')) {
      return `${this.baseUrl}${endpoint.slice(1)}`;
    }
    
    // If the baseUrl doesn't end with a slash and the endpoint doesn't start with a slash,
    // add a slash between them
    if (!this.baseUrl.endsWith('/') && !endpoint.startsWith('/')) {
      return `${this.baseUrl}/${endpoint}`;
    }
    
    // Otherwise, just concatenate them
    return `${this.baseUrl}${endpoint}`;
  }
}

// Export a singleton instance
export const nodeApiClient = new NodeApiClient();