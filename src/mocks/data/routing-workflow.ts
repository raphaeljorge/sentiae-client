import type { WorkflowDefinition } from '@/shared/types/workflow';

export const routingWorkflowDefinition: WorkflowDefinition = {
  nodes: [
    {
      id: 'content-request',
      type: 'core/text-input',
      position: { x: 100, y: 300 },
      data: {
        config: {
          value: 'Enter your content creation request...'
        }
      },
      width: 350,
      height: 200
    },
    {
      id: 'analyze-request',
      type: 'core/generate-text',
      position: { x: 500, y: 300 },
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
      id: 'blog-writer',
      type: 'core/generate-text',
      position: { x: 900, y: 100 },
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
      id: 'social-media-creator',
      type: 'core/generate-text',
      position: { x: 900, y: 300 },
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
      id: 'seo-specialist',
      type: 'core/generate-text',
      position: { x: 900, y: 500 },
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
      id: 'blog-output',
      type: 'core/visualize-text',
      position: { x: 1300, y: 100 },
      data: {},
      width: 350,
      height: 300
    },
    {
      id: 'social-output',
      type: 'core/visualize-text',
      position: { x: 1300, y: 300 },
      data: {},
      width: 350,
      height: 300
    },
    {
      id: 'seo-output',
      type: 'core/visualize-text',
      position: { x: 1300, y: 500 },
      data: {},
      width: 350,
      height: 300
    }
  ],
  edges: [
    {
      id: 'e1',
      source: 'content-request',
      target: 'analyze-request',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e2',
      source: 'analyze-request',
      target: 'blog-writer',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e3',
      source: 'analyze-request',
      target: 'social-media-creator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e4',
      source: 'analyze-request',
      target: 'seo-specialist',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e5',
      source: 'blog-writer',
      target: 'blog-output',
      sourceHandle: 'result',
      targetHandle: 'input',
      type: 'default'
    },
    {
      id: 'e6',
      source: 'social-media-creator',
      target: 'social-output',
      sourceHandle: 'result',
      targetHandle: 'input',
      type: 'default'
    },
    {
      id: 'e7',
      source: 'seo-specialist',
      target: 'seo-output',
      sourceHandle: 'result',
      targetHandle: 'input',
      type: 'default'
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 0.8
  }
}; 