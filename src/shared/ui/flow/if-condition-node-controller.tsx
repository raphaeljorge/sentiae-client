import { memo } from 'react';
import { BaseNode } from './base-node';
import type { NodeProps } from '@xyflow/react';

function IfConditionNode(props: NodeProps) {
  return <BaseNode {...props} />;
}

export const IfConditionNodeController = memo(IfConditionNode); 