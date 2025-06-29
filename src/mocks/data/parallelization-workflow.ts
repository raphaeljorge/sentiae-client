import type { WorkflowDefinition } from '@/shared/types/workflow';

export const parallelizationWorkflowDefinition: WorkflowDefinition = {
  nodes: [
    {
      id: 'exam-request',
      type: 'text-input',
      position: { x: 100, y: 300 },
      data: {
        config: {
          value: 'Enter the exam topic and requirements...'
        }
      },
      width: 350,
      height: 200
    },
    {
      id: 'multiple-choice-creator',
      type: 'generate-text',
      position: { x: 500, y: 100 },
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
      id: 'short-answer-creator',
      type: 'generate-text',
      position: { x: 500, y: 300 },
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
      id: 'essay-creator',
      type: 'generate-text',
      position: { x: 500, y: 500 },
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
      id: 'exam-aggregator',
      type: 'generate-text',
      position: { x: 900, y: 300 },
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
      id: 'final-exam',
      type: 'visualize-text',
      position: { x: 1300, y: 300 },
      data: {},
      width: 350,
      height: 400
    }
  ],
  edges: [
    {
      id: 'e1',
      source: 'exam-request',
      target: 'multiple-choice-creator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e2',
      source: 'exam-request',
      target: 'short-answer-creator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e3',
      source: 'exam-request',
      target: 'essay-creator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e4',
      source: 'multiple-choice-creator',
      target: 'exam-aggregator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e5',
      source: 'short-answer-creator',
      target: 'exam-aggregator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e6',
      source: 'essay-creator',
      target: 'exam-aggregator',
      sourceHandle: 'result',
      targetHandle: 'prompt',
      type: 'default'
    },
    {
      id: 'e7',
      source: 'exam-aggregator',
      target: 'final-exam',
      sourceHandle: 'result',
      targetHandle: 'input',
      type: 'default'
    }
  ],
  viewport: {
    x: 0,
    y: 0,
    zoom: 0.9
  }
}; 