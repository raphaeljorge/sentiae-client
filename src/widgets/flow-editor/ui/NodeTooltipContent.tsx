import type { NodeType } from '@/shared/types/node';

interface NodeTooltipContentProps {
  node: NodeType;
}

export function NodeTooltipContent({ node }: NodeTooltipContentProps) {
  return (
    <div className="space-y-2">
      <div className="font-semibold">{node.name}</div>
      <div className="text-sm text-muted-foreground">{node.description}</div>
      <div className="text-xs text-muted-foreground">
        Category: {node.category}
      </div>
    </div>
  );
}