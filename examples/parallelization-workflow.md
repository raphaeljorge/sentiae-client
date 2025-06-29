<!-- The Parallelization Workflow handles multiple tasks at the same time instead of one by one. At the end, we can optionally aggregate the results with another agent.

In the example below, we show a workflow for creating exams. When someone requests an exam, the input goes to three different agents simultaneously: one creates multiple choice questions, another makes short answer questions, and the third develops essay questions. Their work happens in parallel, and then a final agent combines everything into a complete, well-structured exam.

Perfect for:
Parallel data processing
Multi-perspective analysis
High-speed task processing -->

FILE: app/workflow/page.tsx

"use client";

import {
	Controls,
	type EdgeTypes,
	MiniMap,
	type NodeTypes,
	ReactFlowProvider,
} from "@xyflow/react";
import { Background, Panel, ReactFlow, useReactFlow } from "@xyflow/react";
import { type DragEvent, useEffect } from "react";
import { shallow } from "zustand/shallow";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { ErrorIndicator } from "@/components/error-indicator";
import { NodesPanel } from "@/components/nodes-panel";
import { EXAM_CREATOR_PARALLELIZATION_WORKFLOW } from "@/lib/exam-creator-parallelization";
import { useWorkflow } from "@/hooks/flow/use-workflow";
import type { FlowNode } from "@/lib/flow/workflow";
import { GenerateTextNodeController } from "@/components/flow/generate-text-node-controller";
import { PromptCrafterNodeController } from "@/components/flow/prompt-crafter-node-controller";
import { StatusEdgeController } from "@/components/flow/status-edge-controller";
import { TextInputNodeController } from "@/components/flow/text-input-node-controller";
import { VisualizeTextNodeController } from "@/components/flow/visualize-text-node-controller";

const nodeTypes: NodeTypes = {
	"generate-text": GenerateTextNodeController,
	"visualize-text": VisualizeTextNodeController,
	"text-input": TextInputNodeController,
	"prompt-crafter": PromptCrafterNodeController,
};

const edgeTypes: EdgeTypes = {
	status: StatusEdgeController,
};

export function Flow() {
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
	
	// biome-ignore lint/correctness/useExhaustiveDependencies: We want to initialize the workflow only once
	useEffect(() => {
		store.initializeWorkflow(
			EXAM_CREATOR_PARALLELIZATION_WORKFLOW.nodes,
			EXAM_CREATOR_PARALLELIZATION_WORKFLOW.edges,
		);
	}, []);

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
						store.workflowExecutionState.timesRun > 1
							? "Disabled for now"
							: "Run the workflow"
					}
					disabled={
						store.workflowExecutionState.errors.length > 0 ||
						store.workflowExecutionState.isRunning ||
						store.workflowExecutionState.timesRun > 1
					}
				>
					{store.workflowExecutionState.isRunning ? "Running..." : "Run Flow"}
				</Button>
			</Panel>
		</ReactFlow>
	);
}

export default function Page() {
	return (
		<div className="w-screen h-screen">
			<ReactFlowProvider>
				<Flow />
			</ReactFlowProvider>
		</div>
	);
}

FILE: app/api/workflow/execute/route.ts

import { serverNodeProcessors } from "@/lib/flow/server-node-processors";
import { executeServerWorkflow } from "@/lib/flow/sse-workflow-execution-engine";
import type { WorkflowDefinition } from "@/lib/flow/workflow";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
	try {
		const { workflow } = await req.json();

		if (!workflow) {
			return NextResponse.json(
				{ error: "No workflow data provided" },
				{ status: 400 },
			);
		}

		const workflowDefinition: WorkflowDefinition = workflow;

		// Create a stream for SSE
		const stream = new ReadableStream({
			async start(controller) {
				await executeServerWorkflow(
					workflowDefinition,
					serverNodeProcessors,
					controller,
				);
			},
		});

		return new Response(stream, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Unknown error" },
			{ status: 500 },
		);
	}
}

FILE: components/flow/nodes-panel.tsx

import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Eye, PenLine } from "lucide-react";
import type React from "react";

const nodeTypes = [
	{
		type: "visualize-text",
		label: "Visualize Text",
		icon: Eye,
	},
	{
		type: "text-input",
		label: "Text Input",
		icon: PenLine,
	},
];

export function NodesPanel() {
	const onDragStart = (event: React.DragEvent, nodeType: string) => {
		event.dataTransfer.setData("application/reactflow", nodeType);
		event.dataTransfer.effectAllowed = "move";
	};

	return (
		<Panel position="top-center" className="flex gap-2">
			{nodeTypes.map((nodeType) => (
				<Button
					key={nodeType.type}
					variant="outline"
					className="cursor-grab"
					draggable
					onDragStart={(e) => onDragStart(e, nodeType.type)}
				>
					<nodeType.icon className="mr-2 h-4 w-4" />
					{nodeType.label}
				</Button>
			))}
		</Panel>
	);
}

FILE: components/flow/status-edge-controller.tsx

"use client";

import type { EdgeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { StatusEdge } from "@/components/flow/status-edge";
import type { EdgeProps } from "@xyflow/react";

export type StatusEdgeController = Omit<StatusEdge, "data"> & {
	type: "status";
	data: {
		executionState?: EdgeExecutionState;
	};
};

export function StatusEdgeController({
	data,
	...props
}: EdgeProps<StatusEdgeController>) {
	return (
		<StatusEdge
			{...props}
			data={{
				error: !!data.executionState?.error,
			}}
		/>
	);
}

FILE: components/flow/visualize-text-node-controller.tsx

"use client";

import { useWorkflow } from "@/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { VisualizeTextNode } from "@/components/flow/visualize-text-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";

export type VisualizeTextNodeController = Omit<VisualizeTextNode, "data"> & {
	type: "visualize-text";
	data: {
		executionState?: NodeExecutionState;
	};
};

export function VisualizeTextNodeController({
	id,
	data,
	...props
}: NodeProps<VisualizeTextNodeController>) {
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<VisualizeTextNode
			id={id}
			data={{
				input: data.executionState?.targets?.input,
				status: data.executionState?.status,
			}}
			onDeleteNode={handleDeleteNode}
			{...props}
		/>
	);
}

FILE: components/flow/text-input-node-controller.tsx

"use client";

import { useWorkflow } from "@/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { TextInputNode } from "@/components/flow/text-input-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";

export type TextInputNodeController = Omit<TextInputNode, "data"> & {
	type: "text-input";
	data: Omit<TextInputNode["data"], "status"> & {
		executionState?: NodeExecutionState;
	};
};

export function TextInputNodeController({
	id,
	data,
	...props
}: NodeProps<TextInputNodeController>) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handleTextChange = useCallback(
		(value: string) => {
			updateNode(id, "text-input", { config: { value } });
		},
		[id, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<TextInputNode
			id={id}
			data={{
				status: data.executionState?.status,
				config: data.config,
			}}
			{...props}
			onTextChange={handleTextChange}
			onDeleteNode={handleDeleteNode}
		/>
	);
}

FILE: components/flow/prompt-crafter-node-controller.tsx

"use client";

import { useWorkflow } from "@/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { PromptCrafterNode } from "@/components/flow/prompt-crafter-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

export type PromptCrafterNodeController = Omit<PromptCrafterNode, "data"> & {
	type: "prompt-crafter";
	data: Omit<PromptCrafterNode["data"], "status"> & {
		executionState?: NodeExecutionState;
	};
};

export function PromptCrafterNodeController({
	id,
	data,
	...props
}: NodeProps<PromptCrafterNodeController>) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const addDynamicHandle = useWorkflow((state) => state.addDynamicHandle);
	const removeDynamicHandle = useWorkflow((state) => state.removeDynamicHandle);
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handlePromptTextChange = useCallback(
		(value: string) => {
			updateNode(id, "prompt-crafter", { config: { template: value } });
		},
		[id, updateNode],
	);

	const handleCreateInput = useCallback(
		(name: string) => {
			if (!name) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === name,
			);
			if (existingInput) {
				toast.error("Input name already exists");
				return false;
			}

			addDynamicHandle(id, "prompt-crafter", "template-tags", {
				name,
			});
			return true;
		},
		[id, data.dynamicHandles, addDynamicHandle],
	);

	const handleRemoveInput = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "prompt-crafter", "template-tags", handleId);
		},
		[id, removeDynamicHandle],
	);

	const handleUpdateInputName = useCallback(
		(handleId: string, newLabel: string): boolean => {
			if (!newLabel) {
				toast.error("Input name cannot be empty");
				return false;
			}

			const existingInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.name === newLabel,
			);
			if (existingInput && existingInput.id !== handleId) {
				toast.error("Input name already exists");
				return false;
			}

			const oldInput = data.dynamicHandles["template-tags"]?.find(
				(input) => input.id === handleId,
			);
			if (!oldInput) {
				return false;
			}

			updateNode(id, "prompt-crafter", {
				config: {
					...data.config,
					template: (data.config.template || "").replace(
						new RegExp(`{{${oldInput.name}}}`, "g"),
						`{{${newLabel}}}`,
					),
				},
				dynamicHandles: {
					...data.dynamicHandles,
					"template-tags": (data.dynamicHandles["template-tags"] || []).map(
						(input) =>
							input.id === handleId ? { ...input, name: newLabel } : input,
					),
				},
			});
			return true;
		},
		[id, data.dynamicHandles, data.config, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<PromptCrafterNode
			id={id}
			data={{ ...data, status: data.executionState?.status }}
			{...props}
			onPromptTextChange={handlePromptTextChange}
			onCreateInput={handleCreateInput}
			onRemoveInput={handleRemoveInput}
			onUpdateInputName={handleUpdateInputName}
			onDeleteNode={handleDeleteNode}
		/>
	);
}

FILE: components/flow/generate-text-node-controller.tsx

"use client";

import { useWorkflow } from "@/hooks/flow/use-workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";
import { GenerateTextNode } from "@/components/flow/generate-text-node";
import type { Model } from "@/components/ui/model-selector";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";

export type GenerateTextNodeController = Omit<GenerateTextNode, "data"> & {
	type: "generate-text";
	data: Omit<GenerateTextNode["data"], "status"> & {
		executionState?: NodeExecutionState;
	};
};

export function GenerateTextNodeController({
	id,
	data,
	...props
}: NodeProps<GenerateTextNodeController>) {
	const updateNode = useWorkflow((state) => state.updateNode);
	const addDynamicHandle = useWorkflow((state) => state.addDynamicHandle);
	const removeDynamicHandle = useWorkflow((state) => state.removeDynamicHandle);
	const deleteNode = useWorkflow((state) => state.deleteNode);

	const handleModelChange = useCallback(
		(model: Model) => {
			updateNode(id, "generate-text", {
				config: {
					...data.config,
					model,
				},
			});
		},
		[id, data.config, updateNode],
	);

	const handleCreateTool = useCallback(
		(name: string, description?: string) => {
			if (!name) {
				toast.error("Tool name cannot be empty");
				return false;
			}

			const existingTool = data.dynamicHandles.tools.find(
				(tool) => tool.name === name,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}
			addDynamicHandle(id, "generate-text", "tools", {
				name,
				description,
			});
			return true;
		},
		[id, data.dynamicHandles.tools, addDynamicHandle],
	);

	const handleRemoveTool = useCallback(
		(handleId: string) => {
			removeDynamicHandle(id, "generate-text", "tools", handleId);
		},
		[id, removeDynamicHandle],
	);

	const handleUpdateTool = useCallback(
		(toolId: string, newName: string, newDescription?: string) => {
			if (!newName) {
				toast.error("Tool name cannot be empty");
				return false;
			}

			const existingTool = data.dynamicHandles.tools.find(
				(tool) => tool.name === newName && tool.id !== toolId,
			);
			if (existingTool) {
				toast.error("Tool name already exists");
				return false;
			}

			updateNode(id, "generate-text", {
				dynamicHandles: {
					...data.dynamicHandles,
					tools: data.dynamicHandles.tools.map((tool) =>
						tool.id === toolId
							? { ...tool, name: newName, description: newDescription }
							: tool,
					),
				},
			});
			return true;
		},
		[id, data.dynamicHandles, updateNode],
	);

	const handleDeleteNode = useCallback(() => {
		deleteNode(id);
	}, [id, deleteNode]);

	return (
		<GenerateTextNode
			id={id}
			data={{
				status: data.executionState?.status,
				config: data.config,
				dynamicHandles: data.dynamicHandles,
			}}
			{...props}
			disableModelSelector
			onModelChange={handleModelChange}
			onCreateTool={handleCreateTool}
			onRemoveTool={handleRemoveTool}
			onUpdateTool={handleUpdateTool}
			onDeleteNode={handleDeleteNode}
		/>
	);
}

FILE: lib/exam-creator-parallelization.ts

import type { FlowEdge, FlowNode } from "@/lib/flow/workflow";

export const EXAM_CREATOR_PARALLELIZATION_WORKFLOW: {
	nodes: FlowNode[];
	edges: FlowEdge[];
} = {
	nodes: [
		{
			type: "generate-text",
			id: "validateLLM",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 251.46219588875414,
				y: -157.42640737415334,
			},
		},
		{
			type: "generate-text",
			id: "Nr22stf-aM3K9KZ7fHREZ",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 245.3399584365339,
				y: 489.49722280589094,
			},
		},
		{
			type: "visualize-text",
			id: "eYRTRKwrUcn_fmuMKuUEl",
			data: {},
			position: {
				x: 648.6394983132599,
				y: -252.7402610767247,
			},
			width: 379,
			height: 300,
		},
		{
			type: "generate-text",
			id: "ZnL2SgGAMwaZSLNH-bOX3",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 241.32228205169054,
				y: 158.08000713832058,
			},
		},
		{
			type: "generate-text",
			id: "lu-X2l3QTJj8RBk4fDwGL",
			data: {
				config: {
					model: "llama-3.1-8b-instant",
				},
				dynamicHandles: {
					tools: [],
				},
			},
			position: {
				x: 1687.7585469555088,
				y: 418.93136565541863,
			},
		},
		{
			type: "text-input",
			id: "_4RcYkPOEDKn-hmGOAvy9",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are an expert in combining and organizing educational content.  \n    Your task is to combine the outputs from three different agents to create a cohesive exam paper.  \n\n    You will receive:  \n    - A set of multiple-choice questions.  \n    - A set of open-answer questions.  \n    - A set of essay prompts.  \n\n    Your task is to:  \n    - Compile these into a single, well-structured exam paper.  \n    - Organize the paper with the following structure:  \n      1. Multiple-choice questions.  \n      2. Short-answer questions.  \n      3. Essay prompts.  \n    - Ensure the content flows logically, using clear section headers.  \n\n    Output should:  \n    - Be formatted for readability.  \n    - Include proper numbering for each question.  \n</assistant_info>\n",
				},
			},
			position: {
				x: 1250.9578657920588,
				y: -224.79053213173495,
			},
			width: 350,
			height: 417,
		},
		{
			type: "visualize-text",
			id: "kaTYJV52ljshMg0uClQl1",
			data: {},
			position: {
				x: 649.7252565724999,
				y: 107.18165405549195,
			},
			width: 377,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "s5NSuCUuEByh_BTCSSMDU",
			data: {},
			position: {
				x: 646.3721167044031,
				y: 456.0475192259633,
			},
			width: 377,
			height: 300,
		},
		{
			type: "visualize-text",
			id: "9cLCaECGGL5t21iQ3TDc9",
			data: {},
			position: {
				x: 1695.1459958597898,
				y: -234.91904513607875,
			},
			width: 518,
			height: 614,
		},
		{
			type: "text-input",
			id: "VGFbBVUjlwdQ2cGhrCv72",
			data: {
				config: {
					value: "I want to create a exam on React Flow programming",
				},
			},
			position: {
				x: -722.022355638326,
				y: 62.42404642145064,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "FpL4edqHCqaXqhGrD2xEJ",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are an expert in creating multiple-choice questions for educational purposes. \n    Your task is to create multiple-choice questions on the given topic. Each question should:\n    - Be clear and concise.\n    - Include a single correct answer and three plausible distractors (incorrect answers).\n    - Test the student's understanding of key concepts from the topic.\n\n    The output should:\n    - Contain the question, four answer options, and the correct answer.\n    - Ensure distractors are not obviously incorrect but based on common misconceptions or related ideas.\n   - ALWAYS Only output 2 questions\n</assistant_info>\n<examples>\n    Example 1:  \n    Question: What is the primary cause of climate change?  \n    Options:  \n    A. Solar flares  \n    B. Volcanic eruptions  \n    C. Greenhouse gas emissions  \n    D. Changes in Earth's orbit  \n    Correct Answer: C  \n\n    Example 2:  \n    Question: Which of the following gases is considered a greenhouse gas?  \n    Options:  \n    A. Oxygen  \n    B. Nitrogen  \n    C. Carbon dioxide  \n    D. Argon  \n    Correct Answer: C  \n</examples>\n\n",
				},
			},
			position: {
				x: -157.73052506593396,
				y: -200.36676668546224,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "mcXEqjj4TY8HBof7E6pdl",
			data: {
				config: {
					value:
						"<assistant_info>\n    You are an expert in creating short-answer questions for educational purposes.  \n    Your task is to create short-answer questions that:  \n    - Require students to demonstrate understanding of the topic in 1-3 sentences.  \n    - Are open-ended but specific enough to test key concepts.  \n\n    The output should:  \n    - Include the question as a standalone sentence or prompt.  \n    - Provide a sample ideal answer for reference.  \n  - ALWAYS Only output 2 questions\n</assistant_info>\n<example>\n    Example 1:  \n    Question: Explain how greenhouse gases contribute to global warming.  \n    Sample Answer: Greenhouse gases trap heat in the Earth's atmosphere, preventing it from escaping into space. This leads to an increase in global temperatures over time.  \n\n    Example 2:  \n    Question: What is the significance of the Paris Agreement in addressing climate change?  \n    Sample Answer: The Paris Agreement is a global treaty that aims to limit global warming to below 2 degrees Celsius compared to pre-industrial levels by reducing greenhouse gas emissions.  \n</example>\n",
				},
			},
			position: {
				x: -159.63323331453773,
				y: 122.18288195856604,
			},
			width: 350,
			height: 300,
		},
		{
			type: "text-input",
			id: "eVfOwR2k_3HG4sBFeFZcg",
			data: {
				config: {
					value:
						"<assistant_info>\n   You are an expert in creating essay prompts for educational purposes.  \n    Your task is to create essay prompts that:  \n    - Encourage critical thinking and analysis of the topic.  \n    - Allow students to explore different perspectives or arguments.  \n    - Require detailed explanations or evidence-based reasoning.  \n\n    The output should:  \n    - Include a clearly worded essay question or statement.  \n    - Optionally provide guidance on how to approach the essay.  \n  - ALWAYS Only output 1 essay prompt\n</assistant_info>\n<example>\n    Example 1:  \n    Prompt: Discuss the social, economic, and environmental impacts of climate change. How can governments and individuals work together to address these challenges?  \n    Guidance: In your essay, provide examples of specific impacts, such as rising sea levels or economic costs. Discuss at least one solution involving government policies and one involving individual actions.  \n\n    Example 2:  \n    Prompt: Analyze the role of renewable energy in mitigating climate change. What are the challenges and benefits of transitioning to renewable energy sources?  \n    Guidance: Consider different types of renewable energy, such as solar and wind, and evaluate their feasibility in various regions. Address both technological and economic factors.  \n</example>\n\n",
				},
			},
			position: {
				x: -160.93480457629244,
				y: 461.9358073446226,
			},
			width: 350,
			height: 300,
		},
		{
			type: "prompt-crafter",
			id: "7-uZXwIU-n7fEMCoLZsMt",
			data: {
				config: {
					template:
						"<multiple-choice-content>\n  {{multiple-choice-content}}\n</multiple-choice-content>\n  {{open-answer-questions-content}}\n<open-questions-content>\n</open-questions-content>\n<essay-content>\n  {{essay-content}}\n</essay-content>",
				},
				dynamicHandles: {
					"template-tags": [
						{
							name: "multiple-choice-content",
							id: "GDFxwCjnyoesYWdUKZtGq",
						},
						{
							name: "open-answer-questions-content",
							id: "llV7g536-dmly98vvpFak",
						},
						{
							name: "essay-content",
							id: "Zla3PfCwXBMnW32gB_MiF",
						},
					],
				},
			},
			position: {
				x: 1251.6723866635305,
				y: 232.25256033640713,
			},
		},
	],
	edges: [
		{
			source: "_4RcYkPOEDKn-hmGOAvy9",
			sourceHandle: "result",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "system",
			type: "status",
			id: "xy-edge___4RcYkPOEDKn-hmGOAvy9result-lu-X2l3QTJj8RBk4fDwGLsystem",
			data: {},
		},
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "kaTYJV52ljshMg0uClQl1",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-kaTYJV52ljshMg0uClQl1input",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "s5NSuCUuEByh_BTCSSMDU",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-s5NSuCUuEByh_BTCSSMDUinput",
			data: {},
		},
		{
			source: "lu-X2l3QTJj8RBk4fDwGL",
			sourceHandle: "result",
			target: "9cLCaECGGL5t21iQ3TDc9",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__lu-X2l3QTJj8RBk4fDwGLresult-9cLCaECGGL5t21iQ3TDc9input",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-validateLLMprompt",
			data: {},
			selected: false,
		},
		{
			source: "mcXEqjj4TY8HBof7E6pdl",
			sourceHandle: "result",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__mcXEqjj4TY8HBof7E6pdlresult-ZnL2SgGAMwaZSLNH-bOX3system",
			data: {},
		},
		{
			source: "FpL4edqHCqaXqhGrD2xEJ",
			sourceHandle: "result",
			target: "validateLLM",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__FpL4edqHCqaXqhGrD2xEJresult-validateLLMsystem",
			data: {},
		},
		{
			source: "eVfOwR2k_3HG4sBFeFZcg",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "system",
			type: "status",
			id: "xy-edge__eVfOwR2k_3HG4sBFeFZcgresult-Nr22stf-aM3K9KZ7fHREZsystem",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "result",
			target: "eYRTRKwrUcn_fmuMKuUEl",
			targetHandle: "input",
			type: "status",
			id: "xy-edge__validateLLMresult-eYRTRKwrUcn_fmuMKuUElinput",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "ZnL2SgGAMwaZSLNH-bOX3",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-ZnL2SgGAMwaZSLNH-bOX3prompt",
			data: {},
		},
		{
			source: "VGFbBVUjlwdQ2cGhrCv72",
			sourceHandle: "result",
			target: "Nr22stf-aM3K9KZ7fHREZ",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__VGFbBVUjlwdQ2cGhrCv72result-Nr22stf-aM3K9KZ7fHREZprompt",
			data: {},
		},
		{
			source: "validateLLM",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "GDFxwCjnyoesYWdUKZtGq",
			type: "status",
			id: "xy-edge__validateLLMresult-7-uZXwIU-n7fEMCoLZsMtGDFxwCjnyoesYWdUKZtGq",
			data: {},
		},
		{
			source: "ZnL2SgGAMwaZSLNH-bOX3",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "llV7g536-dmly98vvpFak",
			type: "status",
			id: "xy-edge__ZnL2SgGAMwaZSLNH-bOX3result-7-uZXwIU-n7fEMCoLZsMtllV7g536-dmly98vvpFak",
			data: {},
		},
		{
			source: "Nr22stf-aM3K9KZ7fHREZ",
			sourceHandle: "result",
			target: "7-uZXwIU-n7fEMCoLZsMt",
			targetHandle: "Zla3PfCwXBMnW32gB_MiF",
			type: "status",
			id: "xy-edge__Nr22stf-aM3K9KZ7fHREZresult-7-uZXwIU-n7fEMCoLZsMtZla3PfCwXBMnW32gB_MiF",
			data: {},
		},
		{
			source: "7-uZXwIU-n7fEMCoLZsMt",
			sourceHandle: "result",
			target: "lu-X2l3QTJj8RBk4fDwGL",
			targetHandle: "prompt",
			type: "status",
			id: "xy-edge__7-uZXwIU-n7fEMCoLZsMtresult-lu-X2l3QTJj8RBk4fDwGLprompt",
			data: {},
		},
	],
};

FILE: import type { GenerateTextNodeController } from "@/components/flow/generate-text-node-controller";
import type { PromptCrafterNodeController } from "@/components/flow/prompt-crafter-node-controller";
import type { StatusEdgeController } from "@/components/flow/status-edge-controller";
import type { TextInputNodeController } from "@/components/flow/text-input-node-controller";
import type { VisualizeTextNodeController } from "@/components/flow/visualize-text-node-controller";
import { nanoid } from "nanoid";

type Dependency = {
	node: string;
	sourceHandle: string;
};

type Dependencies = Record<string, Dependency[]>;

type Dependent = {
	node: string;
	targetHandle: string;
};

type Dependents = Record<string, Dependent[]>;

export type DependencyGraph = {
	dependencies: Map<string, { node: string; sourceHandle: string }[]>;
	dependents: Map<string, { node: string; targetHandle: string }[]>;
};

export type ConnectionMap = Map<string, FlowEdge[]>;

// Error types

type EdgeErrorInfo = {
	id: string;
	source: string;
	target: string;
	sourceHandle: string;
	targetHandle: string;
};

export type MultipleSourcesError = {
	message: string;
	type: "multiple-sources-for-target-handle";
	edges: EdgeErrorInfo[];
};

export type CycleError = {
	message: string;
	type: "cycle";
	edges: EdgeErrorInfo[];
};

type NodeErrorInfo = {
	id: string;
	handleId: string;
};

export type MissingConnectionError = {
	message: string;
	type: "missing-required-connection";
	node: NodeErrorInfo;
};

export type WorkflowError =
	| MultipleSourcesError
	| CycleError
	| MissingConnectionError;

export interface WorkflowDefinition {
	id: string;
	nodes: FlowNode[];
	edges: FlowEdge[];
	executionOrder: string[];
	dependencies: Dependencies;
	dependents: Dependents;
	errors: WorkflowError[];
}

// Dynamic Handles

export type DynamicHandle = {
	id: string;
	name: string;
	description?: string;
};

// Node Configuration

const NODES_CONFIG: Partial<
	Record<
		FlowNode["type"],
		{
			requiredTargets: string[];
		}
	>
> = {
	"generate-text": {
		requiredTargets: ["prompt"],
	},
};

// Nodes

export type FlowNode =
	| VisualizeTextNodeController
	| TextInputNodeController
	| PromptCrafterNodeController
	| GenerateTextNodeController;

// Edges

export type FlowEdge = StatusEdgeController;

// Type Guards

export function isNodeOfType<T extends FlowNode["type"]>(
	node: FlowNode,
	type: T,
): node is Extract<FlowNode, { type: T }> {
	return node.type === type;
}

export function isNodeWithDynamicHandles<T extends FlowNode>(
	node: T,
): node is Extract<
	T,
	{
		data: {
			dynamicHandles: {
				[key in string]: DynamicHandle[];
			};
		};
	}
> {
	return "dynamicHandles" in node.data;
}

function buildDependencyGraph(edges: FlowEdge[]): {
	dependencies: DependencyGraph["dependencies"];
	dependents: DependencyGraph["dependents"];
	connectionMap: ConnectionMap;
} {
	const dependencies = new Map<
		string,
		{ node: string; sourceHandle: string }[]
	>();
	const dependents = new Map<
		string,
		{ node: string; targetHandle: string }[]
	>();
	const connectionMap = new Map<string, FlowEdge[]>();

	for (const edge of edges) {
		// Track connections per target handle
		const targetKey = `${edge.target}-${edge.targetHandle}`;
		const existingConnections = connectionMap.get(targetKey) || [];
		connectionMap.set(targetKey, [...existingConnections, edge]);

		// Build dependency graph
		const existingDependencies = dependencies.get(edge.target) || [];
		dependencies.set(edge.target, [
			...existingDependencies,
			{
				node: edge.source,
				sourceHandle: edge.sourceHandle,
			},
		]);

		const existingDependents = dependents.get(edge.source) || [];
		dependents.set(edge.source, [
			...existingDependents,
			{
				node: edge.target,
				targetHandle: edge.targetHandle,
			},
		]);
	}

	return { dependencies, dependents, connectionMap };
}

function topologicalSort(
	nodes: FlowNode[],
	dependencies: DependencyGraph["dependencies"],
	dependents: DependencyGraph["dependents"],
): string[] {
	const indegree = new Map<string, number>();
	const queue: string[] = [];
	const executionOrder: string[] = [];

	// Initialize in-degree
	for (const node of nodes) {
		const degree = dependencies.get(node.id)?.length || 0;
		indegree.set(node.id, degree);
		if (degree === 0) {
			queue.push(node.id);
		}
	}

	// Process nodes
	while (queue.length > 0) {
		const currentNode = queue.shift();
		if (!currentNode) {
			continue;
		}

		executionOrder.push(currentNode);

		const nodesDependentOnCurrent = dependents.get(currentNode) || [];
		for (const dependent of nodesDependentOnCurrent) {
			const currentDegree = indegree.get(dependent.node);
			if (typeof currentDegree === "number") {
				const newDegree = currentDegree - 1;
				indegree.set(dependent.node, newDegree);
				if (newDegree === 0) {
					queue.push(dependent.node);
				}
			}
		}
	}

	return executionOrder;
}

function validateMultipleSources(
	connectionMap: ConnectionMap,
): MultipleSourcesError[] {
	const errors: MultipleSourcesError[] = [];

	connectionMap.forEach((edges, targetKey) => {
		if (edges.length > 1) {
			const [targetNode, targetHandle] = targetKey.split("-");
			errors.push({
				type: "multiple-sources-for-target-handle",
				message: `Target handle "${targetHandle}" on node "${targetNode}" has ${edges.length} sources.`,
				edges: edges.map((edge) => ({
					id: edge.id,
					source: edge.source,
					target: edge.target,
					sourceHandle: edge.sourceHandle,
					targetHandle: edge.targetHandle,
				})),
			});
		}
	});

	return errors;
}

function detectCycles(
	nodes: FlowNode[],
	dependencies: DependencyGraph["dependencies"],
	dependents: DependencyGraph["dependents"],
	edges: FlowEdge[],
): CycleError[] {
	const executionOrder = topologicalSort(nodes, dependencies, dependents);
	if (executionOrder.length === nodes.length) {
		return [];
	}

	// Find cycle participants
	const indegree = new Map<string, number>();
	const queue: string[] = [];

	for (const node of nodes) {
		const degree = dependencies.get(node.id)?.length || 0;
		indegree.set(node.id, degree);
		if (degree === 0) {
			queue.push(node.id);
		}
	}

	// Kahn's algorithm to find remaining nodes
	while (queue.length > 0) {
		const currentNode = queue.shift();
		if (!currentNode) {
			continue;
		}

		const nodesDependentOnCurrent = dependents.get(currentNode) || [];
		for (const dependent of nodesDependentOnCurrent) {
			const currentDegree = indegree.get(dependent.node);
			if (typeof currentDegree === "number") {
				const newDegree = currentDegree - 1;
				indegree.set(dependent.node, newDegree);
				if (newDegree === 0) {
					queue.push(dependent.node);
				}
			}
		}
	}

	// Identify cycle nodes and edges
	const cycleNodes = Array.from(indegree.entries())
		.filter(([_, degree]) => degree > 0)
		.map(([nodeId]) => nodeId);

	const cycleEdges = edges.filter(
		(edge) =>
			cycleNodes.includes(edge.source) && cycleNodes.includes(edge.target),
	);

	if (cycleEdges.length === 0) {
		return [];
	}

	const error: CycleError = {
		type: "cycle",
		message: `Workflow contains cycles between nodes: ${cycleNodes.join(", ")}`,
		edges: cycleEdges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			sourceHandle: edge.sourceHandle,
			targetHandle: edge.targetHandle,
		})),
	};

	return [error];
}

function validateRequiredHandles(
	nodes: FlowNode[],
	edges: FlowEdge[],
): MissingConnectionError[] {
	const errors: MissingConnectionError[] = [];
	const connectionsByTarget = new Map<string, FlowEdge[]>();
	const connectionsBySource = new Map<string, FlowEdge[]>();

	// Build connection maps
	for (const edge of edges) {
		const targetKey = `${edge.target}-${edge.targetHandle}`;
		const sourceKey = `${edge.source}-${edge.sourceHandle}`;

		const targetConnections = connectionsByTarget.get(targetKey) || [];
		connectionsByTarget.set(targetKey, [...targetConnections, edge]);

		const sourceConnections = connectionsBySource.get(sourceKey) || [];
		connectionsBySource.set(sourceKey, [...sourceConnections, edge]);
	}

	// Check each node against its type configuration
	for (const node of nodes) {
		const config = NODES_CONFIG[node.type];

		if (!config) {
			continue;
		}

		// Check required target handles
		if (config.requiredTargets) {
			for (const targetHandle of config.requiredTargets) {
				const key = `${node.id}-${targetHandle}`;
				const connections = connectionsByTarget.get(key);

				if (!connections || connections.length === 0) {
					errors.push({
						type: "missing-required-connection",
						message: `Node "${node.id}" requires a connection to its "${targetHandle}" input.`,
						node: {
							id: node.id,
							handleId: targetHandle,
						},
					});
				}
			}
		}
	}

	return errors;
}

export function prepareWorkflow(
	nodes: FlowNode[],
	edges: FlowEdge[],
): WorkflowDefinition {
	const errors: WorkflowError[] = [];

	// First pass: Build dependency graph and check connection validity
	const { dependencies, dependents, connectionMap } =
		buildDependencyGraph(edges);

	/* console.log("dependencies", dependencies);
	console.log("dependents", dependents);
	console.log("connectionMap", connectionMap);
 */
	// Second pass: Validate multiple sources for single target handle
	errors.push(...validateMultipleSources(connectionMap));

	// Third pass: Detect cycles
	const cycleErrors = detectCycles(nodes, dependencies, dependents, edges);
	errors.push(...cycleErrors);

	// Fourth pass: Validate required handles
	errors.push(...validateRequiredHandles(nodes, edges));

	// Get execution order if no cycles were detected
	const executionOrder =
		cycleErrors.length === 0
			? topologicalSort(nodes, dependencies, dependents)
			: [];

	return {
		id: nanoid(),
		nodes,
		edges,
		executionOrder,
		dependencies: Object.fromEntries(dependencies),
		dependents: Object.fromEntries(dependents),
		errors,
	};
}

import type { FlowNode } from "@/lib/flow/workflow";
import type {
	CycleError,
	MissingConnectionError,
	MultipleSourcesError,
	WorkflowDefinition,
} from "@/lib/flow/workflow";

// Processing

export type ProcessingNodeError = {
	message: string;
	type: "processing-node";
};

export type ProcessedData = Record<string, string> | undefined;

export type NodeProcessor = (
	node: FlowNode,
	targetsData: ProcessedData,
) => Promise<ProcessedData>;

// Node Execution State

export type NodeExecutionStatus = "success" | "error" | "processing" | "idle";

export type NodeExecutionState = {
	timestamp: string;
	targets?: Record<string, string>;
	sources?: Record<string, string>;
	status: NodeExecutionStatus;
	error?: MissingConnectionError | ProcessingNodeError;
};

// Edge Execution State

export type EdgeExecutionState = {
	error?: MultipleSourcesError | CycleError;
};

// Excution Engine

interface ExecutionContext {
	workflow: WorkflowDefinition;
	processNode: (
		nodeId: string,
		targetsData: ProcessedData,
	) => Promise<ProcessedData>;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState>,
	) => void;
}

export const createWorkflowExecutionEngine = (context: ExecutionContext) => {
	const completedNodes = new Set<string>();
	const failedNodes = new Set<string>();
	const processingNodes = new Set<string>();

	const getNodeTargetsData = (
		workflow: WorkflowDefinition,
		nodeId: string,
	): ProcessedData => {
		const node = workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return undefined;
		}

		const edgesConnectedToNode = workflow.edges.filter(
			(edge) => edge.target === nodeId,
		);

		const targetsData: ProcessedData = {};
		for (const edge of edgesConnectedToNode) {
			const sourceNode = workflow.nodes.find((n) => n.id === edge.source);
			if (!sourceNode?.data.executionState?.sources) {
				continue;
			}

			const sourceNodeResult =
				sourceNode.data.executionState.sources[edge.sourceHandle];
			targetsData[edge.targetHandle] = sourceNodeResult;
		}

		return targetsData;
	};

	const checkBranchNodeStatus = (nodeId: string): NodeExecutionStatus => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "idle";
		}

		// If this node is processing, the whole branch is processing
		if (processingNodes.has(nodeId)) {
			return "processing";
		}

		// If this node has failed, the branch has failed
		if (failedNodes.has(nodeId)) {
			return "error";
		}

		// Get all nodes that this node depends on
		const dependencies = context.workflow.dependencies[nodeId] || [];

		// If this node has no dependencies, check its own status
		if (dependencies.length === 0) {
			if (completedNodes.has(nodeId) && node.data.executionState?.sources) {
				return "success";
			}
			return "idle";
		}

		// Check status of all dependencies recursively
		for (const dep of dependencies) {
			const depStatus = checkBranchNodeStatus(dep.node);
			// If any dependency is processing or has error, propagate that status
			if (depStatus === "processing" || depStatus === "error") {
				return depStatus;
			}
		}

		// If we got here and the node is complete with data, the branch is successful
		if (completedNodes.has(nodeId) && node.data.executionState?.sources) {
			return "success";
		}

		return "idle";
	};

	const getBranchStatus = (
		nodeId: string,
		handleId: string,
	): NodeExecutionStatus => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return "idle";
		}

		// Get all edges that connect to this handle
		const incomingEdges = context.workflow.edges.filter(
			(edge) => edge.target === nodeId && edge.targetHandle === handleId,
		);

		// For each incoming edge, check the status of its source node and all its descendants
		for (const edge of incomingEdges) {
			const branchStatus = checkBranchNodeStatus(edge.source);
			if (branchStatus !== "idle") {
				return branchStatus;
			}
		}

		return "idle";
	};

	const canProcessNode = (nodeId: string) => {
		const node = context.workflow.nodes.find((n) => n.id === nodeId);
		if (!node) {
			return false;
		}

		// Special handling for prompt-crafter nodes
		if (node.type === "prompt-crafter") {
			// Get all target handles from dynamic handles
			const targetHandles = (
				node.data.dynamicHandles?.["template-tags"] || []
			).map((handle) => handle.id);

			// Check each target handle's branch status
			const branchStatuses = targetHandles.map((handleId) =>
				getBranchStatus(nodeId, handleId),
			);

			// Node can process if ALL branches are complete and NONE are processing
			const allBranchesComplete = branchStatuses.every(
				(status) => status === "success",
			);
			const hasProcessingBranch = branchStatuses.some(
				(status) => status === "processing",
			);

			return allBranchesComplete && !hasProcessingBranch;
		}

		// For regular nodes, check all dependencies
		const nodeDependencies = context.workflow.dependencies[nodeId] || [];
		return nodeDependencies.every((dep) => {
			// Check if any dependency has failed
			if (failedNodes.has(dep.node)) {
				return false;
			}
			// Check if the node is completed AND the specific source handle has data
			const sourceNode = context.workflow.nodes.find((n) => n.id === dep.node);
			if (!sourceNode?.data.executionState?.sources) {
				return false;
			}
			const sourceHandleData =
				sourceNode.data.executionState.sources[dep.sourceHandle];
			return completedNodes.has(dep.node) && sourceHandleData !== undefined;
		});
	};

	const processNode = async (nodeId: string) => {
		try {
			const targetsData = getNodeTargetsData(context.workflow, nodeId);

			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "processing",
				targets: targetsData,
			});

			const result = await context.processNode(nodeId, targetsData);

			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				targets: targetsData,
				sources: result,
				status: "success",
			});

			completedNodes.add(nodeId);
			processingNodes.delete(nodeId);
		} catch (error) {
			context.updateNodeExecutionState(nodeId, {
				timestamp: new Date().toISOString(),
				status: "error",
				error: {
					type: "processing-node",
					message: error instanceof Error ? error.message : "Unknown error",
				},
			});
			console.error(error);
			processingNodes.delete(nodeId);
			failedNodes.add(nodeId); // Track failed nodes separately
		}
	};

	return {
		async execute(executionOrder: string[]) {
			// Reset tracking sets
			completedNodes.clear();
			failedNodes.clear();
			processingNodes.clear();

			while (completedNodes.size + failedNodes.size < executionOrder.length) {
				const availableNodes = executionOrder.filter(
					(nodeId) =>
						!completedNodes.has(nodeId) &&
						!failedNodes.has(nodeId) &&
						!processingNodes.has(nodeId) &&
						canProcessNode(nodeId),
				);

				if (availableNodes.length === 0) {
					if (processingNodes.size > 0) {
						await new Promise((resolve) => setTimeout(resolve, 100));
						continue;
					}
					// If there are no available nodes and nothing is processing,
					// but we haven't completed all nodes, it means some nodes
					// couldn't execute due to failed dependencies
					break;
				}

				const processingPromises = availableNodes.map((nodeId) => {
					processingNodes.add(nodeId);
					return processNode(nodeId);
				});

				await Promise.race(processingPromises);
			}
		},
	};
};

FILE: lib/sse-workflow-execution-client.ts

import type { WorkflowDefinition } from "@/lib/flow/workflow";
import type { NodeExecutionState } from "@/lib/flow/workflow-execution-engine";

export interface SSEWorkflowExecutionEventHandlers {
	onNodeUpdate: (nodeId: string, state: NodeExecutionState) => void;
	onError: (error: Error, nodeId?: string) => void;
	onComplete: ({ timestamp }: { timestamp: string }) => void;
}

export class SSEWorkflowExecutionClient {
	private abortController: AbortController | null = null;
	private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

	async connect(
		workflow: WorkflowDefinition,
		handlers: SSEWorkflowExecutionEventHandlers,
	): Promise<void> {
		try {
			this.abortController = new AbortController();

			const response = await fetch("/api/workflow/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "text/event-stream",
				},
				body: JSON.stringify({ workflow }),
				signal: this.abortController.signal,
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				throw new Error("Response body is null");
			}

			this.reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const { done, value } = await this.reader.read();
				if (done) {
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						try {
							const data = JSON.parse(line.slice(6));

							switch (data.type) {
								case "nodeUpdate": {
									handlers.onNodeUpdate(data.nodeId, data.executionState);
									break;
								}
								case "error": {
									handlers.onError(new Error(data.error));
									break;
								}
								case "complete": {
									handlers.onComplete({ timestamp: data.timestamp });
									this.disconnect();
									break;
								}
							}
						} catch (error) {
							console.error("Error parsing SSE data:", error);
						}
					}
				}
			}
		} catch (error) {
			if (error instanceof Error && error.name === "AbortError") {
				// Ignore abort errors as they are expected when disconnecting
				return;
			}
			handlers.onError(
				error instanceof Error ? error : new Error("SSE connection failed"),
			);
		} finally {
			this.disconnect();
		}
	}

	disconnect(): void {
		if (this.reader) {
			this.reader.cancel();
			this.reader = null;
		}
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
	}
}

FILE: lib/sse-workflow-execution-engine.ts

import type { FlowNode } from "@/lib/flow/workflow";
import type { WorkflowDefinition } from "@/lib/flow/workflow";
import {
	type NodeExecutionState,
	type NodeProcessor,
	createWorkflowExecutionEngine,
} from "@/lib/flow/workflow-execution-engine";

function createEvent(type: string, data: Record<string, unknown>) {
	return `data: ${JSON.stringify({ type, ...data })}\n\n`;
}

function createSSEWorkflowExecutionEngine(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
) {
	return createWorkflowExecutionEngine({
		workflow,
		processNode: async (nodeId, targetsData) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				throw new Error(`Node ${nodeId} not found`);
			}

			const processor = nodeProcessor[node.type];
			return await processor(node, targetsData);
		},
		updateNodeExecutionState: (nodeId, state: Partial<NodeExecutionState>) => {
			const node = workflow.nodes.find((n) => n.id === nodeId);
			if (!node) {
				return;
			}

			node.data.executionState = {
				...node.data.executionState,
				...state,
			} as NodeExecutionState;

			// Send node update event
			controller.enqueue(
				createEvent("nodeUpdate", {
					nodeId,
					executionState: node.data.executionState,
				}),
			);

			if (state.status === "error") {
				controller.enqueue(
					createEvent("error", {
						error: state.error,
					}),
				);
			}
		},
	});
}

export async function executeServerWorkflow(
	workflow: WorkflowDefinition,
	nodeProcessor: Record<FlowNode["type"], NodeProcessor>,
	controller: ReadableStreamDefaultController,
) {
	const engine = createSSEWorkflowExecutionEngine(
		workflow,
		nodeProcessor,
		controller,
	);

	try {
		await engine.execute(workflow.executionOrder);
		controller.enqueue(
			createEvent("complete", { timestamp: new Date().toISOString() }),
		);
	} catch (error) {
		controller.enqueue(
			createEvent("error", {
				error: error instanceof Error ? error.message : "Unknown error",
			}),
		);
	} finally {
		controller.close();
	}
}

FILE: lib/server-node-processors.ts

import { generateAIText } from "@/lib/flow/generate-ai-text";
import type { FlowNode } from "@/lib/flow/workflow";
import type { NodeProcessor } from "@/lib/flow/workflow-execution-engine";
import type { GenerateTextNode } from "@/components/flow/generate-text-node";
import type { PromptCrafterNode } from "@/components/flow/prompt-crafter-node";
import type { TextInputNode } from "@/components/flow/text-input-node";

export const serverNodeProcessors: Record<FlowNode["type"], NodeProcessor> = {
	"text-input": async (node) => {
		const textNode = node as TextInputNode;
		return {
			result: textNode.data.config.value,
		};
	},

	"prompt-crafter": async (node, targetsData) => {
		const promptNode = node as PromptCrafterNode;
		if (!targetsData) {
			throw new Error("Targets data not found");
		}

		let parsedTemplate = promptNode.data.config.template;
		for (const [targetId, targetValue] of Object.entries(targetsData)) {
			const tag = promptNode.data.dynamicHandles["template-tags"].find(
				(handle) => handle.id === targetId,
			);
			if (!tag) {
				throw new Error(`Tag with id ${targetId} not found`);
			}
			parsedTemplate = parsedTemplate.replaceAll(
				`{{${tag.name}}}`,
				targetValue,
			);
		}
		return {
			result: parsedTemplate,
		};
	},

	"generate-text": async (node, targetsData) => {
		const generateNode = node as GenerateTextNode;
		const system = targetsData?.system;
		const prompt = targetsData?.prompt;
		if (!prompt) {
			throw new Error("Prompt not found");
		}

		const result = await generateAIText({
			prompt,
			system,
			model: generateNode.data.config.model,
			tools: generateNode.data.dynamicHandles.tools,
		});

		return result.parsedResult;
	},

	"visualize-text": async () => {
		return undefined;
	},
};

FILE: lib/node-factory.ts

import type { FlowNode } from "@/lib/flow/workflow";
import type { GenerateTextNodeController } from "@/components/flow/generate-text-node-controller";
import type { PromptCrafterNodeController } from "@/components/flow/prompt-crafter-node-controller";
import type { TextInputNodeController } from "@/components/flow/text-input-node-controller";
import type { VisualizeTextNodeController } from "@/components/flow/visualize-text-node-controller";
import { nanoid } from "nanoid";

export type NodePosition = {
	x: number;
	y: number;
};

export const nodeFactory = {
	"generate-text": (position: NodePosition): GenerateTextNodeController => ({
		id: nanoid(),
		type: "generate-text",
		position,
		data: {
			config: {
				model: "llama-3.1-8b-instant",
			},
			dynamicHandles: {
				tools: [],
			},
		},
	}),

	"prompt-crafter": (position: NodePosition): PromptCrafterNodeController => ({
		id: nanoid(),
		type: "prompt-crafter",
		position,
		data: {
			config: {
				template: "",
			},
			dynamicHandles: {
				"template-tags": [],
			},
		},
	}),

	"visualize-text": (position: NodePosition): VisualizeTextNodeController => ({
		id: nanoid(),
		type: "visualize-text",
		position,
		data: {},
		width: 350,
		height: 300,
	}),

	"text-input": (position: NodePosition): TextInputNodeController => ({
		id: nanoid(),
		type: "text-input",
		position,
		data: {
			config: {
				value: "",
			},
		},
		width: 350,
		height: 300,
	}),
};

export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
): FlowNode {
	if (!nodeType) {
		throw new Error("Node type is required");
	}
	const factory = nodeFactory[nodeType];
	if (!factory) {
		throw new Error(`Unknown node type: ${nodeType}`);
	}
	return factory(position);
}

FILE: import type { GenerateTextNode } from "@/components/flow/generate-text-node";
import type { Model } from "@/components/ui/model-selector";
import { deepseek } from "@ai-sdk/deepseek";
import { groq } from "@ai-sdk/groq";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { z } from "zod";

interface ToolResult {
	id: string;
	name: string;
	result: string;
}

function createAIClient(model: Model) {
	switch (model) {
		case "deepseek-chat":
			return deepseek;
		case "llama-3.3-70b-versatile":
		case "llama-3.1-8b-instant":
		case "deepseek-r1-distill-llama-70b":
			return groq;
		case "gpt-4o":
		case "gpt-4o-mini":
			return openai;
		default:
			throw new Error(`Unsupported model: ${model}`);
	}
}

function mapToolsForAI(
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"],
) {
	return Object.fromEntries(
		tools.map((toolToMap) => [
			toolToMap.name,
			{
				description: toolToMap.description,
				parameters: z.object({
					toolValue: z.string(),
				}),
				execute: async ({ toolValue }: { toolValue: string }) => toolValue,
			},
		]),
	);
}

export async function generateAIText({
	prompt,
	system,
	model,
	tools,
}: {
	prompt: string;
	system?: string;
	model: Model;
	tools: GenerateTextNode["data"]["dynamicHandles"]["tools"];
}) {
	const client = createAIClient(model);
	const mappedTools = mapToolsForAI(tools);

	const result = await generateText({
		model: client(model),
		system,
		prompt,
		...(tools.length > 0 && {
			tools: mappedTools,
			maxSteps: 1,
			toolChoice: "required",
		}),
	});

	let toolResults: ToolResult[] = [];
	if (tools.length > 0 && result.toolResults) {
		toolResults = result.toolResults.map((step) => {
			const originalTool = tools.find((tool) => tool.name === step.toolName);
			return {
				id: originalTool?.id || "",
				name: step.toolName,
				description: originalTool?.description || "",
				result: step.result,
			};
		});
	}

	const parsedResult: Record<string, string> = {
		result: result.text,
	};

	for (const toolResult of toolResults) {
		parsedResult[toolResult.id] = toolResult.result;
	}

	return {
		text: result.text,
		toolResults,
		totalTokens: result.usage?.totalTokens,
		parsedResult,
	};
}

FILE: hooks/use-workflow.ts

import { createNode } from "@/lib/flow/node-factory";
import { SSEWorkflowExecutionClient } from "@/lib/flow/sse-workflow-execution-client";
import {
	type DynamicHandle,
	type FlowEdge,
	type FlowNode,
	type WorkflowDefinition,
	type WorkflowError,
	isNodeOfType,
	isNodeWithDynamicHandles,
	prepareWorkflow,
} from "@/lib/flow/workflow";
import type {
	EdgeExecutionState,
	NodeExecutionState,
} from "@/lib/flow/workflow-execution-engine";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import type { Connection, EdgeChange, NodeChange } from "@xyflow/react";
import { nanoid } from "nanoid";
import { createWithEqualityFn } from "zustand/traditional";

export interface WorkflowState {
	nodes: FlowNode[];
	edges: FlowEdge[];
	onNodesChange: (changes: NodeChange<FlowNode>[]) => void;
	onEdgesChange: (changes: EdgeChange<FlowEdge>[]) => void;
	onConnect: (connection: Connection) => void;
	getNodeById: (nodeId: string) => FlowNode;
	createNode: (
		nodeType: FlowNode["type"],
		position: { x: number; y: number },
	) => FlowNode;
	updateNode: <T extends FlowNode["type"]>(
		id: string,
		nodeType: T,
		data: Partial<FlowNode["data"]>,
	) => void;
	updateNodeExecutionState: (
		nodeId: string,
		state: Partial<NodeExecutionState> | undefined,
	) => void;
	updateEdgeExecutionState: (
		edgeId: string,
		state: Partial<EdgeExecutionState> | undefined,
	) => void;
	deleteNode: (id: string) => void;
	addDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handle: Omit<DynamicHandle, "id">,
	) => string;
	removeDynamicHandle: <T extends FlowNode["type"]>(
		nodeId: string,
		nodeType: T,
		handleCategory: string,
		handleId: string,
	) => void;
	// Workflow validation and execution state
	validateWorkflow: () => WorkflowDefinition;
	workflowExecutionState: {
		isRunning: boolean;
		finishedAt: string | null;
		errors: WorkflowError[];
		timesRun: number;
	};
	// execution
	startExecution: () => Promise<{
		status: "success" | "error";
		message: string;
		error?: Error;
		validationErrors?: WorkflowError[];
	}>;
	// Initialize workflow with nodes and edges
	initializeWorkflow: (nodes: FlowNode[], edges: FlowEdge[]) => void;
}

const useWorkflow = createWithEqualityFn<WorkflowState>((set, get) => ({
	nodes: [],
	edges: [],
	workflowExecutionState: {
		isRunning: false,
		finishedAt: null,
		errors: [],
		timesRun: 0,
	},
	initializeWorkflow: (nodes: FlowNode[], edges: FlowEdge[]) => {
		set({ nodes, edges });
		get().validateWorkflow();
	},
	validateWorkflow: () => {
		const { nodes, edges } = get();
		const workflow = prepareWorkflow(nodes, edges);

		// Reset edge execution states
		for (const edge of workflow.edges) {
			get().updateEdgeExecutionState(edge.id, {
				error: undefined,
			});
		}

		// Update states for errors if any
		if (workflow.errors.length > 0) {
			for (const error of workflow.errors) {
				switch (error.type) {
					case "multiple-sources-for-target-handle":
					case "cycle":
						for (const edge of error.edges) {
							get().updateEdgeExecutionState(edge.id, {
								error,
							});
						}
						break;
					case "missing-required-connection":
						get().updateNodeExecutionState(error.node.id, {
							status: "idle",
							timestamp: new Date().toISOString(),
							error,
						});
						break;
				}
			}
		}

		set((state) => ({
			workflowExecutionState: {
				...state.workflowExecutionState,
				errors: workflow.errors,
			},
		}));
		return workflow;
	},
	onNodesChange: (changes) => {
		set({
			nodes: applyNodeChanges<FlowNode>(changes, get().nodes),
		});
		get().validateWorkflow();
	},
	onEdgesChange: (changes) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		});
		get().validateWorkflow();
	},
	onConnect: (connection) => {
		const newEdge = addEdge({ ...connection, type: "status" }, get().edges);
		const sourceNode = get().getNodeById(connection.source);

		if (!connection.sourceHandle) {
			throw new Error("Source handle not found");
		}

		const sourceExecutionState = sourceNode.data.executionState;

		if (sourceExecutionState?.sources) {
			const sourceHandleData =
				sourceExecutionState.sources[connection.sourceHandle];
			const nodes = get().nodes.map((node) => {
				if (node.id === connection.target && connection.targetHandle) {
					return {
						...node,
						data: {
							...node.data,
							executionState: node.data.executionState
								? {
										...node.data.executionState,
										targets: {
											...node.data.executionState.targets,
											[connection.targetHandle]: sourceHandleData,
										},
									}
								: {
										status: "success",
										timestamp: new Date().toISOString(),
										targets: {
											[connection.targetHandle]: sourceHandleData,
										},
									},
						},
					};
				}
				return node;
			});

			set({
				nodes: nodes as FlowNode[],
			});
		}

		set({
			edges: newEdge,
		});
		get().validateWorkflow();
	},
	getNodeById: (nodeId) => {
		const node = get().nodes.find((node) => node.id === nodeId);
		if (!node) {
			throw new Error(`Node with id ${nodeId} not found`);
		}
		return node;
	},
	createNode(nodeType, position) {
		const newNode = createNode(nodeType, position);
		set((state) => ({
			nodes: [...state.nodes, newNode],
		}));
		return newNode;
	},
	updateNode(id, type, data) {
		set((state) => ({
			nodes: state.nodes.map((node) => {
				if (node.id === id && isNodeOfType(node, type)) {
					return {
						...node,
						data: {
							...node.data,
							...data,
						},
					};
				}
				return node;
			}),
		}));
	},
	updateNodeExecutionState: (nodeId, state) => {
		set((currentState) => ({
			nodes: currentState.nodes.map((node) => {
				if (node.id === nodeId) {
					return {
						...node,
						data: {
							...node.data,
							executionState: {
								...node.data?.executionState,
								...state,
							},
						},
					} as FlowNode;
				}
				return node;
			}),
		}));
	},
	updateEdgeExecutionState: (edgeId, state) => {
		set((currentState) => ({
			edges: currentState.edges.map((edge) => {
				if (edge.id === edgeId) {
					return {
						...edge,
						data: {
							...edge.data,
							executionState: {
								...edge.data?.executionState,
								...state,
							},
						},
					};
				}
				return edge;
			}),
		}));
	},
	deleteNode(id) {
		set({
			nodes: get().nodes.filter((node) => node.id !== id),
			edges: get().edges.filter(
				(edge) => edge.source !== id && edge.target !== id,
			),
		});
	},
	addDynamicHandle(nodeId, type, handleCategory, handle) {
		const newId = nanoid();
		set({
			nodes: get().nodes.map((node) => {
				if (
					node.id === nodeId &&
					isNodeWithDynamicHandles(node) &&
					isNodeOfType(node, type)
				) {
					return {
						...node,
						data: {
							...node.data,
							dynamicHandles: {
								...node.data.dynamicHandles,
								[handleCategory]: [
									...(node.data.dynamicHandles[
										handleCategory as keyof typeof node.data.dynamicHandles
									] || []),
									{
										...handle,
										id: newId,
									},
								],
							},
						},
					};
				}

				return node;
			}),
		});
		return newId;
	},
	removeDynamicHandle(nodeId, type, handleCategory, handleId) {
		set({
			nodes: get().nodes.map((node) => {
				if (
					node.id === nodeId &&
					isNodeWithDynamicHandles(node) &&
					isNodeOfType(node, type)
				) {
					const dynamicHandles = node.data.dynamicHandles;
					const handles = dynamicHandles[
						handleCategory as keyof typeof dynamicHandles
					] as DynamicHandle[];
					const newHandles = handles.filter((handle) => handle.id !== handleId);

					return {
						...node,
						data: {
							...node.data,
							dynamicHandles: {
								...node.data.dynamicHandles,
								[handleCategory]: newHandles,
							},
						},
					};
				}
				return node;
			}),
			edges: get().edges.filter((edge) => {
				if (edge.source === nodeId && edge.sourceHandle === handleId) {
					return false;
				}
				if (edge.target === nodeId && edge.targetHandle === handleId) {
					return false;
				}
				return true;
			}),
		});
	},
	// Runtime

	async startExecution() {
		// Check if workflow has already run successfully
		if (get().workflowExecutionState.timesRun > 3) {
			const message =
				"Workflow has already run successfully and cannot be run again";
			console.warn(message);
			return {
				status: "error",
				message,
				error: new Error(message),
			};
		}

		// Reset execution state for all nodes
		set((state) => ({
			nodes: state.nodes.map((node) => ({
				...node,
				data: {
					...node.data,
					executionState: {
						status: "idle",
						timestamp: new Date().toISOString(),
					},
				},
			})) as FlowNode[],
		}));

		const workflow = get().validateWorkflow();

		if (workflow.errors.length > 0) {
			const message = "Workflow validation failed";
			return {
				status: "error",
				message,
				error: new Error(message),
				validationErrors: workflow.errors,
			};
		}

		// Set execution state to running
		set((state) => ({
			workflowExecutionState: {
				...state.workflowExecutionState,
				isRunning: true,
			},
		}));

		try {
			const sseClient = new SSEWorkflowExecutionClient();
			const { updateNodeExecutionState } = get();

			await new Promise((resolve, reject) => {
				sseClient.connect(workflow, {
					onNodeUpdate: (nodeId, state) => {
						updateNodeExecutionState(nodeId, state);
					},
					onError: (error) => {
						console.error("Error in execution:", error);
						reject(error);
					},
					onComplete: ({ timestamp }) => {
						set((state) => ({
							workflowExecutionState: {
								...state.workflowExecutionState,
								finishedAt: timestamp,
								timesRun: state.workflowExecutionState.timesRun + 1,
							},
						}));
						resolve(undefined);
					},
				});
			});

			return {
				status: "success",
				message: "Workflow executed successfully",
			};
		} catch (error) {
			console.error("Workflow execution failed:", error);
			return {
				status: "error",
				message: "Workflow execution failed",
				error: error instanceof Error ? error : new Error(String(error)),
			};
		} finally {
			// Reset execution state when done
			set((state) => ({
				workflowExecutionState: {
					...state.workflowExecutionState,
					isRunning: false,
				},
			}));
		}
	},
}));

export { useWorkflow };
