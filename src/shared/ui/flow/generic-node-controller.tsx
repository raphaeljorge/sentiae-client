import { memo } from 'react';
import type { NodeProps } from '@xyflow/react';
import { Position } from '@xyflow/react';
import { useNodeTypes } from '@/shared/hooks/use-node-types';
import { BaseNode } from './base-node';
import { NodeHeader, NodeHeaderTitle, NodeHeaderActions, NodeHeaderAction, NodeHeaderIcon } from './node-header';
import { NodeHeaderStatus } from './node-header-status';
import { LabeledHandle } from './labeled-handle';
import { EditableHandle, EditableHandleDialog } from './editable-handle';
import { Input } from '../input';
import { Label } from '../label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { Textarea } from '../textarea';
import { Checkbox } from '../checkbox';
import { ModelSelector, type Model } from '../model-selector';
import { Separator } from '../separator';
import CodeMirror from '@uiw/react-codemirror';
import { createTheme } from "@uiw/codemirror-themes";
import { useWorkflow } from '@/shared/hooks/use-workflow';
import type { ConfigField, HandleDefinition, DynamicHandleDefinition } from '@/shared/types/node';
import type { DynamicHandle } from '@/shared/lib/flow/workflow';
import { Button } from '../button';
import { cn } from '@/shared/lib/utils';
import { PenLine, Bot, PencilRuler, Trash, PlusIcon, Eye } from 'lucide-react';
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
  const nodeData = data as any; // Aggressive type assertion to unblock
  
  // Try to get definition from data first (new dynamic approach), 
  // then fall back to getNodeType (legacy approach)
  const definition = nodeData.definition || getNodeType(type);
  const { updateNode, addDynamicHandle, removeDynamicHandle } = useWorkflow();

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
    // TODO: Fix this type assertion. The `updateNode` function expects a
    // specific node type, but the generic controller receives a string.
    updateNode(id, type as any, { config: { ...(nodeData.config || {}), [key]: value } });
  };

  const handleCreateDynamicHandle = (key: string) => (name: string, description?: string) => {
    addDynamicHandle(id, type as any, key, { name, description });
    return true;
  }

  const handleUpdateDynamicHandle = (key: string) => (handleId: string, name: string, description?: string) => {
    // A full implementation would find the handle in the data.dynamicHandles[key] array
    // and update it, then call updateNode.
    console.log('Update dynamic handle (not implemented):', { key, handleId, name, description });
    return true;
  }

  const handleRemoveDynamicHandle = (key: string) => (handleId: string) => {
    removeDynamicHandle(id, type as any, key, handleId);
  }

  const config = nodeData.config || {};
  const dynamicHandles = nodeData.dynamicHandles || {};

  // Check if this node has a specialized layout
  const componentType = definition.componentType;
  
  // Common props for all layouts
  const layoutProps = {
    definition,
    nodeData,
    config,
    dynamicHandles,
    selected,
    handleFieldChange,
    handleCreateDynamicHandle,
    handleRemoveDynamicHandle,
    id
  };

  // Use specialized layouts for specific node types
  if (componentType === 'text-input') {
    return <TextInputLayout {...layoutProps} />;
  }
  
  if (componentType === 'visualize-text') {
    return <VisualizeTextLayout {...layoutProps} />;
  }
  
  if (componentType === 'generate-text') {
    return <GenerateTextLayout {...layoutProps} />;
  }
  
  if (componentType === 'prompt-crafter') {
    return <PromptCrafterLayout {...layoutProps} />;
  }

  // Fallback to generic layout for other node types
  // Apply dynamic theming from the node definition
  const getNodeClassName = () => {
    // Apply custom theme from the node definition
    const customClasses = definition.ui?.className || "";
    const hoverRing = definition.ui?.theme?.hoverRing || "hover:ring-1";
    
    // Apply status-based border colors
    const statusClasses = (() => {
      const status = nodeData.executionState?.status;
      if (!status || status === 'idle') return definition.ui?.theme?.borderColor?.default || "";
      
      const statusColorMap = {
        processing: definition.ui?.theme?.borderColor?.processing || "border-orange-500",
        error: definition.ui?.theme?.borderColor?.error || "border-red-500", 
        success: definition.ui?.theme?.borderColor?.success || "border-green-500"
      };
      
      return statusColorMap[status as keyof typeof statusColorMap] || "";
    })();
    
    // Filter out empty classes and join with spaces
    return [hoverRing, statusClasses, customClasses]
      .filter(cls => cls && cls.trim())
      .join(' ');
  };

  // Apply dynamic sizing from the node definition
  const getNodeStyle = () => {
    const style: React.CSSProperties = {};
    
    if (definition.ui?.width) style.width = definition.ui.width;
    if (definition.ui?.height) style.height = definition.ui.height;
    if (definition.ui?.minWidth) style.minWidth = definition.ui.minWidth;
    if (definition.ui?.minHeight) style.minHeight = definition.ui.minHeight;
    
    return style;
  };

  // Specialized layout for text-input nodes
  function TextInputLayout({ definition, nodeData, config, selected, handleFieldChange }: any) {
    return (
      <BaseNode
        selected={selected}
        className={cn("flex flex-col h-full p-0", {
          "border-orange-500": nodeData.executionState?.status === "processing",
          "border-red-500": nodeData.executionState?.status === "error",
        })}
        style={{ minHeight: 200, minWidth: 250 }}
      >
        <NodeHeader className="m-0">
          <NodeHeaderIcon>
            <PenLine />
          </NodeHeaderIcon>
          <NodeHeaderTitle>Text Input</NodeHeaderTitle>
          <NodeHeaderActions>
            <NodeHeaderStatus status={nodeData.executionState?.status} />
          </NodeHeaderActions>
        </NodeHeader>
        <Separator />
        <div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
          <Textarea
            value={config.value || ""}
            onChange={(e) => handleFieldChange('value', e.target.value)}
            className="w-full flex-1 resize-none nodrag nopan nowheel"
            placeholder="Enter your text here..."
          />
        </div>
        <div className="flex justify-end pt-2 pb-4 text-sm">
          {definition.staticHandles?.map((handle: HandleDefinition) => (
            <LabeledHandle
              key={handle.id}
              id={handle.id}
              type={handle.type}
              position={handle.position as Position}
              title={handle.title}
              className="justify-self-end"
            />
          ))}
        </div>
      </BaseNode>
    );
  }

  // Specialized layout for visualize-text nodes
  function VisualizeTextLayout({ definition, nodeData, config, selected }: any) {
    return (
      <BaseNode
        selected={selected}
        className={cn("flex flex-col p-0", {
          "border-orange-500": nodeData.executionState?.status === "processing",
          "border-red-500": nodeData.executionState?.status === "error",
        })}
        style={{ minHeight: 200, minWidth: 250 }}
      >
        <NodeHeader className="m-0">
          <NodeHeaderIcon>
            <Eye />
          </NodeHeaderIcon>
          <NodeHeaderTitle>Visualize Text</NodeHeaderTitle>
          <NodeHeaderActions>
            <NodeHeaderStatus status={nodeData.executionState?.status} />
          </NodeHeaderActions>
        </NodeHeader>
        <Separator />
        <div className="p-2 flex-1 overflow-auto flex flex-col">
          <div className="flex-1 overflow-auto nodrag nopan nowheel border border-border rounded-md p-2 select-text cursor-auto">
            <MarkdownContent
              id={nodeData.id}
              content={nodeData.executionState?.targets?.input ? nodeData.executionState.targets.input : "No text to display"}
            />
          </div>
        </div>
        <div className="flex justify-start pt-2 pb-4 text-sm">
          {definition.staticHandles?.map((handle: HandleDefinition) => (
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

  // Specialized layout for generate-text nodes
  function GenerateTextLayout({ definition, nodeData, config, dynamicHandles, selected, handleFieldChange, handleCreateDynamicHandle, handleRemoveDynamicHandle }: any) {
    return (
      <BaseNode
        selected={selected}
        className={cn("w-[350px] p-0 hover:ring-orange-500", {
          "border-orange-500": nodeData.executionState?.status === "processing",
          "border-red-500": nodeData.executionState?.status === "error",
        })}
      >
        <NodeHeader className="m-0">
          <NodeHeaderIcon>
            <Bot />
          </NodeHeaderIcon>
          <NodeHeaderTitle>Generate Text</NodeHeaderTitle>
          <NodeHeaderActions>
            <NodeHeaderStatus status={nodeData.executionState?.status} />
          </NodeHeaderActions>
        </NodeHeader>
        <Separator />
        <div className="p-4 flex flex-col gap-4">
          <ModelSelector
            value={config.model}
            onChange={(value) => handleFieldChange('model', value)}
            disabled={definition.features?.modelSelector?.disabled}
            disabledModels={definition.features?.modelSelector?.disabledModels as Model[]}
          />
        </div>
        <div className="grid grid-cols-[2fr,1fr] gap-2 pt-2 text-sm">
          <div className="flex flex-col gap-2 min-w-0">
            <LabeledHandle
              id="system"
              title="System"
              type="target"
              position={Position.Left}
            />
            <LabeledHandle
              id="prompt"
              title="Prompt"
              type="target"
              position={Position.Left}
              className="col-span-2"
            />
          </div>
          <div className="justify-self-end">
            <LabeledHandle
              id="result"
              title="Result"
              type="source"
              position={Position.Right}
            />
          </div>
        </div>
        <div className="border-t border-border mt-2">
          <div>
            <div className="flex items-center justify-between py-2 px-4 bg-muted">
              <span className="text-sm font-medium">Tool outputs</span>
              <EditableHandleDialog
                variant="create"
                onSave={handleCreateDynamicHandle('tools')}
                showDescription
              >
                <Button variant="outline" size="sm" className="h-7 px-2">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New tool output
                </Button>
              </EditableHandleDialog>
            </div>
            <div className="flex flex-col">
              {(dynamicHandles.tools || []).map((tool: DynamicHandle) => (
                <EditableHandle
                  key={tool.id}
                  nodeId={nodeData.id}
                  handleId={tool.id}
                  name={tool.name}
                  description={tool.description}
                  type="source"
                  position={Position.Right}
                  wrapperClassName="w-full"
                  onUpdateTool={() => true}
                  onDelete={handleRemoveDynamicHandle('tools')}
                  showDescription
                />
              ))}
            </div>
          </div>
        </div>
      </BaseNode>
    );
  }

  // Specialized layout for prompt-crafter nodes
  function PromptCrafterLayout({ definition, nodeData, config, dynamicHandles, selected, handleFieldChange, handleCreateDynamicHandle, handleRemoveDynamicHandle }: any) {
    return (
      <BaseNode
        selected={selected}
        className={cn("w-[350px] p-0 hover:ring-orange-500", {
          "border-orange-500": nodeData.executionState?.status === "processing",
          "border-red-500": nodeData.executionState?.status === "error",
        })}
      >
        <NodeHeader className="m-0">
          <NodeHeaderIcon>
            <PencilRuler />
          </NodeHeaderIcon>
          <NodeHeaderTitle>Prompt Crafter</NodeHeaderTitle>
          <NodeHeaderActions>
            <NodeHeaderStatus status={nodeData.executionState?.status} />
          </NodeHeaderActions>
        </NodeHeader>
        <Separator />
        <div className="p-4 flex flex-col gap-4">
          <CodeMirror
            value={config.template || ''}
            height="200px"
            theme={genericTheme}
            onChange={value => handleFieldChange('template', value)}
            className="nodrag border rounded-md overflow-hidden [&_.cm-content]:!cursor-text [&_.cm-line]:!cursor-text nodrag nopan nowheel"
            placeholder="Enter your prompt template here..."
          />
        </div>
        <div className="border-t border-border">
          <div className="flex items-center justify-between py-2 px-4 bg-muted">
            <span className="text-sm font-medium">Template inputs</span>
            <EditableHandleDialog
              variant="create"
              onSave={handleCreateDynamicHandle('template-tags')}
              showDescription={false}
            >
              <Button variant="outline" size="sm" className="h-7 px-2">
                <PlusIcon className="h-4 w-4 mr-1" />
                Add input
              </Button>
            </EditableHandleDialog>
          </div>
          <div className="flex flex-col">
            {(dynamicHandles['template-tags'] || []).map((input: DynamicHandle) => (
              <EditableHandle
                key={input.id}
                nodeId={nodeData.id}
                handleId={input.id}
                name={input.name}
                type="target"
                position={Position.Left}
                wrapperClassName="w-full"
                onUpdateTool={() => true}
                onDelete={handleRemoveDynamicHandle('template-tags')}
                showDescription={false}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end pt-2 pb-4 text-sm">
          <LabeledHandle
            id="result"
            title="Result"
            type="source"
            position={Position.Right}
            className="justify-self-end"
          />
        </div>
      </BaseNode>
    );
  }

  return (
    <BaseNode 
      selected={selected}
      className={`${getNodeClassName()} p-0 h-full flex flex-col`}
      style={getNodeStyle()}
    >
      <NodeHeader className="m-0">
        <NodeHeaderTitle>{definition.name}</NodeHeaderTitle>
      </NodeHeader>
      <Separator />
      <div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
        {definition.configFields.map((field: ConfigField) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            {(() => {
              const fieldValue = config[field.key as keyof typeof config];
              switch (field.type) {
                case 'string':
                  return <Input id={field.key} placeholder={field.placeholder} defaultValue={fieldValue} onChange={e => handleFieldChange(field.key, e.target.value)} />;
                case 'textarea':
                  return <Textarea id={field.key} placeholder={field.placeholder} defaultValue={fieldValue} onChange={e => handleFieldChange(field.key, e.target.value)} />;
                case 'number':
                  return <Input id={field.key} type="number" placeholder={field.placeholder} defaultValue={fieldValue} onChange={e => handleFieldChange(field.key, e.target.value)} />;
                case 'boolean':
                  return <Checkbox id={field.key} checked={fieldValue} onCheckedChange={checked => handleFieldChange(field.key, checked)} />;
                case 'select':
                  return (
                    <Select value={fieldValue} onValueChange={value => handleFieldChange(field.key, value)}>
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
                      disabled={definition.features?.modelSelector?.disabled}
                      disabledModels={definition.features?.modelSelector?.disabledModels as Model[]}
                    />
                  );
                case 'code':
                case 'json':
                  return (
                    <CodeMirror
                      value={fieldValue || ''}
                      height={definition.features?.codeEditor?.height || '150px'}
                      theme={genericTheme}
                      onChange={value => handleFieldChange(field.key, value)}
                      className="nodrag border rounded-md overflow-hidden [&_.cm-content]:!cursor-text [&_.cm-line]:!cursor-text nodrag nopan nowheel"
                      placeholder={field.placeholder}
                    />
                  );
                default:
                  return null;
              }
            })()}
            {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
          </div>
        ))}
        
        {/* Dynamic Handles Section */}
        {definition.dynamicHandles?.map((dynamicHandleDef: DynamicHandleDefinition) => {
          const handles: DynamicHandle[] = (dynamicHandles as Record<string, DynamicHandle[]>)[dynamicHandleDef.key] || [];
          return (
            <div key={dynamicHandleDef.key} className="space-y-2">
              <h4 className="text-sm font-semibold">{dynamicHandleDef.title}</h4>
              {handles.map((handle: DynamicHandle) => (
                <EditableHandle
                  key={handle.id}
                  nodeId={id}
                  handleId={handle.id}
                  name={handle.name}
                  description={handle.description}
                  position={dynamicHandleDef.position as Position}
                  type={dynamicHandleDef.type}
                  onUpdateTool={handleUpdateDynamicHandle(dynamicHandleDef.key)}
                  onDelete={handleRemoveDynamicHandle(dynamicHandleDef.key)}
                  showDescription={dynamicHandleDef.showDescription}
                />
              ))}
              {dynamicHandleDef.allowCreate && (
                 <EditableHandleDialog
                    variant="create"
                    onSave={handleCreateDynamicHandle(dynamicHandleDef.key)}
                    showDescription={dynamicHandleDef.showDescription}
                 >
                    <Button type="button" variant="ghost" className="w-full h-8 text-xs rounded-md border border-dashed hover:bg-muted">Add Handle</Button>
                 </EditableHandleDialog>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Static Handles Section */}
      {definition.staticHandles && definition.staticHandles.length > 0 && (
        <div className="flex justify-end pt-2 pb-4 text-sm">
          {definition.staticHandles.map((handle: HandleDefinition) => (
            <LabeledHandle
              key={handle.id}
              id={handle.id}
              type={handle.type}
              position={handle.position as Position}
              title={handle.title}
              className="justify-self-end"
            />
          ))}
        </div>
      )}
    </BaseNode>
  );
}

export const GenericNodeController = memo(GenericNode); 