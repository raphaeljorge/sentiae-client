import type { FlowNode } from "@/shared/lib/flow/workflow";
import type { NodeType } from "@/shared/types/node";
import { buildNodeFromType, type NodeBuilderConfig } from "@/shared/lib/flow/node-builder";
import { nanoid } from "nanoid";

export type NodePosition = {
	x: number;
	y: number;
};

/**
 * Create a node from a NodeType definition using the comprehensive JSON structure
 */
export function createNode(
	nodeType: FlowNode["type"],
	position: NodePosition,
	nodeTypes: NodeType[],
	initialData?: Record<string, any>
): FlowNode {
	if (!nodeType) {
		throw new Error("Node type is required");
	}

	// Find the NodeType definition from the API data
	const nodeTypeDefinition = nodeTypes.find(nt => nt.id === nodeType);
	
	if (!nodeTypeDefinition) {
		throw new Error(`Node type definition not found for: ${nodeType}. Available types: ${nodeTypes.map(nt => nt.id).join(', ')}`);
	}

	// Build the node using the comprehensive JSON structure
	const builtNodeInfo = buildNodeFromType({
		nodeType: nodeTypeDefinition,
		position,
		initialData,
	});

	// Create node data structure that matches the expected controller types
	// while using the JSON configuration as the source of truth
	const baseNode = {
		id: builtNodeInfo.id,
		type: nodeType,
		position: builtNodeInfo.position,
		// Apply UI configuration from the JSON
		...(nodeTypeDefinition.ui.width && { width: nodeTypeDefinition.ui.width }),
		...(nodeTypeDefinition.ui.height && { height: nodeTypeDefinition.ui.height }),
	};

	// Build type-specific data structures based on the JSON configuration
	switch (nodeType) {
		case "generate-text":
			return {
				...baseNode,
				type: "generate-text" as const,
				data: {
					config: {
						model: (builtNodeInfo.data.config.model || "llama-3.1-8b-instant") as any,
					},
					dynamicHandles: {
						tools: builtNodeInfo.data.dynamicHandles?.tools || [],
					},
				},
			} as any; // Type assertion for now due to complex controller types

		case "prompt-crafter":
			return {
				...baseNode,
				type: "prompt-crafter" as const,
				data: {
					config: {
						template: builtNodeInfo.data.config.template || "",
					},
					dynamicHandles: {
						"template-tags": builtNodeInfo.data.dynamicHandles?.["template-tags"] || [],
					},
				},
			} as any; // Type assertion for now due to complex controller types

		case "text-input":
			return {
				...baseNode,
				type: "text-input" as const,
				data: {
					config: {
						value: builtNodeInfo.data.config.value || "",
					},
				},
			} as any; // Type assertion for now due to complex controller types

		case "visualize-text":
			return {
				...baseNode,
				type: "visualize-text" as const,
				data: {},
			} as any; // Type assertion for now due to complex controller types

		default:
			// For unsupported types, log and fallback to a basic structure
			console.warn(`Node type ${nodeType} not fully supported in workflow system yet. Using basic structure from JSON config.`);
			return {
				...baseNode,
				data: builtNodeInfo.data,
			} as any;
	}
}

// Legacy factory functions have been removed - all node creation now uses the JSON-driven createNode function

/**
 * Helper function to validate node type against available types
 */
export function validateNodeType(nodeType: string, availableTypes: NodeType[]): boolean {
	return availableTypes.some(nt => nt.id === nodeType);
}

/**
 * Get node type definition by ID
 */
export function getNodeTypeDefinition(nodeTypeId: string, nodeTypes: NodeType[]): NodeType | undefined {
	return nodeTypes.find(nt => nt.id === nodeTypeId);
}