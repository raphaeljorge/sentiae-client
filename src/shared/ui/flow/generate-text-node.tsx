import {
	type Node,
	type NodeProps,
	Position,
	useUpdateNodeInternals,
} from "@xyflow/react";

import { Button } from "@/shared/ui/button";

import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { BaseNode } from "@/shared/ui/flow/base-node";
import {
	EditableHandle,
	EditableHandleDialog,
} from "@/shared/ui/flow/editable-handle";
import { LabeledHandle } from "@/shared/ui/flow/labeled-handle";
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/shared/ui/flow/node-header";
import { NodeHeaderStatus } from "@/shared/ui/flow/node-header-status";
import { type Model, ModelSelector } from "@/shared/ui/model-selector";
import { Bot, Trash } from "lucide-react";
import { useCallback } from "react";
import { PlusIcon } from "@radix-ui/react-icons";

export type GenerateTextData = {
	status: "processing" | "error" | "success" | "idle" | undefined;
	config: {
		model: Model;
	};
	dynamicHandles: {
		tools: {
			id: string;
			name: string;
			description?: string;
		}[];
	};
};

export type GenerateTextNode = Node<GenerateTextData, "generate-text">;

interface GenerateTextNodeProps extends NodeProps<GenerateTextNode> {
	disableModelSelector?: boolean;
	onModelChange: (model: Model) => void;
	onCreateTool: (name: string, description?: string) => boolean;
	onRemoveTool: (handleId: string) => void;
	onUpdateTool: (
		toolId: string,
		newName: string,
		newDescription?: string,
	) => boolean;
	onDeleteNode: () => void;
}

export function GenerateTextNode({
	id,
	selected,
	deletable,
	disableModelSelector,
	data,
	onModelChange,
	onCreateTool,
	onRemoveTool,
	onUpdateTool,
	onDeleteNode,
}: GenerateTextNodeProps) {
	const updateNodeInternals = useUpdateNodeInternals();

	const handleModelChange = useCallback(
		(value: string) => {
			onModelChange?.(value as Model);
		},
		[onModelChange],
	);

	const handleCreateTool = useCallback(
		(name: string, description?: string) => {
			if (!onCreateTool) {
				return false;
			}
			const result = onCreateTool(name, description);
			if (result) {
				updateNodeInternals(id);
			}
			return result;
		},
		[onCreateTool, id, updateNodeInternals],
	);

	const removeHandle = useCallback(
		(handleId: string) => {
			onRemoveTool?.(handleId);
			updateNodeInternals(id);
		},
		[onRemoveTool, id, updateNodeInternals],
	);

	return (
		<BaseNode
			selected={selected}
			className={cn("w-[350px] p-0 hover:ring-orange-500", {
				"border-orange-500": data.status === "processing",
				"border-red-500": data.status === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<Bot />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Generate Text</NodeHeaderTitle>
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
				<ModelSelector
					value={data.config.model}
					onChange={handleModelChange}
					disabled={disableModelSelector}
					disabledModels={[
						"gpt-4o",
						"gpt-4o-mini",
						"deepseek-r1-distill-llama-70b",
					]}
				/>
			</div>
			<div className="grid grid-cols-[2fr,1fr] gap-2 pt-2 text-sm">
				<div className="flex flex-col gap-2 min-w-0">
					<LabeledHandle
						id="system"
						title="System"
						type="target"
						position={Position.Left}
					/>
					<LabeledHandle
						id="prompt"
						title="Prompt"
						type="target"
						position={Position.Left}
						className="col-span-2"
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
			<div className="border-t border-border mt-2">
				<div>
					<div className="flex items-center justify-between py-2 px-4 bg-muted">
						<span className="text-sm font-medium">Tool outputs</span>
						<EditableHandleDialog
							variant="create"
							onSave={handleCreateTool}
							align="end"
							showDescription
						>
							<Button variant="outline" size="sm" className="h-7 px-2">
								<PlusIcon className="h-4 w-4 mr-1" />
								New tool output
							</Button>
						</EditableHandleDialog>
					</div>
					<div className="flex flex-col">
						{data.dynamicHandles.tools.map((tool) => (
							<EditableHandle
								key={tool.id}
								nodeId={id}
								handleId={tool.id}
								name={tool.name}
								description={tool.description}
								type="source"
								position={Position.Right}
								wrapperClassName="w-full"
								onUpdateTool={onUpdateTool}
								onDelete={removeHandle}
								showDescription
							/>
						))}
					</div>
				</div>
			</div>
		</BaseNode>
	);
}
