import type { StatusEdgeController } from "@/shared/ui/flow/status-edge-controller";
import { nanoid } from "nanoid";
import type { NodeType } from "@/shared/types/node";

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

export type FlowNode = {
	id: string;
	type: string;
	position: { x: number; y: number };
	data: {
		config?: Record<string, any>;
		dynamicHandles?: Record<string, DynamicHandle[]>;
		executionState?: {
			status?: string;
			targets?: Record<string, any>;
		};
		definition?: NodeType;
	};
	definition?: NodeType;
};

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
				[key: string]: DynamicHandle[];
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
		if (edge.sourceHandleId && edge.targetHandleId) {
			// Track connections per target handle
			const targetKey = `${edge.target}-${edge.targetHandleId}`;
			const existingConnections = connectionMap.get(targetKey) || [];
			connectionMap.set(targetKey, [...existingConnections, edge]);

			// Build dependency graph
			const existingDependencies = dependencies.get(edge.target) || [];
			dependencies.set(edge.target, [
				...existingDependencies,
				{
					node: edge.source,
					sourceHandle: edge.sourceHandleId,
				},
			]);

			const existingDependents = dependents.get(edge.source) || [];
			dependents.set(edge.source, [
				...existingDependents,
				{
					node: edge.target,
					targetHandle: edge.targetHandleId,
				},
			]);
		}
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
					sourceHandle: edge.sourceHandleId || '',
					targetHandle: edge.targetHandleId || '',
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
		message: `Workflow contains cycles between nodes: ${cycleNodes.join(
			", ",
		)}`,
		edges: cycleEdges.map((edge) => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			sourceHandle: edge.sourceHandleId || '',
			targetHandle: edge.targetHandleId || '',
		})),
	};

	return [error];
}

function validateRequiredHandles(
	nodes: FlowNode[],
	edges: FlowEdge[],
	options: { strict?: boolean } = {},
): MissingConnectionError[] {
	// In non-strict mode (editing), don't validate required connections
	// This allows users to add nodes without immediately connecting them
	if (!options.strict) {
		return [];
	}

	const errors: MissingConnectionError[] = [];
	const connectionsByTarget = new Map<string, FlowEdge[]>();
	const connectionsBySource = new Map<string, FlowEdge[]>();

	// Build connection maps
	for (const edge of edges) {
		if (edge.sourceHandleId && edge.targetHandleId) {
			const targetKey = `${edge.target}-${edge.targetHandleId}`;
			const sourceKey = `${edge.source}-${edge.sourceHandleId}`;

			const targetConnections = connectionsByTarget.get(targetKey) || [];
			connectionsByTarget.set(targetKey, [...targetConnections, edge]);

			const sourceConnections = connectionsBySource.get(sourceKey) || [];
			connectionsBySource.set(sourceKey, [...sourceConnections, edge]);
		}
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
	options: { strict?: boolean } = {},
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

	// Fourth pass: Validate required handles (only in strict mode)
	errors.push(...validateRequiredHandles(nodes, edges, options));

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