import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '@/shared/api/workflow';
import type { WorkflowResponse } from '@/shared/types/workflow';

export const WORKFLOW_QUERY_KEYS = {
  all: ['workflows'] as const,
  lists: () => [...WORKFLOW_QUERY_KEYS.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...WORKFLOW_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...WORKFLOW_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...WORKFLOW_QUERY_KEYS.details(), id] as const,
};

export function useWorkflows() {
  return useQuery({
    queryKey: WORKFLOW_QUERY_KEYS.lists(),
    queryFn: workflowApi.getWorkflows,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useWorkflow(id: string) {
  return useQuery({
    queryKey: WORKFLOW_QUERY_KEYS.detail(id),
    queryFn: () => workflowApi.getWorkflow(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Removed useWorkflowFromUrl since we're now using direct mock data 