import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert hex color to closest Tailwind color class
 */
function hexToTailwindColor(hexColor: string): string {
	// Remove # if present
	const cleanHex = hexColor.replace('#', '');
	
	// Convert hex to RGB
	const r = Number.parseInt(cleanHex.substr(0, 2), 16);
	const g = Number.parseInt(cleanHex.substr(2, 2), 16);
	const b = Number.parseInt(cleanHex.substr(4, 2), 16);
	
	// Simple color mapping - you can expand this with more sophisticated color matching
	// This is a basic implementation that maps common colors
	const colorMap: Record<string, string> = {
		'#06b6d4': 'cyan', // text-input
		'#8b5cf6': 'purple', // visualize-text
		'#f97316': 'orange', // generate-text
		'#6366f1': 'indigo', // prompt-crafter
		'#3b82f6': 'blue', // json-node
		'#10b981': 'green', // http-request
		'#f59e0b': 'amber', // if-condition
	};
	
	// Try exact match first
	const exactMatch = colorMap[hexColor.toLowerCase()];
	if (exactMatch) {
		return exactMatch;
	}
	
	// For unknown colors, return a default
	return 'gray';
}

/**
 * Get border color class for a node type, using the node definition if available
 */
export function getNodeBorderColor(nodeType: string, nodeDefinition?: any): string {
	// If we have a node definition with a color, generate the border color dynamically
	if (nodeDefinition?.ui?.color) {
		const colorName = hexToTailwindColor(nodeDefinition.ui.color);
		return `border-${colorName}-500`;
	}
	
	// Fallback to hardcoded mapping for backward compatibility
	const nodeTypeColors: Record<string, string> = {
		// Core nodes
		'core/text-input': 'border-cyan-500',
		'core/visualize-text': 'border-purple-500',
		'core/generate-text': 'border-orange-500',
		'core/prompt-crafter': 'border-indigo-500',
		'core/json-node': 'border-blue-500',
		'core/http-request': 'border-green-500',
		'core/if-condition': 'border-amber-500',
		
		// Legacy node types (for backward compatibility)
		'text-input': 'border-cyan-500',
		'visualize-text': 'border-purple-500',
		'generate-text': 'border-orange-500',
		'prompt-crafter': 'border-indigo-500',
		'json-node': 'border-blue-500',
		'if-condition': 'border-amber-500',
		'http-request': 'border-green-500',
		
		// Default fallback
		'default': 'border-gray-400'
	};

	return nodeTypeColors[nodeType] || nodeTypeColors.default;
}

/**
 * Get hover border color class for a node type, using the node definition if available
 */
export function getNodeHoverBorderColor(nodeType: string, nodeDefinition?: any): string {
	// If we have a node definition with a color, generate the hover border color dynamically
	if (nodeDefinition?.ui?.color) {
		const colorName = hexToTailwindColor(nodeDefinition.ui.color);
		return `hover:border-${colorName}-400`;
	}
	
	// Fallback to hardcoded mapping for backward compatibility
	const nodeTypeHoverColors: Record<string, string> = {
		// Core nodes
		'core/text-input': 'hover:border-cyan-400',
		'core/visualize-text': 'hover:border-purple-400',
		'core/generate-text': 'hover:border-orange-400',
		'core/prompt-crafter': 'hover:border-indigo-400',
		'core/json-node': 'hover:border-blue-400',
		'core/http-request': 'hover:border-green-400',
		'core/if-condition': 'hover:border-amber-400',
		
		// Legacy node types (for backward compatibility)
		'text-input': 'hover:border-cyan-400',
		'visualize-text': 'hover:border-purple-400',
		'generate-text': 'hover:border-orange-400',
		'prompt-crafter': 'hover:border-indigo-400',
		'json-node': 'hover:border-blue-400',
		'if-condition': 'hover:border-amber-400',
		'http-request': 'hover:border-green-400',
		
		// Default fallback
		'default': 'hover:border-gray-300'
	};

	return nodeTypeHoverColors[nodeType] || nodeTypeHoverColors.default;
}

/**
 * Generate hover shadow color dynamically from a hex color
 */
export function generateHoverShadowFromColor(hexColor: string): string {
	// Remove # if present
	const cleanHex = hexColor.replace('#', '');
	
	// Convert hex to RGB
	const r = Number.parseInt(cleanHex.substr(0, 2), 16);
	const g = Number.parseInt(cleanHex.substr(2, 2), 16);
	const b = Number.parseInt(cleanHex.substr(4, 2), 16);
	
	// Return the shadow CSS with 50% opacity
	return `hover:shadow-[0_0_0_2px_rgba(${r},${g},${b},0.5)]`;
}

/**
 * Get hover shadow color for a node type, using the node definition if available
 */
export function getNodeHoverShadowColor(nodeType: string, nodeDefinition?: any): string {
	// If we have a node definition with a color, use it
	if (nodeDefinition?.ui?.color) {
		return generateHoverShadowFromColor(nodeDefinition.ui.color);
	}
	
	// Fallback to a default shadow for unknown node types
	return 'hover:shadow-[0_0_0_2px_rgba(156,163,175,0.5)]';
}