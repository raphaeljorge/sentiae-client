import type { WorkflowDefinition } from '@/shared/types/workflow';

export const orchestratorWorkflowDefinition: WorkflowDefinition = {
  nodes: [
    {
      id: 'feature-request',
      type: 'text-input',
      position: { x: 100, y: 400 },
      data: {
        config: {
          value: 'Describe the technical feature requirements...'
        }
      },
      width: 350,
      height: 200
    },
    {
      id: 'product-manager',
      type: 'generate-text',
      position: { x: 500, y: 400 },
      data: {
        config: {
          model: 'gpt-4o'
        },
        dynamicHandles: {
          tools: []
        }
      }
    },
    {
      id: 'frontend-developer',
      type: 'generate-text',
      position: { x: 900, y: 200 },
      data: {
        config: {
          model: 'deepseek-chat'
        },
        dynamicHandles: {
          tools: []
        }
      }
    },
    {
      id: 'backend-developer',
      type: 'generate-text',
      position: { x: 900, y: 400 },
      data: {
        config: {
          model: 'llama-3.1-8b-instant'
        },
        dynamicHandles: {
          tools: []
        }
      }
    },
    {
      id: 'database-developer',
      type: 'generate-text',
      position: { x: 900, y: 600 },
      data: {
        config: {
          model: 'gpt-4o-mini'
        },
        dynamicHandles: {
          tools: []
        }
      }
    },
    {
      id: 'senior-developer',
      type: 'generate-text',
      position: { x: 1300, y: 400 },
      data: {
        config: {
          model: 'gpt-4o'
        },
        dynamicHandles: {
          tools: []
        }
      }
    },
    {
      id: 'final-solution',
      type: 'visualize-text',
      position: { x: 1700, y: 400 },
      data: {},
      width: 350,
      height: 400
    }
  ],
  edges: [
    {
      id: 'e1',
      source: 'feature-request',
      target: 'product-manager',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e2',
      source: 'product-manager',
      target: 'frontend-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e3',
      source: 'product-manager',
      target: 'backend-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e4',
      source: 'product-manager',
      target: 'database-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e5',
      source: 'frontend-developer',
      target: 'senior-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e6',
      source: 'backend-developer',
      target: 'senior-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e7',
      source: 'database-developer',
      target: 'senior-developer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e8',
      source: 'senior-developer',
      target: 'final-solution',
      sourceHandle: 'result',
      targetHandle: 'input',
      type: 'default'
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 0.7
  }
}; 