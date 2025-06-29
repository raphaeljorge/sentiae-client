import { createNodeFromJson } from '@/shared/lib/flow/dynamic-node-builder';
import type { FlowNode } from '@/shared/lib/flow/workflow';

/**
 * Creates a node from a JSON definition
 * @param nodeJson The JSON definition of the node
 * @returns A FlowNode instance
 */
export function createDynamicNode(nodeJson: any): FlowNode {
  return createNodeFromJson(nodeJson);
}

/**
 * Creates multiple nodes from a JSON array
 * @param nodesJson Array of node JSON definitions
 * @returns Array of FlowNode instances
 */
export function createDynamicNodes(nodesJson: any[]): FlowNode[] {
  return nodesJson.map(nodeJson => createNodeFromJson(nodeJson));
}

/**
 * Registers a node type with the dynamic node factory
 * This allows for extending the factory with custom node types
 * @param type The node type
 * @param processor Function to process the node JSON
 */
export function registerNodeType(
  type: string, 
  processor: (baseNode: FlowNode, nodeJson: any) => FlowNode
) {
  // This would be implemented to allow runtime registration of node types
  console.log(`Registered node type: ${type}`);
}