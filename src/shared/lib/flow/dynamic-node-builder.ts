import type { FlowNode } from '@/shared/lib/flow/workflow';
import { nanoid } from 'nanoid';

/**
 * Creates a node from a JSON definition
 * @param nodeJson The JSON definition of the node
 * @returns A FlowNode instance
 */
export function createNodeFromJson(nodeJson: any): FlowNode {
  // Validate required fields
  if (!nodeJson.type) {
    throw new Error('Node type is required');
  }

  if (!nodeJson.position || typeof nodeJson.position.x !== 'number' || typeof nodeJson.position.y !== 'number') {
    throw new Error('Valid position with x and y coordinates is required');
  }

  // Create a base node with the required properties
  const baseNode: FlowNode = {
    id: nodeJson.id || nanoid(),
    type: nodeJson.type,
    position: {
      x: nodeJson.position.x,
      y: nodeJson.position.y,
    },
    data: {
      ...nodeJson.data,
    },
  };

  // Add optional properties if they exist
  if (nodeJson.width) baseNode.width = nodeJson.width;
  if (nodeJson.height) baseNode.height = nodeJson.height;

  // Process specific node types
  switch (nodeJson.type) {
    case 'text-input':
      return processTextInputNode(baseNode, nodeJson);
    case 'generate-text':
      return processGenerateTextNode(baseNode, nodeJson);
    case 'prompt-crafter':
      return processPromptCrafterNode(baseNode, nodeJson);
    case 'visualize-text':
      return processVisualizeTextNode(baseNode, nodeJson);
    case 'json-node':
      return processJsonNode(baseNode, nodeJson);
    default:
      // For unknown node types, just return the base node
      return baseNode;
  }
}

/**
 * Process a text-input node
 */
function processTextInputNode(baseNode: FlowNode, nodeJson: any): FlowNode {
  // Ensure the node has the required data structure
  if (!baseNode.data) baseNode.data = {};
  if (!baseNode.data.config) baseNode.data.config = {};
  
  // Set default value if not provided
  if (nodeJson.data?.config?.value !== undefined) {
    baseNode.data.config.value = nodeJson.data.config.value;
  } else {
    baseNode.data.config.value = '';
  }

  // Set default dimensions if not provided
  if (!baseNode.width) baseNode.width = 350;
  if (!baseNode.height) baseNode.height = 300;

  return baseNode;
}

/**
 * Process a generate-text node
 */
function processGenerateTextNode(baseNode: FlowNode, nodeJson: any): FlowNode {
  // Ensure the node has the required data structure
  if (!baseNode.data) baseNode.data = {};
  if (!baseNode.data.config) baseNode.data.config = {};
  if (!baseNode.data.dynamicHandles) baseNode.data.dynamicHandles = {};
  
  // Set default model if not provided
  if (nodeJson.data?.config?.model) {
    baseNode.data.config.model = nodeJson.data.config.model;
  } else {
    baseNode.data.config.model = 'llama-3.1-8b-instant';
  }

  // Set tools if provided
  if (nodeJson.data?.dynamicHandles?.tools) {
    baseNode.data.dynamicHandles.tools = nodeJson.data.dynamicHandles.tools.map((tool: any) => ({
      id: tool.id || nanoid(),
      name: tool.name,
      description: tool.description || '',
    }));
  } else {
    baseNode.data.dynamicHandles.tools = [];
  }

  return baseNode;
}

/**
 * Process a prompt-crafter node
 */
function processPromptCrafterNode(baseNode: FlowNode, nodeJson: any): FlowNode {
  // Ensure the node has the required data structure
  if (!baseNode.data) baseNode.data = {};
  if (!baseNode.data.config) baseNode.data.config = {};
  if (!baseNode.data.dynamicHandles) baseNode.data.dynamicHandles = {};
  
  // Set template if provided
  if (nodeJson.data?.config?.template !== undefined) {
    baseNode.data.config.template = nodeJson.data.config.template;
  } else {
    baseNode.data.config.template = '';
  }

  // Set template tags if provided
  if (nodeJson.data?.dynamicHandles?.['template-tags']) {
    baseNode.data.dynamicHandles['template-tags'] = nodeJson.data.dynamicHandles['template-tags'].map((tag: any) => ({
      id: tag.id || nanoid(),
      name: tag.name,
    }));
  } else {
    baseNode.data.dynamicHandles['template-tags'] = [];
  }

  return baseNode;
}

/**
 * Process a visualize-text node
 */
function processVisualizeTextNode(baseNode: FlowNode, nodeJson: any): FlowNode {
  // Set default dimensions if not provided
  if (!baseNode.width) baseNode.width = 350;
  if (!baseNode.height) baseNode.height = 300;

  return baseNode;
}

/**
 * Process a json-node
 */
function processJsonNode(baseNode: FlowNode, nodeJson: any): FlowNode {
  // Ensure the node has the required data structure
  if (!baseNode.data) baseNode.data = {};
  if (!baseNode.data.config) baseNode.data.config = {};
  
  // Set JSON if provided
  if (nodeJson.data?.config?.json !== undefined) {
    baseNode.data.config.json = nodeJson.data.config.json;
  } else {
    baseNode.data.config.json = '{}';
  }

  // Set default dimensions if not provided
  if (!baseNode.width) baseNode.width = 350;
  if (!baseNode.height) baseNode.height = 400;

  return baseNode;
}

/**
 * Creates multiple nodes from a JSON array
 * @param nodesJson Array of node JSON definitions
 * @returns Array of FlowNode instances
 */
export function createNodesFromJson(nodesJson: any[]): FlowNode[] {
  return nodesJson.map(nodeJson => createNodeFromJson(nodeJson));
}