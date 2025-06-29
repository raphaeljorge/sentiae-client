"use client";

import { useWorkflow } from "@/shared/hooks/use-workflow";
import type { NodeExecutionState } from "@/shared/lib/flow/workflow-execution-engine";
import { JsonNode } from "@/shared/ui/flow/json-node";
import type { NodeProps } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import { createNode } from "@/shared/lib/flow/node-factory";

export type JsonNodeController = Omit<JsonNode, "data"> & {
  type: "json-node";
  data: Omit<JsonNode["data"], "status"> & {
    executionState?: NodeExecutionState;
  };
};

export function JsonNodeController({
  id,
  data,
  ...props
}: NodeProps<JsonNodeController>) {
  const updateNode = useWorkflow((state) => state.updateNode);
  const deleteNode = useWorkflow((state) => state.deleteNode);
  const addNode = useWorkflow((state) => state.nodes);
  const setNodes = useWorkflow((state) => state.onNodesChange);

  const handleJsonChange = useCallback(
    (value: string) => {
      updateNode(id, "json-node", { config: { json: value } });
    },
    [id, updateNode],
  );

  const handleDeleteNode = useCallback(() => {
    deleteNode(id);
  }, [id, deleteNode]);

  const handleGenerateNode = useCallback(
    (jsonData: any) => {
      try {
        // Validate required fields
        if (!jsonData.type) {
          throw new Error("Node type is required");
        }

        if (!jsonData.position || typeof jsonData.position.x !== 'number' || typeof jsonData.position.y !== 'number') {
          throw new Error("Valid position with x and y coordinates is required");
        }

        // Create the node based on the JSON definition
        const newNode = createNode(jsonData.type, jsonData.position);

        // Apply custom data if provided
        if (jsonData.data) {
          // Deep merge the data
          newNode.data = {
            ...newNode.data,
            ...jsonData.data,
          };

          // Handle specific node type configurations
          if (jsonData.type === 'text-input' && jsonData.data.config?.value) {
            newNode.data.config.value = jsonData.data.config.value;
          }
          
          if (jsonData.type === 'generate-text' && jsonData.data.config?.model) {
            newNode.data.config.model = jsonData.data.config.model;
          }

          // Handle dynamic handles if provided
          if (jsonData.data.dynamicHandles) {
            newNode.data.dynamicHandles = {
              ...newNode.data.dynamicHandles,
              ...jsonData.data.dynamicHandles,
            };
          }
        }

        // Apply custom dimensions if provided
        if (jsonData.width) newNode.width = jsonData.width;
        if (jsonData.height) newNode.height = jsonData.height;

        // Add the node to the workflow
        const addChange = {
          type: 'add',
          item: newNode,
        };
        
        setNodes([addChange]);
        
        toast.success(`Node created: ${jsonData.type}`);
      } catch (error) {
        toast.error(`Failed to create node: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [setNodes],
  );

  return (
    <JsonNode
      id={id}
      data={{
        status: data.executionState?.status,
        config: data.config,
      }}
      {...props}
      onJsonChange={handleJsonChange}
      onDeleteNode={handleDeleteNode}
      onGenerateNode={handleGenerateNode}
    />
  );
}