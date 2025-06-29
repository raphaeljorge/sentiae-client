import { useEffect, useState, type DragEvent } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/shared/ui/button';
import { Eye, PenLine } from 'lucide-react';
import { useWorkflow } from '@/shared/hooks/use-workflow';
import type { WorkflowResponse } from '@/shared/types/workflow';
import type { FlowNode, FlowEdge } from '@/shared/lib/flow/workflow';
import { NodePalette } from './NodePalette';
import { EditorSubheader } from '@/widgets/editor-subheader';

// Import node controllers
import { GenerateTextNodeController } from '@/shared/ui/flow/generate-text-node-controller';
import { PromptCrafterNodeController } from '@/shared/ui/flow/prompt-crafter-node-controller';
import { TextInputNodeController } from '@/shared/ui/flow/text-input-node-controller';
import { VisualizeTextNodeController } from '@/shared/ui/flow/visualize-text-node-controller';

const nodeTypes = {
  'generate-text': GenerateTextNodeController,
  'prompt-crafter': PromptCrafterNodeController,
  'text-input': TextInputNodeController,
  'visualize-text': VisualizeTextNodeController,
};

const nodeTypesForPanel = [
  {
    type: 'visualize-text',
    label: 'Visualize Text',
    icon: Eye,
  },
  {
    type: 'text-input',
    label: 'Text Input',
    icon: PenLine,
  },
];

interface FlowEditorProps {
  workflow: WorkflowResponse;
}

function FlowEditorContent({ workflow }: FlowEditorProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect: onConnectWorkflow,
    startExecution, 
    workflowExecutionState,
    initializeWorkflow,
    createNode
  } = useWorkflow();

  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const { screenToFlowPosition } = useReactFlow();

  // Initialize workflow when it changes
  useEffect(() => {
    if (workflow?.definition) {
      // Convert the generic types to the specific types expected by the workflow hook
      const typedNodes = workflow.definition.nodes as FlowNode[];
      const typedEdges = workflow.definition.edges as FlowEdge[];
      initializeWorkflow(typedNodes || [], typedEdges || []);
    }
  }, [workflow, initializeWorkflow]);

  const onConnect = (params: Connection) => {
    onConnectWorkflow(params);
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type) {
      return;
    }

    // Convert screen coordinates to flow coordinates
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    // Create the node using the workflow hook's createNode function
    createNode(type as FlowNode['type'], position);
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleRunWorkflow = () => {
    startExecution();
  };

  const handleSaveWorkflow = () => {
    // In a real app, this would save to the backend
    console.log('Saving workflow...', { nodes, edges });
  };

  const formatLastRun = () => {
    if (!workflowExecutionState.finishedAt) return undefined;
    
    const date = new Date(workflowExecutionState.finishedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  const getWorkflowStatus = () => {
    if (workflowExecutionState.errors.length > 0) return 'error';
    if (workflowExecutionState.finishedAt) return 'success';
    return 'idle';
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Editor Subheader */}
      <EditorSubheader
        workflowName={workflow?.name || 'Untitled Workflow'}
        isRunning={workflowExecutionState.isRunning}
        lastRun={formatLastRun()}
        status={getWorkflowStatus()}
        errorCount={workflowExecutionState.errors.length}
        isPaletteOpen={isPaletteOpen}
        onRun={handleRunWorkflow}
        onSave={handleSaveWorkflow}
        onTogglePalette={() => setIsPaletteOpen(!isPaletteOpen)}
      />

      {/* Main Editor Area */}
      <div className="flex-1 relative">
        {/* Node Palette */}
        <NodePalette 
          isOpen={isPaletteOpen} 
          onClose={() => setIsPaletteOpen(false)} 
        />

        {/* Main Flow Editor */}
        <div className={`h-full transition-all duration-300 ${isPaletteOpen ? 'ml-80' : 'ml-0'}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Legacy Node Panel - keeping for backward compatibility */}
            <Panel position="top-center" className="flex gap-2">
              {nodeTypesForPanel.map((nodeType) => (
                <Button
                  key={nodeType.type}
                  variant="outline"
                  size="sm"
                  className="cursor-grab flex items-center gap-2"
                  draggable
                  onDragStart={(e) => onDragStart(e, nodeType.type)}
                >
                  <nodeType.icon className="h-4 w-4" />
                  {nodeType.label}
                </Button>
              ))}
            </Panel>

            {/* Status Panel */}
            {workflowExecutionState.errors.length > 0 && (
              <Panel position="bottom-left" className="bg-destructive/10 border border-destructive rounded p-3">
                <div className="text-sm font-medium text-destructive mb-2">
                  Workflow Errors ({workflowExecutionState.errors.length})
                </div>
                {workflowExecutionState.errors.slice(0, 3).map((error) => (
                  <div key={error.message} className="text-xs text-destructive/80">
                    {error.message}
                  </div>
                ))}
              </Panel>
            )}
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export function FlowEditor({ workflow }: FlowEditorProps) {
  return (
    <ReactFlowProvider>
      <FlowEditorContent workflow={workflow} />
    </ReactFlowProvider>
  );
}