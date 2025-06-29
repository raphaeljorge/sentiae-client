import type { FlowNode } from '@/shared/lib/flow/workflow';
import { createDynamicNodes } from '@/shared/ui/flow/dynamic-node-factory';

/**
 * Fetches node definitions from an API endpoint and converts them to FlowNodes
 * @param apiUrl The API endpoint URL
 * @returns Promise with array of FlowNodes
 */
export async function fetchNodesFromApi(apiUrl: string): Promise<FlowNode[]> {
  try {
    const response = await fetch(apiUrl);
    
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
 * Fetches a single node definition from an API endpoint and converts it to a FlowNode
 * @param apiUrl The API endpoint URL
 * @param nodeId The ID of the node to fetch
 * @returns Promise with a FlowNode
 */
export async function fetchNodeFromApi(apiUrl: string, nodeId: string): Promise<FlowNode> {
  try {
    const response = await fetch(`${apiUrl}/${nodeId}`);
    
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