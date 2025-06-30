import React, { useState, useEffect, memo } from 'react';
import { NodeProps, Position } from '@xyflow/react';
import { Input } from '../input';
import { Textarea } from '../textarea';
import { Label } from '../label';
import { Button } from '../button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Checkbox } from '../checkbox';
import { Separator } from '../separator';
import { BaseNode } from './base-node';
import { NodeHeader, NodeHeaderIcon, NodeHeaderTitle, NodeHeaderActions } from './node-header';
import { NodeHeaderStatus } from './node-header-status';
import { LabeledHandle } from './labeled-handle';
import { EditableHandle, EditableHandleDialog } from './editable-handle';
import { DynamicHandlesField } from './dynamic-handles-field';
import { ModelSelector, type Model } from '../model-selector';
import { useNodeTypes } from '@/shared/hooks/use-node-types';
import { useWorkflow } from '@/shared/hooks/use-workflow';
import { ConfigField, NodeType, HandleDefinition } from '@/shared/types/node';
import { DynamicHandle } from '@/shared/lib/flow/workflow';
import { cn } from '@/shared/lib/utils';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from "@uiw/codemirror-themes";
import { Package, PlusIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { MarkdownContent } from '../markdown-content';

const genericTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "hsl(var(--foreground))",
    caret: "hsl(var(--foreground))",
    selection: "#3B82F6",
    lineHighlight: "transparent",
  },
  styles: [],
});

function GenericNode({ id, data, type, selected }: NodeProps) {
  const { getNodeType } = useNodeTypes();
  const nodeData = data as any;
  const definition = nodeData.definition || getNodeType(type);
  const { updateNode, addDynamicHandle, removeDynamicHandle } = useWorkflow();

  // State for form values
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  // Initialize form values
  useEffect(() => {
    const initialValues = { ...nodeData.config };
    for (const field of definition?.fields || []) {
      if (initialValues[field.key] === undefined && field.defaultValue !== undefined) {
        initialValues[field.key] = field.defaultValue;
      }
    }
    setFormValues(initialValues);
  }, [nodeData.config, definition]);

  if (!definition) {
    return (
      <BaseNode selected={selected}>
        <NodeHeader>
          <NodeHeaderTitle>{`Unknown Node: ${type}`}</NodeHeaderTitle>
        </NodeHeader>
        <p className="p-4 text-destructive text-sm">Node definition not found.</p>
      </BaseNode>
    );
  }

  const handleFieldChange = (key: string, value: any) => {
    const newValues = { ...formValues, [key]: value };
    setFormValues(newValues);
    (updateNode as any)(id, type, { config: newValues });
  };

  const handleCreateDynamicHandle = (key: string) => (name: string, description?: string) => {
    const handleId = addDynamicHandle(id, type as any, key, { name, description });
    return !!handleId;
  };

  const handleUpdateDynamicHandle = (key: string) => (handleId: string, name: string, description?: string) => {
    console.log('Update dynamic handle:', { key, handleId, name, description });
    return true;
  };

  const handleRemoveDynamicHandle = (key: string) => (handleId: string) => {
    removeDynamicHandle(id, type as any, key, handleId);
  };

  const config = formValues;
  const dynamicHandles = nodeData.dynamicHandles || {};

  // Get the appropriate icon component
  const getIconComponent = () => {
    const iconName = definition.ui?.icon || 'Package';
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || Package;
  };

  // Render field based on type
  const renderField = (field: ConfigField) => {
    const fieldValue = config[field.key];

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={field.key}>{field.label}</Label>
        {(() => {
          switch (field.type) {
            case 'string':
              return (
                <Input 
                  id={field.key} 
                  placeholder={field.placeholder} 
                  value={fieldValue || ''} 
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                />
              );
            case 'textarea':
              return (
                <Textarea 
                  id={field.key} 
                  placeholder={field.placeholder} 
                  value={fieldValue || ''} 
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                />
              );
            case 'number':
              return (
                <Input 
                  id={field.key} 
                  type="number" 
                  placeholder={field.placeholder} 
                  value={fieldValue || ''} 
                  onChange={e => handleFieldChange(field.key, e.target.value)}
                />
              );
            case 'boolean':
              return (
                <Checkbox 
                  id={field.key} 
                  checked={fieldValue || false} 
                  onCheckedChange={checked => handleFieldChange(field.key, checked)}
                />
              );
            case 'select':
              return (
                <Select 
                  value={fieldValue || ''} 
                  onValueChange={value => handleFieldChange(field.key, value)}
                >
                  <SelectTrigger id={field.key}>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );
            case 'model':
              return (
                <ModelSelector
                  value={fieldValue as Model}
                  onChange={value => handleFieldChange(field.key, value)}
                />
              );
            case 'code':
            case 'json':
              return (
                <CodeMirror
                  value={fieldValue || ''}
                  height={field.props?.height || '150px'}
                  theme={genericTheme}
                  onChange={value => handleFieldChange(field.key, value)}
                  className="nodrag border rounded-md overflow-hidden [&_.cm-content]:!cursor-text [&_.cm-line]:!cursor-text nodrag nopan nowheel"
                  placeholder={field.placeholder}
                />
              );
            case 'dynamic-handles':
              return (
                <DynamicHandlesField
                  id={field.key}
                  value={dynamicHandles[field.key] || []}
                  onChange={(value) => {
                    (updateNode as any)(id, type, {
                      dynamicHandles: {
                        ...dynamicHandles,
                        [field.key]: value
                      }
                    });
                  }}
                  field={{
                    customProps: {
                      handleKey: field.key,
                      handleType: field.handles?.type || 'source',
                      position: field.handles?.position || 'right',
                      sectionLabel: field.label || 'Dynamic Handles',
                      addButtonText: `Add ${field.label?.toLowerCase() || 'handle'}`,
                      showDescription: field.handles?.showDescription ?? true,
                      maxHandles: field.handles?.max,
                      renderInSection: field.handles?.section === 'bottom',
                    }
                  }}
                  nodeId={id}
                  onCreateHandle={handleCreateDynamicHandle(field.key)}
                  onUpdateHandle={handleUpdateDynamicHandle(field.key)}
                  onRemoveHandle={handleRemoveDynamicHandle(field.key)}
                />
              );
            default:
              return <div className="text-xs text-muted-foreground">Unsupported field type: {field.type}</div>;
          }
        })()}
        {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
      </div>
    );
  };

  // Get node styling based on new format
  const getNodeClassName = () => {
    const baseClasses = "p-0 h-full flex flex-col";
    const customClasses = definition.ui?.className || '';
    
    return `${baseClasses} ${customClasses}`.trim();
  };

  const getNodeStyle = () => {
    const style: React.CSSProperties = {};
    
    if (definition.ui?.width) style.width = definition.ui.width;
    if (definition.ui?.height) style.height = definition.ui.height;
    
    return style;
  };

  // Check for markdown-renderer feature
  if (definition.features?.includes('markdown-renderer')) {
    const textToDisplay = nodeData.executionState?.targets?.input || 'No text to display';
    
    return (
      <BaseNode 
        selected={selected}
        className={getNodeClassName()}
        style={getNodeStyle()}
      >
        <NodeHeader className="m-0">
          <NodeHeaderIcon>{React.createElement(getIconComponent())}</NodeHeaderIcon>
          <NodeHeaderTitle>{definition.name}</NodeHeaderTitle>
          <NodeHeaderActions>
            <NodeHeaderStatus status={nodeData.executionState?.status} />
          </NodeHeaderActions>
        </NodeHeader>
        <Separator />
        <div className="p-2 flex-1 overflow-auto flex flex-col">
          <div className="flex-1 overflow-auto nodrag nopan nowheel border border-border rounded-md p-2 select-text cursor-auto">
            <MarkdownContent id={id} content={textToDisplay} />
          </div>
        </div>
        {/* Render input handle */}
        <div className="flex justify-start pt-2 pb-4 text-sm">
          {definition.handles.filter((h: HandleDefinition) => h.type === 'target').map((handle: HandleDefinition) => (
            <LabeledHandle
              key={handle.id}
              id={handle.id}
              type={handle.type}
              position={handle.position as Position}
              title={handle.title}
            />
          ))}
        </div>
      </BaseNode>
    );
  }

  // Separate fields into regular fields and bottom-section dynamic handles
  const regularFields = definition.fields.filter((field: ConfigField) => 
    field.type !== 'dynamic-handles' || field.handles?.section !== 'bottom'
  );
  const bottomSectionFields = definition.fields.filter((field: ConfigField) => 
    field.type === 'dynamic-handles' && field.handles?.section === 'bottom'
  );

  return (
    <BaseNode 
      selected={selected}
      className={getNodeClassName()}
      style={getNodeStyle()}
    >
      <NodeHeader className="m-0">
        <NodeHeaderIcon>
          {React.createElement(getIconComponent())}
        </NodeHeaderIcon>
        <NodeHeaderTitle>{definition.name}</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderStatus status={nodeData.executionState?.status} />
        </NodeHeaderActions>
      </NodeHeader>
      <Separator />
      
      {/* Main content area with fields */}
      {regularFields.length > 0 && (
        <div className="p-4 flex flex-col gap-4">
          {regularFields.map(renderField)}
        </div>
      )}
      
      {/* Static Handles Section */}
      {definition.handles && definition.handles.length > 0 && (
        <div className="grid grid-cols-[2fr,1fr] gap-2 px-4 py-2 text-sm">
          {/* Input handles (targets) on the left */}
          <div className="flex flex-col gap-2 min-w-0">
            {definition.handles.filter((h: HandleDefinition) => h.type === 'target').map((handle: HandleDefinition) => (
              <LabeledHandle
                key={handle.id}
                id={handle.id}
                type={handle.type}
                position={handle.position as Position}
                title={handle.title}
              />
            ))}
          </div>
          
          {/* Output handles (sources) on the right */}
          <div className="justify-self-end">
            {definition.handles.filter((h: HandleDefinition) => h.type === 'source').map((handle: HandleDefinition) => (
              <LabeledHandle
                key={handle.id}
                id={handle.id}
                type={handle.type}
                position={handle.position as Position}
                title={handle.title}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Bottom Section Dynamic Handles */}
      {bottomSectionFields.map((field: ConfigField) => (
        <div key={field.key}>
          {renderField(field)}
        </div>
      ))}
    </BaseNode>
  );
}

export const GenericNodeController = memo(GenericNode); 