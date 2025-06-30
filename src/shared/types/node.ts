export type NodeCategory = 'core' | 'auth' | 'database' | 'logic' | 'ai' | 'integration';

// Simplified and cleaner field types
export type FieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'select' 
  | 'model' 
  | 'json' 
  | 'textarea' 
  | 'code'
  | 'dynamic-handles';

// Simplified configuration field
export interface ConfigField {
  key: string;
  type: FieldType;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: any;
  options?: Array<{ value: string; label: string }>;
  validation?: ValidationRule[];
  
  // Conditional display (simplified)
  showWhen?: { field: string; equals: any };
  hideWhen?: { field: string; equals: any };
  
  // Dynamic handles configuration (only for dynamic-handles type)
  handles?: {
    type: 'source' | 'target';
    position: 'left' | 'right' | 'top' | 'bottom';
    max?: number;
    showDescription?: boolean;
    section?: 'top' | 'bottom' | 'inline'; // where to render the handles UI
  };
  
  // Field-specific props
  props?: Record<string, any>;
}

// Simplified handle definition
export interface HandleDefinition {
  id: string;
  title: string;
  type: 'source' | 'target';
  position: 'left' | 'right' | 'top' | 'bottom';
  required?: boolean;
  description?: string;
}

// UI Configuration
export interface NodeUIConfig {
  icon: string | CustomIcon; // Enhanced icon support
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
    gradient?: {
      from: string;
      to: string;
    };
  };
  customStyles?: Record<string, any>; // additional CSS properties
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

// Plugin system types
export interface PluginFieldType {
  type: string;
  component: React.ComponentType<any>;
  validator?: (value: any, field: ConfigField) => string | null;
  defaultValue?: any;
}

export interface PluginRegistry {
  fieldTypes: Map<string, PluginFieldType>;
  validators: Map<string, (value: any, field: ConfigField, allValues: Record<string, any>) => string | null>;
  icons: Map<string, React.ComponentType<any> | string>;
  edgeTypes: Map<string, React.ComponentType<any>>;
}

// Enhanced validation types
export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'conditional';
  value?: any;
  message?: string;
  condition?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  customValidator?: string; // reference to plugin validator
}

// Conditional field display
export interface ConditionalDisplay {
  field: string; // field to watch
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'empty' | 'not_empty';
  value?: any;
  action: 'show' | 'hide' | 'enable' | 'disable';
}

// Dynamic edge configuration
export interface EdgeTypeConfig {
  id: string;
  name: string;
  component?: string; // reference to plugin component
  style?: {
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    animated?: boolean;
    gradient?: {
      from: string;
      to: string;
    };
  };
  behavior?: {
    selectable?: boolean;
    deletable?: boolean;
    reconnectable?: boolean;
  };
  validation?: {
    sourceTypes?: string[]; // allowed source node types
    targetTypes?: string[]; // allowed target node types
    maxConnections?: number;
  };
  data?: Record<string, any>; // custom data for the edge
}

// Custom icon configuration
export interface CustomIcon {
  type: 'lucide' | 'custom' | 'url' | 'svg' | 'plugin';
  value: string; // icon name, URL, SVG string, or plugin reference
  fallback?: string; // fallback icon name
  size?: number;
  color?: string;
  className?: string;
}

// Dynamic handles configuration for the dynamic-handles field type
export interface DynamicHandlesConfig {
  // The key in dynamicHandles data where these handles are stored
  handleKey: string;
  // Type of handles (source/target)
  handleType: 'source' | 'target';
  // Position of handles
  position: 'left' | 'right' | 'top' | 'bottom';
  // Label for the section
  sectionLabel: string;
  // Button text for adding new handles
  addButtonText: string;
  // Whether to show description field
  showDescription?: boolean;
  // Maximum number of handles allowed
  maxHandles?: number;
  // Whether to show the handles in a special layout section
  renderInSection?: boolean;
}

// Enhanced layout configuration - more flexible and universal
export interface LayoutConfig {
  // Main layout structure
  structure?: {
    // How to organize the main content area
    contentLayout?: 'vertical' | 'horizontal' | 'grid' | 'custom';
    // Whether to show field labels
    showLabels?: boolean;
    // Field arrangement
    fieldGroups?: FieldGroup[];
  };
  
  // Special sections that can be added to any node
  sections?: {
    // Tool/dynamic handles sections
    tools?: {
      position: 'top' | 'bottom' | 'left' | 'right';
      title: string;
      style?: 'grey-bar' | 'bordered' | 'plain';
      fieldKey: string; // which dynamic-handles field to render here
    }[];
    
    // Custom content sections
    content?: {
      position: 'top' | 'bottom' | 'left' | 'right';
      title?: string;
      fieldKeys: string[]; // which fields to render in this section
      style?: 'card' | 'bordered' | 'plain';
    }[];
    
    // Status/action sections
    actions?: {
      position: 'header' | 'footer' | 'sidebar';
      items: ActionItem[];
    }[];
  };
  
  // Visual overrides
  visual?: {
    // Override default field rendering
    fieldOverrides?: {
      [fieldKey: string]: {
        width?: 'full' | 'half' | 'third' | 'auto';
        style?: 'compact' | 'expanded' | 'minimal';
        position?: 'inline' | 'section';
      };
    };
    
    // Handle positioning
    handleLayout?: {
      leftSide?: string[]; // field keys for left-side handles
      rightSide?: string[]; // field keys for right-side handles
      topSide?: string[]; // field keys for top handles
      bottomSide?: string[]; // field keys for bottom handles
    };
  };
}

// Field grouping for better organization
export interface FieldGroup {
  title?: string;
  fields: string[]; // field keys
  layout?: 'vertical' | 'horizontal' | 'grid';
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

// Action items for action sections
export interface ActionItem {
  type: 'button' | 'toggle' | 'status' | 'custom';
  label: string;
  action?: string; // action identifier
  icon?: string;
  variant?: 'primary' | 'secondary' | 'destructive';
}

// Much simpler node type definition
export interface NodeType {
  // Identity
  id: string; // author/node-name
  name: string;
  description: string;
  category: string;
  version: string;
  
  // Simple UI configuration
  ui?: {
    icon?: string;
    width?: number;
    height?: number;
    color?: string; // Single accent color that drives everything
    className?: string;
  };
  
  // Simple behavior
  behavior?: {
    deletable?: boolean;
    resizable?: boolean;
  };
  
  // The core: fields and handles
  fields: ConfigField[];
  handles: HandleDefinition[];
  
  // Simple feature flags
  features?: string[]; // ['model-selector', 'status-indicator', 'code-editor']
  
  // Repository info
  repository: {
    url: string; // Full repo URL
    path?: string;
    version: string;
  };
  
  // Metadata
  author: string;
  license?: string;
  keywords?: string[];
}