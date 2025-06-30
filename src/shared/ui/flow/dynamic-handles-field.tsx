import { memo, useCallback } from 'react';
import { Position, useUpdateNodeInternals } from '@xyflow/react';
import { Button } from '../button';
import { EditableHandle, EditableHandleDialog } from './editable-handle';
import { PlusIcon } from '@radix-ui/react-icons';
import type { DynamicHandlesConfig } from '@/shared/types/node';
import type { DynamicHandle } from '@/shared/lib/flow/workflow';

interface DynamicHandlesFieldProps {
  id: string; // field ID
  value: DynamicHandle[]; // array of dynamic handles
  onChange: (value: DynamicHandle[]) => void;
  disabled?: boolean;
  field: {
    customProps?: DynamicHandlesConfig;
  };
  nodeId: string; // the actual node ID
  onCreateHandle?: (name: string, description?: string) => boolean;
  onUpdateHandle?: (handleId: string, name: string, description?: string) => boolean;
  onRemoveHandle?: (handleId: string) => void;
}

export const DynamicHandlesField = memo(function DynamicHandlesField({
  id,
  value = [],
  disabled = false,
  field,
  nodeId,
  onCreateHandle,
  onUpdateHandle,
  onRemoveHandle,
}: DynamicHandlesFieldProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  const config = field.customProps;

  if (!config) {
    return <div className="text-xs text-muted-foreground">Dynamic handles configuration missing</div>;
  }

  const handleCreate = useCallback(
    (name: string, description?: string) => {
      if (!onCreateHandle) return false;
      
      // Check max handles limit
      if (config.maxHandles && value.length >= config.maxHandles) {
        return false;
      }
      
      const result = onCreateHandle(name, description);
      if (result) {
        updateNodeInternals(nodeId);
      }
      return result;
    },
    [onCreateHandle, config.maxHandles, value.length, updateNodeInternals, nodeId],
  );

  const handleUpdate = useCallback(
    (handleId: string, name: string, description?: string) => {
      if (!onUpdateHandle) return false;
      
      const result = onUpdateHandle(handleId, name, description);
      if (result) {
        updateNodeInternals(nodeId);
      }
      return result;
    },
    [onUpdateHandle, updateNodeInternals, nodeId],
  );

  const handleRemove = useCallback(
    (handleId: string) => {
      if (!onRemoveHandle) return;
      
      onRemoveHandle(handleId);
      updateNodeInternals(nodeId);
    },
    [onRemoveHandle, updateNodeInternals, nodeId],
  );

  const getPosition = (): Position => {
    switch (config.position) {
      case 'left': return Position.Left;
      case 'right': return Position.Right;
      case 'top': return Position.Top;
      case 'bottom': return Position.Bottom;
      default: return Position.Right;
    }
  };

  // Check if we should render in a special section (like Generate Text tools section)
  if (config.renderInSection) {
    return (
      <div className="border-t border-border">
        <div className="flex items-center justify-between py-2 px-4 bg-muted">
          <span className="text-sm font-medium">{config.sectionLabel}</span>
          <EditableHandleDialog
            variant="create"
            onSave={handleCreate}
            align="end"
            showDescription={config.showDescription}
          >
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 px-2"
              disabled={disabled || (config.maxHandles ? value.length >= config.maxHandles : false)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              {config.addButtonText}
            </Button>
          </EditableHandleDialog>
        </div>
        <div className="flex flex-col">
          {value.map((handle) => (
            <EditableHandle
              key={handle.id}
              nodeId={nodeId}
              handleId={handle.id}
              name={handle.name}
              description={handle.description}
              type={config.handleType}
              position={getPosition()}
              wrapperClassName="w-full"
              onUpdateTool={handleUpdate}
              onDelete={handleRemove}
              showDescription={config.showDescription}
            />
          ))}
        </div>
      </div>
    );
  }

  // Regular field rendering (inline with other form fields)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{config.sectionLabel}</span>
        <EditableHandleDialog
          variant="create"
          onSave={handleCreate}
          align="end"
          showDescription={config.showDescription}
        >
          <Button 
            variant="outline" 
            size="sm"
            disabled={disabled || (config.maxHandles ? value.length >= config.maxHandles : false)}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            {config.addButtonText}
          </Button>
        </EditableHandleDialog>
      </div>
      
      <div className="space-y-1">
        {value.length === 0 ? (
          <div className="text-xs text-muted-foreground p-2 border border-dashed rounded">
            No {config.sectionLabel.toLowerCase()} added yet
          </div>
        ) : (
          value.map((handle) => (
            <div key={handle.id} className="border rounded p-2">
              <EditableHandle
                nodeId={nodeId}
                handleId={handle.id}
                name={handle.name}
                description={handle.description}
                type={config.handleType}
                position={getPosition()}
                onUpdateTool={handleUpdate}
                onDelete={handleRemove}
                showDescription={config.showDescription}
              />
            </div>
          ))
        )}
      </div>
      
      {config.maxHandles && (
        <div className="text-xs text-muted-foreground">
          {value.length} / {config.maxHandles} handles
        </div>
      )}
    </div>
  );
});

export default DynamicHandlesField; 