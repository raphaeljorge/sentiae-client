import { useState } from 'react';
import { fetchNodesFromApi } from '@/shared/api/dynamic-node-api';
import type { FlowNode } from '@/shared/lib/flow/workflow';

interface UseApiNodesResult {
  nodes: FlowNode[];
  isLoading: boolean;
  error: Error | null;
  fetchNodes: (apiUrl: string) => Promise<void>;
}

/**
 * Hook to fetch nodes from an API endpoint
 */
export function useApiNodes(): UseApiNodesResult {
  const [nodes, setNodes] = useState<FlowNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchNodes = async (apiUrl: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedNodes = await fetchNodesFromApi(apiUrl);
      setNodes(fetchedNodes);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nodes,
    isLoading,
    error,
    fetchNodes,
  };
}