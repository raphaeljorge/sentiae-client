import type { NodeType, HandleDefinition, DynamicHandleDefinition, ConfigField } from '@/shared/types/node';

/**
 * Node Builder Utility
 * Provides functions to work with comprehensive node definitions
 */

export interface NodeBuilderConfig {
  nodeType: NodeType;
  position: { x: number; y: number };
  initialData?: Record<string, any>;
}

export interface BuiltNodeInfo {
  id: string;
  type: string;
  data: {
    config: Record<string, any>;
    dynamicHandles?: Record<string, any[]>;
    status?: string;
  };
  position: { x: number; y: number };
  handles: {
    static: HandleDefinition[];
    dynamic?: DynamicHandleDefinition[];
  };
  ui: NodeType['ui'];
  features: NodeType['features'];
  metadata: {
    nodeType: NodeType;
    componentType?: string;
    repository?: NodeType['repository'];
  };
}

/**
 * Build initial node data from NodeType definition
 */
export function buildNodeFromType(config: NodeBuilderConfig): BuiltNodeInfo {
  const { nodeType, position, initialData = {} } = config;
  
  // Build initial config from field definitions
  const initialConfig = buildInitialConfig(nodeType.configFields, initialData);
  
  // Build initial dynamic handles if any
  const initialDynamicHandles = buildInitialDynamicHandles(nodeType.dynamicHandles);
  
  return {
    id: generateNodeId(nodeType.id),
    type: nodeType.id,
    data: {
      config: initialConfig,
      ...(initialDynamicHandles && { dynamicHandles: initialDynamicHandles }),
      status: 'idle',
    },
    position,
    handles: {
      static: nodeType.staticHandles,
      dynamic: nodeType.dynamicHandles,
    },
    ui: nodeType.ui,
    features: nodeType.features,
    metadata: {
      nodeType,
      componentType: nodeType.componentType,
      repository: nodeType.repository,
    },
  };
}

/**
 * Build initial configuration from field definitions
 */
export function buildInitialConfig(
  configFields: ConfigField[],
  initialData: Record<string, any> = {}
): Record<string, any> {
  const config: Record<string, any> = {};
  
  for (const field of configFields) {
    if (initialData[field.key] !== undefined) {
      config[field.key] = initialData[field.key];
    } else if (field.defaultValue !== undefined) {
      config[field.key] = field.defaultValue;
    } else {
      // Set default values based on field type
      switch (field.type) {
        case 'string':
        case 'textarea':
        case 'code':
        case 'json':
          config[field.key] = '';
          break;
        case 'number':
          config[field.key] = 0;
          break;
        case 'boolean':
          config[field.key] = false;
          break;
        case 'select':
          config[field.key] = field.options?.[0]?.value || '';
          break;
        case 'model':
          config[field.key] = 'llama-3.1-8b-instant';
          break;
        default:
          config[field.key] = null;
      }
    }
  }
  
  return config;
}

/**
 * Build initial dynamic handles structure
 */
export function buildInitialDynamicHandles(
  dynamicHandles?: DynamicHandleDefinition[]
): Record<string, any[]> | undefined {
  if (!dynamicHandles || dynamicHandles.length === 0) {
    return undefined;
  }
  
  const handles: Record<string, any[]> = {};
  
  for (const handle of dynamicHandles) {
    handles[handle.key] = [];
  }
  
  return handles;
}

/**
 * Generate unique node ID
 */
export function generateNodeId(nodeTypeId: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${nodeTypeId}-${timestamp}-${random}`;
}

/**
 * Validate node configuration against field definitions
 */
export function validateNodeConfig(
  config: Record<string, any>,
  configFields: ConfigField[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const field of configFields) {
    const value = config[field.key];
    
    // Check required fields
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.push(`Field '${field.label}' is required`);
      continue;
    }
    
    // Skip validation for empty optional fields
    if (!field.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type-specific validation
    switch (field.type) {
      case 'number':
        if (typeof value !== 'number' || Number.isNaN(value)) {
          errors.push(`Field '${field.label}' must be a valid number`);
        }
        if (field.validation?.min !== undefined && value < field.validation.min) {
          errors.push(`Field '${field.label}' must be at least ${field.validation.min}`);
        }
        if (field.validation?.max !== undefined && value > field.validation.max) {
          errors.push(`Field '${field.label}' must be at most ${field.validation.max}`);
        }
        break;
        
      case 'string':
      case 'textarea':
      case 'code':
        if (typeof value !== 'string') {
          errors.push(`Field '${field.label}' must be a string`);
        }
        if (field.validation?.pattern && !new RegExp(field.validation.pattern).test(value)) {
          errors.push(`Field '${field.label}' format is invalid`);
        }
        break;
        
      case 'json':
        if (typeof value !== 'string') {
          errors.push(`Field '${field.label}' must be a JSON string`);
        } else {
          try {
            JSON.parse(value);
          } catch (e) {
            errors.push(`Field '${field.label}' must be valid JSON`);
          }
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`Field '${field.label}' must be a boolean`);
        }
        break;
        
      case 'select':
        if (field.options && !field.options.some(option => option.value === value)) {
          errors.push(`Field '${field.label}' must be one of the available options`);
        }
        break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get node capabilities from NodeType definition
 */
export function getNodeCapabilities(nodeType: NodeType) {
  return {
    hasModelSelector: nodeType.features?.modelSelector?.enabled === true,
    hasCodeEditor: nodeType.features?.codeEditor?.enabled === true,
    hasMarkdownRenderer: nodeType.features?.markdownRenderer?.enabled === true,
    hasStatusIndicator: nodeType.features?.statusIndicator?.enabled === true,
    hasDynamicHandles: nodeType.dynamicHandles && nodeType.dynamicHandles.length > 0,
    isResizable: nodeType.ui.resizable === true,
    isGitBased: nodeType.repository !== undefined,
    executionConfig: nodeType.execution,
    documentation: nodeType.documentation,
  };
}

/**
 * Get all handle definitions for a node type
 */
export function getAllHandles(nodeType: NodeType) {
  const handles = {
    static: nodeType.staticHandles,
    dynamic: nodeType.dynamicHandles || [],
  };
  
  return handles;
}

/**
 * Extract repository information for git-based execution
 */
export function getRepositoryInfo(nodeType: NodeType) {
  if (!nodeType.repository) {
    return null;
  }
  
  return {
    ...nodeType.repository,
    isGitBased: true,
    cloneUrl: `https://github.com/${nodeType.repository.repository}.git`,
  };
} 