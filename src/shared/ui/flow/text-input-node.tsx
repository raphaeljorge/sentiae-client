import { Separator } from "@/shared/ui/separator";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/utils";
import { LabeledHandle } from "@/shared/ui/flow/labeled-handle";
import {
	NodeHeader,
	NodeHeaderAction,
	NodeHeaderActions,
	NodeHeaderIcon,
	NodeHeaderTitle,
} from "@/shared/ui/flow/node-header";
import { ResizableNode } from "@/shared/ui/flow/resizable-node";
import { type Node, type NodeProps, Position } from "@xyflow/react";
import { PenLine, Trash } from "lucide-react";

export type TextInputData = {
	status: "processing" | "error" | "success" | "idle" | undefined;
	config: {
		value: string;
	};
};

export type TextInputNode = Node<TextInputData, "text-input">;

export interface TextInputProps extends NodeProps<TextInputNode> {
	onTextChange?: (value: string) => void;
	onDeleteNode?: () => void;
}

export function TextInputNode({
	id,
	selected,
	deletable,
	data,
	onTextChange,
	onDeleteNode,
}: TextInputProps) {
	return (
		<ResizableNode
			id={id}
			selected={selected}
			nodeType="core/text-input"
			className={cn("flex flex-col h-full", {
				"border-orange-500": data.status === "processing",
				"border-red-500": data.status === "error",
			})}
		>
			<NodeHeader className="m-0">
				<NodeHeaderIcon>
					<PenLine />
				</NodeHeaderIcon>
				<NodeHeaderTitle>Text Input</NodeHeaderTitle>
				<NodeHeaderActions>
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
			<div className="p-2 flex-1 overflow-auto flex flex-col gap-4">
				<Textarea
					value={data.config.value || ""}
					onChange={(e) => onTextChange?.(e.target.value)}
					className="w-full flex-1 resize-none nodrag nopan nowheel"
					placeholder="Enter your text here..."
				/>
			</div>
			<div className="flex justify-end pt-2 pb-4 text-sm">
				<LabeledHandle
					id="result"
					title="Result"
					type="source"
					position={Position.Right}
					className="justify-self-end"
				/>
			</div>
		</ResizableNode>
	);
}
