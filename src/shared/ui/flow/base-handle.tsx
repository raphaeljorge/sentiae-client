import { cn } from "@/shared/lib/utils";
import { Handle, type HandleProps, Position } from "@xyflow/react";
import React from "react";

export const BaseHandle = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & HandleProps
>(({ className, position = Position.Left, ...props }, ref) => {
	return (
		<Handle 
			ref={ref} 
			position={position}
			style={{ height: 13, width: 13 }}
			className={cn(
				// Additional styling beyond global CSS
				"rounded-full",
				"transition-colors duration-200",
				"cursor-pointer",
				className
			)} 
			{...props} 
		/>
	);
});

BaseHandle.displayName = "BaseHandle";
