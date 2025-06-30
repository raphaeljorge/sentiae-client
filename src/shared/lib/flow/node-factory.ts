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

	// Create fully dynamic node structure based purely on JSON configuration
	// No more hardcoded type-specific data structures!
	const dynamicNode = {
		id: builtNodeInfo.id,
		type: nodeType,
		position: builtNodeInfo.position,
		// Apply UI configuration from the JSON
		...(nodeTypeDefinition.ui.width && { width: nodeTypeDefinition.ui.width }),
		...(nodeTypeDefinition.ui.height && { height: nodeTypeDefinition.ui.height }),
		// Use the complete data structure from the JSON configuration
		data: {
			...builtNodeInfo.data,
			// Store the node definition for the GenericNodeController
			definition: nodeTypeDefinition,
		},
	};

	return dynamicNode as FlowNode;
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