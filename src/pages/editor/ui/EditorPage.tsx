import {
	Controls,
	type EdgeTypes,
	MiniMap,
	type NodeTypes,
	ReactFlowProvider,
} from "@xyflow/react";
import { Background, Panel, ReactFlow, useReactFlow } from "@xyflow/react";
import { type DragEvent, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { Button } from "@/shared/ui/button";
import { useWorkflow } from "@/shared/hooks/flow/use-workflow";
import type { FlowNode } from "@/entities/flow/model/types";
import { GenerateTextNodeController } from "@/features/flow/ui/generate-text-node-controller";
import { PromptCrafterNodeController } from "@/features/flow/ui/prompt-crafter-node-controller";
import { StatusEdgeController } from "@/features/flow/ui/status-edge-controller";
import { TextInputNodeController } from "@/features/flow/ui/text-input-node-controller";
import { VisualizeTextNodeController } from "@/features/flow/ui/visualize-text-node-controller";
import { NodesPanel } from "@/widgets/flow-panel/ui/nodes-panel";
import { ErrorIndicator } from "@/shared/ui/error-indicator";
import { NEWS_SUMMARY_WORKFLOW } from "@/shared/registry/blocks/flow-chain/lib/news-summarization-chain";
import { CONTENT_CREATOR_ROUTING_WORKFLOW } from "@/shared/registry/blocks/flow-routing/lib/content-creator-routing";
import { EXAM_CREATOR_PARALLELIZATION_WORKFLOW } from "@/shared/registry/blocks/flow-parallelization/lib/exam-creator-parallelization";
import { DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW } from "@/shared/registry/blocks/flow-orchestrator/lib/developer-tasks-orchestrator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";


const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNodeController,
	"visualize-text": VisualizeTextNodeController,
	"text-input": TextInputNodeController,
	"prompt-crafter": PromptCrafterNodeController,
};

const edgeTypes: EdgeTypes = {
	status: StatusEdgeController,
};

const workflows = {
  "flow-chain": NEWS_SUMMARY_WORKFLOW,
  "flow-routing": CONTENT_CREATOR_ROUTING_WORKFLOW,
  "flow-parallelization": EXAM_CREATOR_PARALLELIZATION_WORKFLOW,
  "flow-orchestrator": DEVELOPER_TASKS_ORCHESTRATOR_WORKFLOW
};

function Flow({workflowId}: {workflowId: keyof typeof workflows}) {
	const store = useWorkflow(
		(store) => ({
			nodes: store.nodes,
			edges: store.edges,
			onNodesChange: store.onNodesChange,
			onEdgesChange: store.onEdgesChange,
			onConnect: store.onConnect,
			startExecution: store.startExecution,
			createNode: store.createNode,
			workflowExecutionState: store.workflowExecutionState,
			initializeWorkflow: store.initializeWorkflow,
		}),
		shallow,
	);
	
	useEffect(() => {
    const selectedWorkflow = workflows[workflowId];
    if (selectedWorkflow) {
		  store.initializeWorkflow(
			  selectedWorkflow.nodes,
			  selectedWorkflow.edges,
		  );
    }
	}, [workflowId, store.initializeWorkflow]);

	const { screenToFlowPosition } = useReactFlow();

	const onDragOver = (event: DragEvent) => {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move";
	};

	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		const type = event.dataTransfer.getData(
			"application/reactflow",
		) as FlowNode["type"];

		if (!type) {
			return;
		}

		const position = screenToFlowPosition({
			x: event.clientX,
			y: event.clientY,
		});

		store.createNode(type, position);
	};

	const onStartExecution = async () => {
		const result = await store.startExecution();
		if (result.status === "error") {
			console.error(result.error);
		}
	};

	return (
		<ReactFlow
			nodes={store.nodes}
			edges={store.edges}
			onNodesChange={store.onNodesChange}
			onEdgesChange={store.onEdgesChange}
			onConnect={store.onConnect}
			nodeTypes={nodeTypes}
			edgeTypes={edgeTypes}
			onDragOver={onDragOver}
			onDrop={onDrop}
			fitView
		>
			<Background />
			<Controls />
			<MiniMap />
			<NodesPanel />
			<Panel position="top-right" className="flex gap-2 items-center">
				<ErrorIndicator errors={store.workflowExecutionState.errors} />
				<Button
					onClick={onStartExecution}
					title={
						store.workflowExecutionState.timesRun > 0
							? "Run again"
							: "Run the workflow"
					}
					disabled={
						store.workflowExecutionState.errors.length > 0 ||
						store.workflowExecutionState.isRunning
					}
				>
					{store.workflowExecutionState.isRunning ? "Running..." : "Run Flow"}
				</Button>
			</Panel>
		</ReactFlow>
	);
}

export function EditorPage() {
  const [workflowId, setWorkflowId] = useState<keyof typeof workflows>("flow-chain");

	return (
		<div className="w-screen h-screen">
      <Panel position="top-left">
        <div className="p-4 bg-white rounded-lg shadow-lg border">
          <Select value={workflowId} onValueChange={(v) => setWorkflowId(v as keyof typeof workflows)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a workflow demo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flow-chain">Chain Workflow</SelectItem>
              <SelectItem value="flow-routing">Routing Workflow</SelectItem>
              <SelectItem value="flow-parallelization">Parallelization Workflow</SelectItem>
              <SelectItem value="flow-orchestrator">Orchestrator Workflow</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">{workflows[workflowId].description}</p>
        </div>
      </Panel>
			<ReactFlowProvider>
				<Flow workflowId={workflowId} />
			</ReactFlowProvider>
		</div>
	);
}