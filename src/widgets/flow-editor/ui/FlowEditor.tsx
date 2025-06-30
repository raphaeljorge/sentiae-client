import { useEffect, useState, type DragEvent, useMemo } from 'react';
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
  useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/shared/ui/button';
import { Eye, Loader2, PenLine } from 'lucide-react';
import { useWorkflow } from '@/shared/hooks/use-workflow';
import { useNodeTypes } from '@/shared/hooks/use-node-types';
import { useWorkflowStatus } from '@/shared/hooks/use-workflow-status';
import type { WorkflowResponse } from '@/shared/types/workflow';
import type { FlowNode, FlowEdge } from '@/shared/lib/flow/workflow';
import { NodePalette } from './NodePalette';
import { EditorSubheader } from '@/widgets/editor-subheader';

// Import only the generic controller and edge controller
import { GenericNodeController } from '@/shared/ui/flow/generic-node-controller';
import { StatusEdgeController } from '@/shared/ui/flow/status-edge-controller';

const edgeTypes = {
  'status': StatusEdgeController,
};

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
    createNode,
    setNodeTypes
  } = useWorkflow();
  
  // Fetch node types from API
  const { data: apiNodeTypes, isLoading: nodeTypesLoading } = useNodeTypes();
  const { data: workflowStatus } = useWorkflowStatus(
    workflow.id, 
    { enabled: workflowExecutionState.isRunning }
  );

  const nodeTypes = useMemo(() => {
    if (!apiNodeTypes) return {};

    const allNodeTypes = apiNodeTypes.reduce((acc, nodeType) => {
      // Check if a specialized controller exists for this node's componentType
      const controller = GenericNodeController;
      
      acc[nodeType.id] = controller;
      return acc;
    }, {} as Record<string, React.ComponentType<any>>);

    return allNodeTypes;
  }, [apiNodeTypes]);

  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Initialize node types when loaded
  useEffect(() => {
    if (apiNodeTypes && !nodeTypesLoading) {
      setNodeTypes(apiNodeTypes);
    }
  }, [apiNodeTypes, nodeTypesLoading, setNodeTypes]);

  // Initialize workflow when it changes
  useEffect(() => {
    if (workflow?.definition) {
      // Convert the generic types to the specific types expected by the workflow hook
      const typedNodes = workflow.definition.nodes as FlowNode[];
      const typedEdges = workflow.definition.edges as FlowEdge[];
      initializeWorkflow(typedNodes || [], typedEdges || []);
    }
  }, [workflow, initializeWorkflow]);

  // When nodes are loaded or changed, update their internals
  useEffect(() => {
    if (nodes.length > 0) {
      updateNodeInternals(nodes.map(n => n.id));
    }
  }, [nodes, updateNodeInternals]);

  if (nodeTypesLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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

  const handleRunWorkflow = () => {
    console.log('handleRunWorkflow called, starting execution...');
    startExecution();
  };

  const handleSaveWorkflow = () => {
    // In a real app, this would save to the backend
    console.log('Saving workflow...', { nodes, edges });
  };

  const formatLastRun = () => {
    if (!workflowStatus?.lastRun) return undefined;
    
    const date = new Date(workflowStatus.lastRun);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* Editor Subheader */}
      <EditorSubheader
        workflowName={workflow?.name || 'Untitled Workflow'}
        isRunning={workflowStatus?.status === 'running'}
        lastRun={formatLastRun()}
        status={workflowStatus?.status || 'idle'}
        errorCount={workflowStatus?.errorCount || 0}
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
        <div 
          className={`h-full transition-all duration-300 ${isPaletteOpen ? 'ml-80' : 'ml-0'}`}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            height={200}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
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