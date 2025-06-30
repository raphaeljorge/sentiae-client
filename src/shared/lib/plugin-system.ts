import type { PluginRegistry, PluginFieldType, ValidationRule, ConfigField, EdgeTypeConfig, CustomIcon } from '@/shared/types/node';
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { DynamicHandlesField } from '@/shared/ui/flow/dynamic-handles-field';

class PluginSystemManager {
  private registry: PluginRegistry = {
    fieldTypes: new Map(),
    validators: new Map(),
    icons: new Map(),
    edgeTypes: new Map(),
  };

  // Field Type Management
  registerFieldType(type: string, plugin: PluginFieldType) {
    this.registry.fieldTypes.set(type, plugin);
  }

  getFieldType(type: string): PluginFieldType | undefined {
    return this.registry.fieldTypes.get(type);
  }

  getAllFieldTypes(): Map<string, PluginFieldType> {
    return this.registry.fieldTypes;
  }

  // Validator Management
  registerValidator(name: string, validator: (value: any, field: ConfigField, allValues: Record<string, any>) => string | null) {
    this.registry.validators.set(name, validator);
  }

  getValidator(name: string) {
    return this.registry.validators.get(name);
  }

  // Icon Management
  registerIcon(name: string, icon: React.ComponentType<any> | string) {
    this.registry.icons.set(name, icon);
  }

  getIcon(iconConfig: string | CustomIcon): React.ComponentType<any> | null {
    if (typeof iconConfig === 'string') {
      // Handle simple string icons (Lucide)
      const LucideIcon = (LucideIcons as any)[iconConfig];
      if (LucideIcon) return LucideIcon;
      
      // Check plugin registry
      const pluginIcon = this.registry.icons.get(iconConfig);
      if (pluginIcon) {
        return typeof pluginIcon === 'string' ? null : pluginIcon;
      }
      
      return null;
    }

    // Handle CustomIcon objects
    switch (iconConfig.type) {
      case 'lucide': {
        const LucideIcon = (LucideIcons as any)[iconConfig.value];
        if (LucideIcon) return LucideIcon;
        if (iconConfig.fallback) {
          const FallbackIcon = (LucideIcons as any)[iconConfig.fallback];
          if (FallbackIcon) return FallbackIcon;
        }
        return null;
      }

      case 'plugin': {
        const pluginIcon = this.registry.icons.get(iconConfig.value);
        if (pluginIcon && typeof pluginIcon !== 'string') return pluginIcon;
        if (iconConfig.fallback) {
          const FallbackIcon = (LucideIcons as any)[iconConfig.fallback];
          if (FallbackIcon) return FallbackIcon;
        }
        return null;
      }

      case 'custom':
      case 'url':
      case 'svg':
        // These would need special handling in the UI components
        return null;

      default:
        return null;
    }
  }

  // Edge Type Management
  registerEdgeType(type: string, component: React.ComponentType<any>) {
    this.registry.edgeTypes.set(type, component);
  }

  getEdgeType(type: string): React.ComponentType<any> | undefined {
    return this.registry.edgeTypes.get(type);
  }

  getAllEdgeTypes(): Map<string, React.ComponentType<any>> {
    return this.registry.edgeTypes;
  }

  // Validation System
  validateField(value: any, field: ConfigField, allValues: Record<string, any> = {}): string[] {
    const errors: string[] = [];

    if (!field.validation) return errors;

    for (const rule of field.validation) {
      const error = this.validateRule(value, rule, field, allValues);
      if (error) errors.push(error);
    }

    return errors;
  }

  private validateRule(value: any, rule: ValidationRule, field: ConfigField, allValues: Record<string, any>): string | null {
    // Check conditional validation
    if (rule.condition) {
      const conditionMet = this.evaluateCondition(rule.condition, allValues);
      if (!conditionMet) return null; // Skip validation if condition not met
    }

    switch (rule.type) {
      case 'required':
        if (value === null || value === undefined || value === '') {
          return rule.message || `${field.label} is required`;
        }
        break;

      case 'min':
        if (typeof value === 'number' && value < (rule.value || 0)) {
          return rule.message || `${field.label} must be at least ${rule.value}`;
        }
        if (typeof value === 'string' && value.length < (rule.value || 0)) {
          return rule.message || `${field.label} must be at least ${rule.value} characters`;
        }
        break;

      case 'max':
        if (typeof value === 'number' && value > (rule.value || 0)) {
          return rule.message || `${field.label} must be at most ${rule.value}`;
        }
        if (typeof value === 'string' && value.length > (rule.value || 0)) {
          return rule.message || `${field.label} must be at most ${rule.value} characters`;
        }
        break;

      case 'pattern':
        if (typeof value === 'string' && rule.value) {
          const regex = new RegExp(rule.value);
          if (!regex.test(value)) {
            return rule.message || `${field.label} format is invalid`;
          }
        }
        break;

      case 'custom':
        if (rule.customValidator) {
          const validator = this.getValidator(rule.customValidator);
          if (validator) {
            return validator(value, field, allValues);
          }
        }
        break;
    }

    return null;
  }

  // Conditional Display System
  shouldShowField(field: ConfigField, allValues: Record<string, any>): boolean {
    if (!field.conditionalDisplay) return true;

    for (const condition of field.conditionalDisplay) {
      const conditionMet = this.evaluateCondition({
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      }, allValues);

      if (conditionMet && condition.action === 'hide') return false;
      if (!conditionMet && condition.action === 'show') return false;
    }

    return true;
  }

  shouldEnableField(field: ConfigField, allValues: Record<string, any>): boolean {
    if (!field.conditionalDisplay) return true;

    for (const condition of field.conditionalDisplay) {
      const conditionMet = this.evaluateCondition({
        field: condition.field,
        operator: condition.operator,
        value: condition.value
      }, allValues);

      if (conditionMet && condition.action === 'disable') return false;
      if (!conditionMet && condition.action === 'enable') return false;
    }

    return true;
  }

  private evaluateCondition(condition: { field: string; operator: string; value?: any }, allValues: Record<string, any>): boolean {
    const fieldValue = allValues[condition.field];

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'not_equals':
        return fieldValue !== condition.value;
      case 'contains':
        return typeof fieldValue === 'string' && fieldValue.includes(condition.value);
      case 'greater_than':
        return typeof fieldValue === 'number' && fieldValue > condition.value;
      case 'less_than':
        return typeof fieldValue === 'number' && fieldValue < condition.value;
      case 'empty':
        return !fieldValue || fieldValue === '' || (Array.isArray(fieldValue) && fieldValue.length === 0);
      case 'not_empty':
        return fieldValue && fieldValue !== '' && (!Array.isArray(fieldValue) || fieldValue.length > 0);
      default:
        return false;
    }
  }

  // Utility methods
  reset() {
    this.registry.fieldTypes.clear();
    this.registry.validators.clear();
    this.registry.icons.clear();
    this.registry.edgeTypes.clear();
  }

  getRegistry(): PluginRegistry {
    return this.registry;
  }
}

// Global plugin system instance
export const pluginSystem = new PluginSystemManager();

// Built-in validators
pluginSystem.registerValidator('email', (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Please enter a valid email address';
});

pluginSystem.registerValidator('url', (value: string) => {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
});

pluginSystem.registerValidator('json', (value: string) => {
  try {
    JSON.parse(value);
    return null;
  } catch {
    return 'Please enter valid JSON';
  }
});

// Register built-in field types
pluginSystem.registerFieldType('tag-input', {
  component: ({ value = [], onChange, ...props }) => {
    // Placeholder tag input component
    return React.createElement('div', {
      className: 'p-2 border rounded text-sm text-muted-foreground'
    }, [
      'Tag Input (Plugin component not implemented)',
      React.createElement('div', {
        className: 'text-xs mt-1',
        key: 'value'
      }, `Value: ${JSON.stringify(value)}`)
    ]);
  },
  validator: (value: any[]) => {
    if (!Array.isArray(value)) return ['Value must be an array'];
    return [];
  },
});

pluginSystem.registerFieldType('slider', {
  component: ({ value = 0, onChange, field, ...props }) => {
    // Placeholder slider component
    return React.createElement('div', {
      className: 'p-2 border rounded text-sm text-muted-foreground'
    }, [
      'Slider (Plugin component not implemented)',
      React.createElement('div', {
        className: 'text-xs mt-1',
        key: 'value'
      }, `Value: ${value}`)
    ]);
  },
  validator: (value: number, field: any) => {
    const min = field.customProps?.min ?? 0;
    const max = field.customProps?.max ?? 100;
    if (value < min) return [`Value must be at least ${min}`];
    if (value > max) return [`Value must be at most ${max}`];
    return [];
  },
});

pluginSystem.registerFieldType('dynamic-handles', {
  component: DynamicHandlesField,
  validator: (value: any[]) => {
    if (!Array.isArray(value)) return ['Value must be an array'];
    return [];
  },
});

export default pluginSystem; 