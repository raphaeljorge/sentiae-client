"use client";

import type { EdgeExecutionState } from "@/shared/lib/flow/workflow-execution-engine";
import { StatusEdge } from "@/shared/ui/flow/status-edge";
import type { EdgeProps } from "@xyflow/react";

export type StatusEdgeController = Omit<StatusEdge, "data"> & {
	type: "status";
	data: {
		executionState?: EdgeExecutionState;
	};
};

export function StatusEdgeController({
	data,
	...props
}: EdgeProps<StatusEdgeController>) {
	return (
		<StatusEdge
			{...props}
			data={{
				error: !!data.executionState?.error,
			}}
		/>
	);
}
