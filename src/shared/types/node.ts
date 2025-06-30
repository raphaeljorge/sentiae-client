export type NodeCategory = 'core' | 'auth' | 'database' | 'logic' | 'ai' | 'integration';

// Handle definition types
export interface HandleDefinition {
  id: string;
  title: string;
  type: 'source' | 'target';
  position: 'left' | 'right' | 'top' | 'bottom';
  required?: boolean;
  description?: string;
}

export interface DynamicHandleDefinition {
  key: string; // e.g., "tools", "template-tags"
  title: string;
  type: 'source' | 'target';
  position: 'left' | 'right' | 'top' | 'bottom';
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  showDescription?: boolean;
  maxCount?: number;
  schema: {
    name: { required: boolean };
    description?: { required: boolean };
  };
}

// Configuration field types
export interface ConfigField {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'model' | 'json' | 'textarea' | 'code';
  label: string;
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>; // for select type
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: string; // custom validation function name
  };
}

// UI Configuration
export interface NodeUIConfig {
  icon: string; // Lucide icon name
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  className?: string;
  theme?: {
    borderColor?: {
      default?: string;
      processing?: string;
      error?: string;
      success?: string;
    };
    hoverRing?: string;
  };
}

// Node behavior configuration
export interface NodeBehavior {
  deletable?: boolean;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
  focusable?: boolean;
}

// Git repository configuration for code-based nodes
export interface GitRepositoryConfig {
  repository: string; // e.g., "username/repo-name"
  branch?: string; // default: "main"
  path?: string; // path within the repo
  version?: string; // specific version/tag
  buildCommand?: string; // command to build the code
  runCommand?: string; // command to run the code
  dependencies?: string[]; // additional dependencies
  environment?: Record<string, string>; // environment variables
}

// Features that the node supports
export interface NodeFeatures {
  modelSelector?: {
    enabled: boolean;
    disabled?: boolean;
    disabledModels?: string[];
    allowedModels?: string[];
  };
  codeEditor?: {
    enabled: boolean;
    language: string;
    theme?: string;
    height?: string;
    placeholder?: string;
    features?: {
      lineNumbers?: boolean;
      syntax_highlighting?: boolean;
      auto_complete?: boolean;
    };
  };
  markdownRenderer?: {
    enabled: boolean;
    allowHtml?: boolean;
    sanitize?: boolean;
  };
  statusIndicator?: {
    enabled: boolean;
    showInHeader?: boolean;
  };
}

export interface NodeType {
  // Basic identification
  id: string;
  name: string;
  description: string;
  category: NodeCategory;
  version: string;
  
  // UI Configuration
  ui: NodeUIConfig;
  
  // Behavior
  behavior: NodeBehavior;
  
  // Configuration schema
  configFields: ConfigField[];
  
  // Handle definitions
  staticHandles: HandleDefinition[];
  dynamicHandles?: DynamicHandleDefinition[];
  
  // Features
  features?: NodeFeatures;
  
  // Git repository for code-based execution
  repository?: GitRepositoryConfig;
  
  // Component mapping (for now, until we move to git-based)
  componentType?: string; // maps to existing React components
  
  // Execution configuration
  execution?: {
    timeout?: number; // in seconds
    retries?: number;
    parallel?: boolean;
    dependencies?: string[]; // node IDs that must complete first
  };
  
  // Documentation
  documentation?: {
    readme?: string;
    examples?: Array<{
      name: string;
      description: string;
      config: Record<string, any>;
    }>;
    changelog?: string;
  };
  
  // Metadata
  metadata?: {
    author?: string;
    license?: string;
    keywords?: string[];
    createdAt?: string;
    updatedAt?: string;
    deprecated?: boolean;
    experimental?: boolean;
  };
}