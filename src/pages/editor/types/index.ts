import type { GenerateTextNodeController } from "@/features/flow/ui/generate-text-node-controller";
import type { PromptCrafterNodeController } from "@/features/flow/ui/prompt-crafter-node-controller";
import type { StatusEdgeController } from "@/features/flow/ui/status-edge-controller";
import type { TextInputNodeController } from "@/features/flow/ui/text-input-node-controller";
import type { VisualizeTextNodeController } from "@/features/flow/ui/visualize-text-node-controller";
import { Model } from "@/shared/ui/model-selector";


// Base Node/Edge types from @xyflow/react
export type { Node, Edge, NodeProps, EdgeProps } from '@xyflow/react';


// App-specific Flow Node & Edge Types
export type FlowNode =
	| VisualizeTextNodeController
	| TextInputNodeController
	| PromptCrafterNodeController
	| GenerateTextNodeController;

export type FlowEdge = StatusEdgeController;

// Type definition for dynamic handles (used in prompt-crafter and generate-text nodes)
export type DynamicHandle = {
	id: string;
	name: string;
	description?: string;
};

// Type definitions for individual node data structures
export type GenerateTextNodeData = {
    config: {
        model: Model;
    };
    dynamicHandles: {
        tools: DynamicHandle[];
    };
    status?: string;
};

export type PromptCrafterNodeData = {
    config: {
        template: string;
    };
    dynamicHandles: {
        "template-tags": DynamicHandle[];
    };
    status?: string;
};

export type TextInputNodeData = {
    config: {
        value: string;
    };
    status?: string;
};

export type VisualizeTextNodeData = {
    input?: any;
    status?: string;
};