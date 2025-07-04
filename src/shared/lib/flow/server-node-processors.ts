import { generateAIText } from "@/shared/lib/flow/generate-ai-text";
import type { FlowNode } from "@/shared/lib/flow/workflow";
import type { NodeProcessor } from "@/shared/lib/flow/workflow-execution-engine";
import type { GenerateTextNode } from "@/shared/ui/flow/generate-text-node";
import type { PromptCrafterNode } from "@/shared/ui/flow/prompt-crafter-node";
import type { TextInputNode } from "@/shared/ui/flow/text-input-node";
import type { JsonNode } from "@/shared/ui/flow/json-node";

export const serverNodeProcessors: Record<FlowNode["type"], NodeProcessor> = {
	"text-input": async (node) => {
		const textNode = node as TextInputNode;
		return {
			result: textNode.data.config.value,
		};
	},

	"prompt-crafter": async (node, targetsData) => {
		const promptNode = node as PromptCrafterNode;
		if (!targetsData) {
			throw new Error("Targets data not found");
		}

		let parsedTemplate = promptNode.data.config.template;
		for (const [targetId, targetValue] of Object.entries(targetsData)) {
			const tag = promptNode.data.dynamicHandles["template-tags"].find(
				(handle) => handle.id === targetId,
			);
			if (!tag) {
				throw new Error(`Tag with id ${targetId} not found`);
			}
			parsedTemplate = parsedTemplate.replaceAll(
				`{{${tag.name}}}`,
				targetValue,
			);
		}
		return {
			result: parsedTemplate,
		};
	},

	"generate-text": async (node, targetsData) => {
		const generateNode = node as GenerateTextNode;
		const system = targetsData?.system;
		const prompt = targetsData?.prompt;
		if (!prompt) {
			throw new Error("Prompt not found");
		}

		const result = await generateAIText({
			prompt,
			system,
			model: generateNode.data.config.model,
			tools: generateNode.data.dynamicHandles.tools,
		});

		return result.parsedResult;
	},

	"visualize-text": async () => {
		return undefined;
	},

	"json-node": async (node, targetsData) => {
		const jsonNode = node as JsonNode;
		const input = targetsData?.input;
		
		try {
			// Parse the JSON to validate it
			const jsonData = JSON.parse(jsonNode.data.config.json);
			
			// Return the parsed JSON as the result
			return {
				result: JSON.stringify(jsonData, null, 2),
			};
		} catch (error) {
			throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	},
};