import { useQuery } from '@tanstack/react-query';
import { fetchNodeTypes, fetchNodeSchemas } from '@/shared/api/node-types';

export const NODE_TYPES_QUERY_KEYS = {
  all: ['node-types'] as const,
  schemas: ['node-schemas'] as const,
};

/**
 * Hook to fetch all available node types
 */
export function useNodeTypes() {
  return useQuery({
    queryKey: NODE_TYPES_QUERY_KEYS.all,
    queryFn: fetchNodeTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch node schemas
 */
export function useNodeSchemas() {
  return useQuery({
    queryKey: NODE_TYPES_QUERY_KEYS.schemas,
    queryFn: fetchNodeSchemas,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}