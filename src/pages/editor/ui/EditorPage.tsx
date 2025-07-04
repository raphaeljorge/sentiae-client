import { useSearch } from '@tanstack/react-router';
import { useWorkflow } from '@/shared/hooks/use-workflow-api';
import { FlowEditor } from '@/widgets/flow-editor';
import { Skeleton } from '@/shared/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface EditorSearch {
  id?: string;
}

export function EditorPage() {
  const search = useSearch({ strict: false }) as EditorSearch;
  const workflowId = search.id || '';
  const { data: workflow, isLoading, error } = useWorkflow(workflowId);

  if (!workflowId) {
    return (
      <div className="h-full w-full p-4 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please provide a workflow ID in the URL search parameters (e.g., ?id=flow-chain)
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full p-4">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full p-4 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load workflow'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="h-full w-full p-4 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Workflow not found. Please check the workflow ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col">
      <FlowEditor workflow={workflow} />
    </div>
  );
}