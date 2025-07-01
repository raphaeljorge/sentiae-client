import { useState } from "react";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { LabeledHandle } from "@/shared/ui/flow/labeled-handle";
import {
  NodeHeader,
  NodeHeaderAction,
  NodeHeaderActions,
  NodeHeaderIcon,
  NodeHeaderTitle,
} from "@/shared/ui/flow/node-header";
import { NodeHeaderStatus } from "@/shared/ui/flow/node-header-status";
import { BaseNode } from "@/shared/ui/flow/base-node";
import { type Node, type NodeProps, Position } from "@xyflow/react";
import { Code, Trash } from "lucide-react";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";

export type JsonNodeData = {
  status: "processing" | "error" | "success" | "idle" | undefined;
  config: {
    json: string;
    schema?: Record<string, any>;
  };
};

export type JsonNode = Node<JsonNodeData, "json-node">;

interface JsonNodeProps extends NodeProps<JsonNode> {
  onJsonChange: (value: string) => void;
  onDeleteNode: () => void;
  onGenerateNode?: (jsonData: any) => void;
}

export function JsonNode({
  id,
  selected,
  deletable,
  data,
  onJsonChange,
  onDeleteNode,
  onGenerateNode,
}: JsonNodeProps) {
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleJsonChange = (value: string) => {
    setJsonError(null);
    onJsonChange(value);
  };

  const handleGenerateNode = () => {
    try {
      const jsonData = JSON.parse(data.config.json);
      onGenerateNode?.(jsonData);
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : "Invalid JSON");
    }
  };

  const isValidJson = () => {
    try {
      JSON.parse(data.config.json);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <BaseNode
      selected={selected}
      nodeType="core/json-node"
      className={cn("w-[350px] p-0", {
        "border-orange-500": data.status === "processing",
        "border-red-500": data.status === "error",
      })}
    >
      <NodeHeader className="m-0">
        <NodeHeaderIcon>
          <Code />
        </NodeHeaderIcon>
        <NodeHeaderTitle>JSON Node</NodeHeaderTitle>
        <NodeHeaderActions>
          <NodeHeaderStatus status={data.status} />
          {deletable && (
            <NodeHeaderAction
              onClick={onDeleteNode}
              variant="ghost"
              label="Delete node"
            >
              <Trash />
            </NodeHeaderAction>
          )}
        </NodeHeaderActions>
      </NodeHeader>
      <Separator />
      <div className="p-4 flex flex-col gap-4">
        <Textarea
          value={data.config.json || ""}
          onChange={(e) => handleJsonChange(e.target.value)}
          className="w-full resize-none nodrag nopan nowheel font-mono text-sm"
          placeholder='{"type": "text-input", "position": {"x": 100, "y": 100}, "data": {"config": {"value": "Hello World"}}}'
          rows={8}
        />
        {jsonError && (
          <div className="text-xs text-red-500 font-medium">{jsonError}</div>
        )}
        <Button 
          onClick={handleGenerateNode} 
          disabled={!isValidJson()}
          className="w-full"
        >
          Generate Node
        </Button>
      </div>
      <div className="grid grid-cols-[2fr,1fr] gap-2 pt-2 pb-4 text-sm">
        <div className="flex flex-col gap-2 min-w-0">
          <LabeledHandle
            id="input"
            title="Input"
            type="target"
            position={Position.Left}
          />
        </div>
        <div className="justify-self-end">
          <LabeledHandle
            id="result"
            title="Result"
            type="source"
            position={Position.Right}
          />
        </div>
      </div>
    </BaseNode>
  );
}