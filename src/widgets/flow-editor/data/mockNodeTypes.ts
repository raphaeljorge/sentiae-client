import type { NodeType } from '@/shared/types/node';

export const MOCK_NODE_TYPES: NodeType[] = [
  // Text Input
  {
    id: 'core/text-input',
    name: 'Text Input',
    description: 'Input text data into the workflow',
    category: 'core',
    version: '1.0.0',
    
    ui: {
      icon: 'PenLine',
      width: 250,
      height: 200,
      color: '#06b6d4', // Cyan
    },
    
    behavior: {
      resizable: true,
    },
    
    fields: [
      {
        key: 'value',
        type: 'textarea',
        label: 'Text Value',
        placeholder: 'Enter your text here...',
        props: { autoResize: true },
      },
    ],
    
    handles: [
      { id: 'result', title: 'Result', type: 'source', position: 'right' },
    ],
    
    features: ['status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'text-input',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['input', 'text', 'core'],
  },
  
  // Visualize Text
  {
    id: 'core/visualize-text',
    name: 'Visualize Text',
    description: 'Display and visualize text content with markdown support',
    category: 'core',
    version: '1.0.0',
    
    ui: {
      icon: 'Eye',
      width: 300,
      height: 200,
      color: '#8b5cf6', // Purple
    },
    
    behavior: {
      resizable: true,
    },
    
    fields: [],
    
    handles: [
      { id: 'input', title: 'Input', type: 'target', position: 'left' },
    ],
    
    features: ['markdown-renderer', 'status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'visualize-text',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['visualization', 'markdown', 'display', 'core'],
  },
  
  // Generate Text
  {
    id: 'core/generate-text',
    name: 'Generate Text',
    description: 'Generate text using AI models with customizable tools',
    category: 'ai',
    version: '1.0.0',
    
    ui: {
      icon: 'Bot',
      width: 350,
      color: '#f97316', // Orange
    },
    
    fields: [
      {
        key: 'model',
        type: 'model',
        label: 'AI Model',
        required: true,
        defaultValue: 'llama-3.1-8b-instant',
      },
      {
        key: 'tools',
        type: 'dynamic-handles',
        label: 'Tool Outputs',
        handles: {
          type: 'source',
          position: 'right',
          max: 20,
          showDescription: true,
          section: 'bottom',
        },
      },
    ],
    
    handles: [
      { id: 'system', title: 'System', type: 'target', position: 'left' },
      { id: 'prompt', title: 'Prompt', type: 'target', position: 'left' },
      { id: 'result', title: 'Result', type: 'source', position: 'right' },
    ],
    
    features: ['model-selector', 'status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'generate-text',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['ai', 'text-generation', 'llm', 'core'],
  },
  
  // Prompt Crafter
  {
    id: 'core/prompt-crafter',
    name: 'Prompt Crafter',
    description: 'Design and test complex prompts with multiple variables',
    category: 'ai',
    version: '1.0.0',
    
    ui: {
      icon: 'PencilRuler',
      width: 350,
      color: '#8b5cf6', // Purple
    },
    
    fields: [
      {
        key: 'template',
        type: 'code',
        label: 'Prompt Template',
        placeholder: 'Craft your prompt here... Use {{input-name}} to reference inputs',
        props: { language: 'prompt', height: '150px' },
      },
      {
        key: 'template-tags',
        type: 'dynamic-handles',
        label: 'Template Inputs',
        handles: {
          type: 'target',
          position: 'left',
          max: 15,
          showDescription: false,
          section: 'bottom',
        },
      },
    ],
    
    handles: [
      { id: 'result', title: 'Result', type: 'source', position: 'right' },
    ],
    
    features: ['code-editor', 'status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'prompt-crafter',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['prompt', 'template', 'ai', 'core'],
  },
  
  // JSON Node
  {
    id: 'core/json-node',
    name: 'JSON Node',
    description: 'Input, validate, and manipulate JSON data',
    category: 'core',
    version: '1.0.0',
    
    ui: {
      icon: 'FileJson',
      width: 350,
      color: '#3b82f6', // Blue
    },
    
    fields: [
      {
        key: 'json',
        type: 'json',
        label: 'JSON Definition',
        required: true,
        defaultValue: '{}',
        placeholder: 'Enter JSON node definition...',
        validation: [
          { type: 'custom', customValidator: 'json', message: 'Invalid JSON' },
        ],
        props: { height: '200px' },
      },
    ],
    
    handles: [],
    
    features: ['code-editor', 'status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'json-node',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['json', 'data', 'structure', 'core'],
  },
  
  // HTTP Request
  {
    id: 'core/http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    category: 'integration',
    version: '1.0.0',
    
    ui: {
      icon: 'Globe',
      width: 300,
      color: '#10b981', // Green
    },
    
    fields: [
      {
        key: 'method',
        type: 'select',
        label: 'HTTP Method',
        required: true,
        defaultValue: 'GET',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
          { value: 'PATCH', label: 'PATCH' },
        ],
      },
      {
        key: 'url',
        type: 'string',
        label: 'URL',
        required: true,
        placeholder: 'https://api.example.com/endpoint',
        validation: [
          { type: 'required', message: 'URL is required' },
          { type: 'custom', customValidator: 'url', message: 'Invalid URL' },
        ],
      },
      {
        key: 'headers',
        type: 'json',
        label: 'Headers',
        placeholder: '{"Content-Type": "application/json"}',
        validation: [
          { type: 'custom', customValidator: 'json', message: 'Invalid JSON' },
        ],
      },
      {
        key: 'body',
        type: 'textarea',
        label: 'Request Body',
        placeholder: 'Request body content...',
        showWhen: { field: 'method', equals: 'POST' },
      },
      {
        key: 'timeout',
        type: 'number',
        label: 'Timeout (seconds)',
        defaultValue: 30,
        validation: [
          { type: 'min', value: 1, message: 'Minimum 1 second' },
          { type: 'max', value: 300, message: 'Maximum 5 minutes' },
        ],
      },
    ],
    
    handles: [
      { id: 'trigger', title: 'Trigger', type: 'target', position: 'left' },
      { id: 'response', title: 'Response', type: 'source', position: 'right' },
      { id: 'error', title: 'Error', type: 'source', position: 'right' },
    ],
    
    features: ['status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/integration-nodes',
      path: 'http-request',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['http', 'api', 'request', 'integration'],
  },
  
  // If Condition
  {
    id: 'core/if-condition',
    name: 'If Condition',
    description: 'Conditional logic node for workflow branching',
    category: 'logic',
    version: '1.0.0',
    
    ui: {
      icon: 'GitBranch',
      width: 250,
      color: '#f59e0b', // Amber
    },
    
    fields: [
      {
        key: 'condition',
        type: 'string',
        label: 'Condition',
        required: true,
        placeholder: 'Enter condition logic...',
      },
      {
        key: 'operator',
        type: 'select',
        label: 'Operator',
        required: true,
        defaultValue: 'equals',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'greater_than', label: 'Greater Than' },
          { value: 'less_than', label: 'Less Than' },
        ],
      },
      {
        key: 'value',
        type: 'string',
        label: 'Compare Value',
        required: true,
        placeholder: 'Value to compare against...',
      },
    ],
    
    handles: [
      { id: 'input', title: 'Input', type: 'target', position: 'left' },
      { id: 'true', title: 'True', type: 'source', position: 'right' },
      { id: 'false', title: 'False', type: 'source', position: 'right' },
    ],
    
    features: ['status-indicator'],
    
    repository: {
      url: 'https://github.com/sentiae/core-nodes',
      path: 'if-condition',
      version: '1.0.0',
    },
    
    author: 'core',
    license: 'MIT',
    keywords: ['logic', 'condition', 'branching', 'core'],
  },
];