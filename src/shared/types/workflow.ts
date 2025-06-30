export interface WorkflowResponse {
  id: string;
  name: string;
  description: string;
  type: 'chain' | 'routing' | 'parallelization' | 'orchestrator';
  definition: WorkflowDefinition;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDefinition {
  nodes: FlowNode[];
  edges: FlowEdge[];
  viewport?: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
  width?: number;
  height?: number;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  data?: any;
}

export interface WorkflowStatusResponse {
  workflowId: string;
  status: 'idle' | 'running' | 'success' | 'error';
  lastRun: string;
  errorCount: number;
}
