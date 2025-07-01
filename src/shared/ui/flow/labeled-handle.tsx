"use client";

import { cn } from "@/shared/lib/utils";
import type { HandleProps } from "@xyflow/react";
import { Position } from "@xyflow/react";
import React from "react";

import { BaseHandle } from "@/shared/ui/flow/base-handle";

const LabeledHandle = React.forwardRef<
	HTMLDivElement,
	HandleProps &
		React.HTMLAttributes<HTMLDivElement> & {
			title: string;
			handleClassName?: string;
			labelClassName?: string;
		}
>(
	(
		{ className, labelClassName, handleClassName, title, position, ...props },
		ref,
	) => (
		<div
			ref={ref}
			title={title}
			className={cn(
				"relative",
				className,
			)}
		>
			{/* Handle positioned by React Flow CSS - positioned relative to node */}
			<BaseHandle 
				position={position} 
				className={cn(
					"!absolute !z-10",
					handleClassName
				)} 
				{...props} 
			/>
			{/* Label content */}
			<div
				className={cn("flex items-center px-4 py-1 gap-3 nodrag", {
					"justify-end": position === Position.Right,
					"justify-start": position === Position.Left,
				})}
			>
				<span className={cn(
					"text-foreground text-sm",
					labelClassName
				)}>
					{title}
				</span>
			</div>
		</div>
	),
);

LabeledHandle.displayName = "LabeledHandle";

export { LabeledHandle };
