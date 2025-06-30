import { http, HttpResponse } from 'msw';
import type { WorkflowResponse } from '@/shared/types/workflow';

// Import workflow definitions from examples
import { chainWorkflowDefinition } from '../data/chain-workflow';
import { routingWorkflowDefinition } from '../data/routing-workflow';
import { parallelizationWorkflowDefinition } from '../data/parallelization-workflow';
import { orchestratorWorkflowDefinition } from '../data/orchestrator-workflow';

const workflows: Record<string, WorkflowResponse> = {
  'flow-chain': {
    id: 'flow-chain',
    name: 'Chain Workflow',
    description: 'The Chain Workflow handles tasks by breaking them into ordered steps, where each step depends on the previous one. Each step can verify the work done before and determine what happens next.',
    type: 'chain',
    definition: chainWorkflowDefinition,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  'flow-routing': {
    id: 'flow-routing',
    name: 'Routing Workflow',
    description: 'The Routing Workflow directs incoming requests to the most suitable process based on what needs to be done.',
    type: 'routing',
    definition: routingWorkflowDefinition,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  'flow-parallelization': {
    id: 'flow-parallelization',
    name: 'Parallelization Workflow',
    description: 'The Parallelization Workflow handles multiple tasks at the same time instead of one by one. At the end, we can optionally aggregate the results with another agent.',
    type: 'parallelization',
    definition: parallelizationWorkflowDefinition,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  'flow-orchestrator': {
    id: 'flow-orchestrator',
    name: 'Orchestrator-Workers Workflow',
    description: 'The Orchestrator-workers Workflow uses a coordinator to distribute tasks to specialists based on the user request.',
    type: 'orchestrator',
    definition: orchestratorWorkflowDefinition,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
};

export const workflowHandlers = [
  // Handle our API endpoints with relative paths (MSW will match these properly)
  http.get('/api/workflows', () => {
    return HttpResponse.json(Object.values(workflows));
  }),

  http.get('/api/workflows/:id', ({ params }) => {
    const { id } = params;
    const workflow = workflows[id as string];
    
    if (!workflow) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(workflow);
  }),

  // External workflow URLs (for compatibility with the URLs mentioned)
  http.get('https://simple-ai.dev/r/flow-chain.json', () => {
    return HttpResponse.json(workflows['flow-chain']);
  }),

  http.get('https://simple-ai.dev/r/flow-routing.json', () => {
    return HttpResponse.json(workflows['flow-routing']);
  }),

  http.get('https://simple-ai.dev/r/flow-parallelization.json', () => {
    return HttpResponse.json(workflows['flow-parallelization']);
  }),

  http.get('https://simple-ai.dev/r/flow-orchestrator.json', () => {
    return HttpResponse.json(workflows['flow-orchestrator']);
  }),

  http.get('/api/workflows/:id/status', ({ params }) => {
    const { id } = params;
    const workflow = workflows[id as string];
    
    if (!workflow) {
      return new HttpResponse(null, { status: 404 });
    }

    if (id === 'flow-chain') {
      return HttpResponse.json({
        workflowId: id,
        status: 'success',
        lastRun: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        errorCount: 0,
      });
    }

    const statuses = ['success', 'running', 'error', 'idle'] as const;
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return HttpResponse.json({
      workflowId: id,
      status: randomStatus,
      lastRun: new Date().toISOString(),
      errorCount: randomStatus === 'error' ? Math.floor(Math.random() * 5) + 1 : 0,
    });
  }),

  // Add a passthrough handler for the workflow execution endpoint
  http.post('/api/workflow/execute', () => {
    // This tells MSW to perform the request as if MSW were not active.
    return; 
  }),
]; 