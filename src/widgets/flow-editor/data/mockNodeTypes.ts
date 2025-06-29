import type { NodeType } from '@/shared/types/node';

export const MOCK_NODE_TYPES: NodeType[] = [
  {
    id: 'text-input',
    name: 'Text Input',
    description: 'Input text data into the workflow',
    category: 'core',
  },
  {
    id: 'visualize-text',
    name: 'Visualize Text',
    description: 'Display and visualize text content',
    category: 'core',
  },
  {
    id: 'generate-text',
    name: 'Generate Text',
    description: 'Generate text using AI models',
    category: 'ai',
  },
  {
    id: 'prompt-crafter',
    name: 'Prompt Crafter',
    description: 'Create dynamic prompts with templates',
    category: 'ai',
  },
  {
    id: 'http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    category: 'integration',
  },
  {
    id: 'if-condition',
    name: 'If Condition',
    description: 'Conditional logic branching',
    category: 'logic',
  },
  {
    id: 'database-query',
    name: 'Database Query',
    description: 'Query databases and retrieve data',
    category: 'database',
  },
  {
    id: 'user-auth',
    name: 'User Authentication',
    description: 'Authenticate users and manage sessions',
    category: 'auth',
  },
];