import type { NodeType } from '@/shared/types/node';

export const MOCK_NODE_TYPES: NodeType[] = [
  {
    // Basic identification
    id: 'core/text-input',
    name: 'Text Input',
    description: 'Input text data into the workflow',
    category: 'core',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'PenLine',
      resizable: true,
      minWidth: 200,
      minHeight: 150,
      theme: {
        borderColor: {
          processing: 'border-orange-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'value',
        type: 'textarea',
        label: 'Text Value',
        description: 'The text content for this input node',
        required: false,
        defaultValue: '',
        placeholder: 'Enter your text here...',
      },
    ],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'result',
        title: 'Result',
        type: 'source',
        position: 'right',
        required: false,
        description: 'The text output from this node',
      },
    ],
    
    // Features
    features: {
      statusIndicator: {
        enabled: true,
        showInHeader: false,
      },
    },
    
    // Component mapping (temporary until git-based)
    componentType: 'text-input',
    
    // Git Repository
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'text-input',
      version: '1.0.0',
    },
    
    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['input', 'text', 'core'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  
  {
    // Basic identification
    id: 'core/visualize-text',
    name: 'Visualize Text',
    description: 'Display and visualize text content with markdown support',
    category: 'core',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'Eye',
      resizable: true,
      minWidth: 200,
      minHeight: 150,
      theme: {
        borderColor: {
          processing: 'border-orange-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'input',
        title: 'Input',
        type: 'target',
        position: 'left',
        required: false,
        description: 'Text content to visualize',
      },
    ],
    
    // Features
    features: {
      markdownRenderer: {
        enabled: true,
        allowHtml: false,
        sanitize: true,
      },
      statusIndicator: {
        enabled: true,
        showInHeader: false,
      },
    },
    
    // Component mapping (temporary until git-based)
    componentType: 'visualize-text',
    
    // Git Repository
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'visualize-text',
      version: '1.0.0',
    },

    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['visualization', 'markdown', 'display', 'core'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  
  {
    // Basic identification
    id: 'core/generate-text',
    name: 'Generate Text',
    description: 'Generate text using AI models with customizable tools',
    category: 'ai',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'Bot',
      width: 350,
      className: 'hover:ring-orange-500',
      theme: {
        borderColor: {
          processing: 'border-orange-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'model',
        type: 'model',
        label: 'AI Model',
        description: 'The AI model to use for text generation',
        required: true,
        defaultValue: 'llama-3.1-8b-instant',
      },
    ],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'system',
        title: 'System',
        type: 'target',
        position: 'left',
        required: false,
        description: 'System prompt for the AI model',
      },
      {
        id: 'prompt',
        title: 'Prompt',
        type: 'target',
        position: 'left',
        required: false,
        description: 'User prompt for text generation',
      },
      {
        id: 'result',
        title: 'Result',
        type: 'source',
        position: 'right',
        required: false,
        description: 'Generated text output',
      },
    ],
    
    // Dynamic handles
    dynamicHandles: [
      {
        key: 'tools',
        title: 'Tool outputs',
        type: 'source',
        position: 'right',
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        showDescription: true,
        schema: {
          name: { required: true },
          description: { required: false },
        },
      },
    ],
    
    // Features
    features: {
      modelSelector: {
        enabled: true,
        disabled: true, // disabled during execution
        disabledModels: ['gpt-4o', 'gpt-4o-mini', 'deepseek-r1-distill-llama-70b'],
      },
      statusIndicator: {
        enabled: true,
        showInHeader: true,
      },
    },
    
    // Component mapping (temporary until git-based)
    componentType: 'generate-text',
    
    // Git Repository
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'generate-text',
      version: '1.0.0',
    },

    // Execution configuration
    execution: {
      timeout: 300, // 5 minutes
      retries: 3,
      parallel: false,
    },
    
    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['ai', 'text generation', 'llm', 'core'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  
  {
    // Basic identification
    id: 'core/prompt-crafter',
    name: 'Prompt Crafter',
    description: 'Design and test complex prompts with multiple variables',
    category: 'ai',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'PencilRuler',
      width: 350,
      className: 'hover:ring-orange-500',
      theme: {
        borderColor: {
          processing: 'border-orange-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'template',
        type: 'code',
        label: 'Prompt Template',
        description: 'Template with variables in {{variable}} format',
        required: false,
        defaultValue: '',
        placeholder: 'Craft your prompt here... Use {{input-name}} to reference inputs',
      },
    ],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'result',
        title: 'Result',
        type: 'source',
        position: 'right',
        required: false,
        description: 'The crafted prompt with variables replaced',
      },
    ],
    
    // Dynamic handles
    dynamicHandles: [
      {
        key: 'template-tags',
        title: 'Inputs',
        type: 'target',
        position: 'left',
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        showDescription: false,
        schema: {
          name: { required: true },
        },
      },
    ],
    
    // Features
    features: {
      codeEditor: {
        enabled: true,
        language: 'prompt',
        height: '150px',
        placeholder: 'Craft your prompt here... Use {{input-name}} to reference inputs',
        features: {
          lineNumbers: false,
          syntax_highlighting: true,
          auto_complete: false,
        },
      },
      statusIndicator: {
        enabled: true,
        showInHeader: true,
      },
    },
    
    // Component mapping (temporary until git-based)
    componentType: 'prompt-crafter',
    
    // Git Repository
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'prompt-crafter',
      version: '1.0.0',
    },

    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['prompt', 'template', 'ai', 'core'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  
  {
    // Basic identification
    id: 'core/json-node',
    name: 'JSON Node',
    description: 'Input, validate, and manipulate JSON data',
    category: 'core',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'FileJson',
      width: 350,
      className: 'hover:ring-blue-500',
      theme: {
        borderColor: {
          processing: 'border-blue-500',
          error: 'border-red-500',
        },
        hoverRing: 'hover:ring-blue-500',
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'json',
        type: 'json',
        label: 'JSON Definition',
        description: 'JSON definition for the node structure',
        required: true,
        defaultValue: '{}',
        placeholder: 'Enter JSON node definition...',
        validation: {
          custom: 'validateJSON',
        },
      },
    ],
    
    // Handle definitions (will be dynamic based on JSON)
    staticHandles: [],
    
    // Features
    features: {
      codeEditor: {
        enabled: true,
        language: 'json',
        height: '200px',
        placeholder: 'Enter JSON node definition...',
        features: {
          lineNumbers: true,
          syntax_highlighting: true,
          auto_complete: true,
        },
      },
      statusIndicator: {
        enabled: true,
        showInHeader: true,
      },
    },
    
    // Component mapping (temporary until git-based)
    componentType: 'json-node',
    
    // Git Repository
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'json-node',
      version: '1.0.0',
    },

    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['json', 'data', 'structure', 'core'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },

  {
    // Basic identification
    id: 'core/http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    category: 'integration',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'Globe',
      width: 300,
      className: 'hover:ring-green-500',
      theme: {
        borderColor: {
          processing: 'border-green-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'url',
        type: 'string',
        label: 'URL',
        description: 'The HTTP endpoint URL',
        required: true,
        placeholder: 'https://api.example.com/endpoint',
        validation: {
          pattern: '^https?://.+',
        },
      },
      {
        key: 'method',
        type: 'select',
        label: 'HTTP Method',
        description: 'The HTTP method to use',
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
        key: 'headers',
        type: 'json',
        label: 'Headers',
        description: 'HTTP headers as JSON object',
        required: false,
        defaultValue: '{}',
        placeholder: '{"Content-Type": "application/json"}',
      },
    ],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'body',
        title: 'Body',
        type: 'target',
        position: 'left',
        required: false,
        description: 'Request body data',
      },
      {
        id: 'response',
        title: 'Response',
        type: 'source',
        position: 'right',
        required: false,
        description: 'HTTP response data',
      },
    ],
    
    // Git repository for code-based execution
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'http-request',
      version: '1.0.0',
      buildCommand: 'npm install && npm run build',
      runCommand: 'node dist/index.js',
    },
    
    // Features
    features: {
      statusIndicator: {
        enabled: true,
        showInHeader: true,
      },
    },
    
    // Execution configuration
    execution: {
      timeout: 60, // 1 minute
      retries: 2,
      parallel: true,
    },
    
    // Documentation
    documentation: {
      readme: 'HTTP Request node for making API calls',
      examples: [
        {
          name: 'GET Request',
          description: 'Simple GET request to fetch data',
          config: {
            url: 'https://api.github.com/users/octocat',
            method: 'GET',
            headers: '{"Accept": "application/json"}',
          },
        },
      ],
    },
    
    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['http', 'api', 'request', 'integration'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  
  {
    // Basic identification
    id: 'core/if-condition',
    name: 'If Condition',
    description: 'Conditional logic branching based on input evaluation',
    category: 'logic',
    version: '1.0.0',
    
    // UI Configuration
    ui: {
      icon: 'GitBranch',
      width: 280,
      className: 'hover:ring-purple-500',
      theme: {
        borderColor: {
          processing: 'border-purple-500',
          error: 'border-red-500',
        },
      },
    },
    
    // Behavior
    behavior: {
      deletable: true,
      draggable: true,
      selectable: true,
      connectable: true,
    },
    
    // Configuration schema
    configFields: [
      {
        key: 'condition',
        type: 'code',
        label: 'Condition',
        description: 'JavaScript expression to evaluate (returns boolean)',
        required: true,
        placeholder: 'input.value > 10',
        validation: {
          custom: 'validateCondition',
        },
      },
    ],
    
    // Handle definitions
    staticHandles: [
      {
        id: 'input',
        title: 'Input',
        type: 'target',
        position: 'left',
        required: true,
        description: 'Input value to evaluate',
      },
      {
        id: 'true',
        title: 'True',
        type: 'source',
        position: 'right',
        required: false,
        description: 'Output when condition is true',
      },
      {
        id: 'false',
        title: 'False',
        type: 'source',
        position: 'right',
        required: false,
        description: 'Output when condition is false',
      },
    ],
    
    // Git repository for code-based execution
    repository: {
      repository: 'sentiae/core-nodes',
      branch: 'main',
      path: 'if-condition',
      version: '1.0.0',
      buildCommand: 'npm install && npm run build',
      runCommand: 'node dist/index.js',
    },
    
    // Features
    features: {
      codeEditor: {
        enabled: true,
        language: 'javascript',
        height: '100px',
        placeholder: 'input.value > 10',
        features: {
          lineNumbers: false,
          syntax_highlighting: true,
          auto_complete: true,
        },
      },
      statusIndicator: {
        enabled: true,
        showInHeader: true,
      },
    },
    
    // Metadata
    metadata: {
      author: 'core',
      license: 'MIT',
      keywords: ['condition', 'logic', 'branching', 'if'],
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
];