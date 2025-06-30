import { memo } from 'react';
import { BaseNode } from './base-node';
import type { NodeProps } from '@xyflow/react';

// Using BaseNode for a consistent look
function HttpRequestNode(props: NodeProps) {
  return <BaseNode {...props} />;
}

// Controller that wraps the node with generic state and logic
export const HttpRequestNodeController = memo(HttpRequestNode); 