import type { NodeType } from '@/shared/types/node';

// API endpoint for fetching node types
const NODE_TYPES_ENDPOINT = '/api/node-types';

/**
 * Fetches all available node types from the API
 * @returns Promise with array of node types
 */
export async function fetchNodeTypes(): Promise<NodeType[]> {
  try {
    const response = await fetch(NODE_TYPES_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch node types: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching node types:', error);
    // Return mock data as fallback
    return [];
  }
}

/**
 * Fetches node schema definitions from the API
 * @returns Promise with node schema definitions
 */
export async function fetchNodeSchemas(): Promise<Record<string, any>> {
  try {
    const response = await fetch('/api/node-schemas');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch node schemas: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching node schemas:', error);
    return {};
  }
}