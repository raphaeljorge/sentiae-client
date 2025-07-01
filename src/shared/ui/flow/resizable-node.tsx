import { cn } from "@/shared/lib/utils";
import { BaseNode } from "@/shared/ui/flow/base-node";
import { NodeResizer } from "@xyflow/react";
import React from "react";

export const ResizableNode = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		selected: boolean;
		nodeType?: string;
		nodeDefinition?: any;
	}
>(({ className, selected, nodeType, nodeDefinition, style, children, ...props }, ref) => (
	<BaseNode
		ref={ref}
		selected={selected}
		nodeType={nodeType}
		nodeDefinition={nodeDefinition}
		style={{
			...style,
			minHeight: 200,
			minWidth: 250,
			maxWidth: 800,
			// Remove maxHeight to allow natural growth
		}}
		className={cn(className, "min-h-[200px] p-0 hover:ring-orange-500")}
		{...props}
	>
		<NodeResizer isVisible={selected} />
		{children}
	</BaseNode>
));
ResizableNode.displayName = "ResizableNode";
