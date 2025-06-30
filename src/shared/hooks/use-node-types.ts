import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchNodeTypes, fetchNodeSchemas } from '@/shared/api/node-types';
import type { NodeType } from '@/shared/types/node';

export const NODE_TYPES_QUERY_KEYS = {
  all: ['node-types'] as const,
  lists: () => [...NODE_TYPES_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...NODE_TYPES_QUERY_KEYS.lists(), { filters }],
  details: () => [...NODE_TYPES_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NODE_TYPES_QUERY_KEYS.details(), id] as const,
  schemas: () => [...NODE_TYPES_QUERY_KEYS.all, 'schemas'] as const,
};

/**
 * Hook to fetch all available node types
 */
export function useNodeTypes() {
  const queryInfo = useQuery<NodeType[]>({
    queryKey: NODE_TYPES_QUERY_KEYS.lists(),
    queryFn: fetchNodeTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const getNodeType = useCallback(
    (type: string) => {
      return queryInfo.data?.find((nodeType) => nodeType.id === type);
    },
    [queryInfo.data],
  );

  return {
    ...queryInfo,
    getNodeType,
  };
}

/**
 * Hook to fetch node schemas
 */
export function useNodeSchemas() {
  return useQuery({
    queryKey: NODE_TYPES_QUERY_KEYS.schemas(),
    queryFn: fetchNodeSchemas,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}