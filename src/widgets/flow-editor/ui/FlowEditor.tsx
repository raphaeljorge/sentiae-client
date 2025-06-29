import { useEffect, type DragEvent } from 'react';
import {
  ReactFlow,
  addEdge,
  type Connection,
  Background,
  Controls,
  MiniMap,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { Button } from '@/shared/ui/button';
import { Play, Save, Eye, PenLine } from 'lucide-react';
import { useWorkflow } from '@/shared/hooks/use-workflow';
import type { WorkflowResponse } from '@/shared/types/workflow';
import type { FlowNode, FlowEdge } from '@/shared/lib/flow/workflow';

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

export function FlowEditor({ workflow }: FlowEditorProps) {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect: onConnectWorkflow,
    startExecution, 
    workflowExecutionState,
    initializeWorkflow
  } = useWorkflow();

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

    const reactFlowBounds = (event.target as Element)?.closest('.react-flow')?.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');

    if (typeof type === 'undefined' || !type || !reactFlowBounds) {
      return;
    }

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };

    // Use the workflow hook's createNode function instead of creating nodes manually
    const { createNode } = useWorkflow.getState();
    createNode(type as any, position);
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

  return (
    <div className="h-full w-full">
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
        
        {/* Toolbar */}
        <Panel position="top-left" className="flex gap-2">
          <Button 
            onClick={handleRunWorkflow}
            disabled={workflowExecutionState.isRunning}
            size="sm"
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {workflowExecutionState.isRunning ? 'Running...' : 'Run'}
          </Button>
          
          <Button 
            onClick={handleSaveWorkflow}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </Panel>

        {/* Node Panel */}
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
  );
} 