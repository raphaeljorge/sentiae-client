import { useQuery } from '@tanstack/react-query';
import { workflowApi } from '@/shared/api/workflow';
import { WORKFLOW_QUERY_KEYS } from './use-workflow-api';

export function useWorkflowStatus(id: string) {
  return useQuery({
    queryKey: WORKFLOW_QUERY_KEYS.status(id),
    queryFn: () => workflowApi.getWorkflowStatus(id),
    enabled: !!id,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
} 