import type { WorkflowResponse } from '@/shared/types/workflow';

// Import workflow definitions directly as mock data
import { chainWorkflowDefinition } from '@/mocks/data/chain-workflow';
import { routingWorkflowDefinition } from '@/mocks/data/routing-workflow';
import { parallelizationWorkflowDefinition } from '@/mocks/data/parallelization-workflow';
import { orchestratorWorkflowDefinition } from '@/mocks/data/orchestrator-workflow';

// Mock workflows data (previously served by MSW)
const workflows: Record<string, WorkflowResponse> = {
  'flow-chain': {
    id: 'flow-chain',
    name: 'Chain Workflow',
    description: 'The Chain Workflow handles tasks by breaking them into ordered steps, where each step depends on the previous one. Each step can verify the work done before and determine what happens next.',
    type: 'chain',
    definition: chainWorkflowDefinition,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  'flow-routing': {
    id: 'flow-routing',
    name: 'Routing Workflow',
    description: 'The Routing Workflow intelligently routes content to specialized nodes based on classification, ensuring each piece gets the most appropriate processing.',
    type: 'routing',
    definition: routingWorkflowDefinition,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  'flow-parallelization': {
    id: 'flow-parallelization',
    name: 'Parallelization Workflow',
    description: 'The Parallelization Workflow processes multiple exam sections simultaneously, then combines results for comprehensive assessment creation.',
    type: 'parallelization',
    definition: parallelizationWorkflowDefinition,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  'flow-orchestrator': {
    id: 'flow-orchestrator',
    name: 'Orchestrator Workflow',
    description: 'The Orchestrator Workflow coordinates multiple specialized workers to handle complex development tasks through intelligent task distribution.',
    type: 'orchestrator',
    definition: orchestratorWorkflowDefinition,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
};

// Simulate async API calls with mock data
export async function getAllWorkflows(): Promise<WorkflowResponse[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return Object.values(workflows);
}

async function getWorkflow(id: string): Promise<WorkflowResponse> {
  const response = await fetch(`/api/workflows/${id}`);
  if (!response.ok) {
    throw new Error(`Workflow with id "${id}" not found`);
  }
  return response.json();
}

// Export the simple mock API functions
export const workflowApi = {
  getWorkflows: getAllWorkflows,
  getWorkflow: getWorkflow,
}; 