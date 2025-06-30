import type { WorkflowDefinition } from "@/shared/lib/flow/workflow";
import type { NodeExecutionState } from "@/shared/lib/flow/workflow-execution-engine";

export interface SSEWorkflowExecutionEventHandlers {
	onNodeUpdate: (nodeId: string, state: NodeExecutionState) => void;
	onError: (error: Error, nodeId?: string) => void;
	onComplete: ({ timestamp }: { timestamp: string }) => void;
}

export class SSEWorkflowExecutionClient {
	private abortController: AbortController | null = null;
	private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

	async connect(
		workflow: WorkflowDefinition,
		handlers: SSEWorkflowExecutionEventHandlers,
	): Promise<void> {
		try {
			console.log('SSE Client: Starting connection to /api/workflow/execute');
			console.log('SSE Client: Workflow data:', JSON.stringify(workflow, null, 2));
			
			this.abortController = new AbortController();

			const response = await fetch("/api/workflow/execute", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "text/event-stream",
				},
				body: JSON.stringify({ workflow }),
				signal: this.abortController.signal,
			});

			console.log('SSE Client: Response received, status:', response.status);
			console.log('SSE Client: Response headers:', response.headers);

			if (!response.ok) {
				console.error('SSE Client: HTTP error, status:', response.status);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			if (!response.body) {
				console.error('SSE Client: Response body is null');
				throw new Error("Response body is null");
			}

			console.log('SSE Client: Starting to read response stream');
			this.reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = "";

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const { done, value } = await this.reader.read();
				if (done) {
					console.log('SSE Client: Stream ended');
					break;
				}

				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n\n");
				buffer = lines.pop() || "";

				for (const line of lines) {
					if (line.startsWith("data: ")) {
						console.log('SSE Client: Received data:', line);
						try {
							const data = JSON.parse(line.slice(6));

							switch (data.type) {
								case "nodeUpdate": {
									console.log('SSE Client: Node update:', data.nodeId, data.executionState);
									handlers.onNodeUpdate(data.nodeId, data.executionState);
									break;
								}
								case "error": {
									console.log('SSE Client: Error received:', data.error);
									handlers.onError(new Error(data.error));
									break;
								}
								case "complete": {
									console.log('SSE Client: Workflow complete:', data.timestamp);
									handlers.onComplete({ timestamp: data.timestamp });
									this.disconnect();
									break;
								}
							}
						} catch (error) {
							console.error("Error parsing SSE data:", error);
						}
					}
				}
			}
		} catch (error) {
			console.error('SSE Client: Connection error:', error);
			if (error instanceof Error && error.name === "AbortError") {
				console.log('SSE Client: Connection aborted');
				// Ignore abort errors as they are expected when disconnecting
				return;
			}
			handlers.onError(
				error instanceof Error ? error : new Error("SSE connection failed"),
			);
		} finally {
			console.log('SSE Client: Disconnecting');
			this.disconnect();
		}
	}

	disconnect(): void {
		if (this.reader) {
			this.reader.cancel();
			this.reader = null;
		}
		if (this.abortController) {
			this.abortController.abort();
			this.abortController = null;
		}
	}
}
