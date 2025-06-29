/**
 * Schema definitions for JSON node creation
 */

// Base node schema
export interface NodeSchema {
  type: string;
  position: {
    x: number;
    y: number;
  };
  data?: Record<string, any>;
  width?: number;
  height?: number;
}

// Text Input Node Schema
export interface TextInputNodeSchema extends NodeSchema {
  type: 'text-input';
  data: {
    config: {
      value: string;
    };
  };
}

// Generate Text Node Schema
export interface GenerateTextNodeSchema extends NodeSchema {
  type: 'generate-text';
  data: {
    config: {
      model: string;
    };
    dynamicHandles?: {
      tools: Array<{
        name: string;
        description?: string;
      }>;
    };
  };
}

// Prompt Crafter Node Schema
export interface PromptCrafterNodeSchema extends NodeSchema {
  type: 'prompt-crafter';
  data: {
    config: {
      template: string;
    };
    dynamicHandles?: {
      "template-tags": Array<{
        name: string;
      }>;
    };
  };
}

// Visualize Text Node Schema
export interface VisualizeTextNodeSchema extends NodeSchema {
  type: 'visualize-text';
}

// JSON Node Schema
export interface JsonNodeSchema extends NodeSchema {
  type: 'json-node';
  data: {
    config: {
      json: string;
    };
  };
}

// Union type of all node schemas
export type AnyNodeSchema = 
  | TextInputNodeSchema
  | GenerateTextNodeSchema
  | PromptCrafterNodeSchema
  | VisualizeTextNodeSchema
  | JsonNodeSchema;

// Example schemas for documentation
export const NODE_SCHEMA_EXAMPLES = {
  'text-input': {
    type: 'text-input',
    position: { x: 100, y: 100 },
    data: {
      config: {
        value: 'Hello World'
      }
    }
  },
  'generate-text': {
    type: 'generate-text',
    position: { x: 400, y: 100 },
    data: {
      config: {
        model: 'llama-3.1-8b-instant'
      },
      dynamicHandles: {
        tools: [
          {
            name: 'example-tool',
            description: 'An example tool'
          }
        ]
      }
    }
  },
  'prompt-crafter': {
    type: 'prompt-crafter',
    position: { x: 100, y: 300 },
    data: {
      config: {
        template: 'This is a template with {{variable}}'
      },
      dynamicHandles: {
        'template-tags': [
          {
            name: 'variable'
          }
        ]
      }
    }
  },
  'visualize-text': {
    type: 'visualize-text',
    position: { x: 400, y: 300 }
  }
};