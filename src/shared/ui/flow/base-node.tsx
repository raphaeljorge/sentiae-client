import { cn, getNodeBorderColor, getNodeHoverBorderColor, getNodeHoverShadowColor } from '@/shared/lib/utils';
import React from 'react';

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    selected?: boolean;
    nodeType?: string;
    nodeDefinition?: any;
  }
>(({ className, selected, nodeType, nodeDefinition, ...props }, ref) => {
  const borderColor = getNodeBorderColor(nodeType || '', nodeDefinition);
  const hoverBorderColor = getNodeHoverBorderColor(nodeType || '', nodeDefinition);
  const hoverShadowColor = getNodeHoverShadowColor(nodeType || '', nodeDefinition);

  return (
    <div
      ref={ref}
      className={cn(
        'relative rounded-md border-2 bg-card p-5 text-card-foreground transition-all duration-100',
        borderColor,
        hoverBorderColor,
        hoverShadowColor,
        'hover:shadow-lg',
        selected ? 'border-muted-foreground shadow-lg' : '',
        className,
      )}
      tabIndex={0} // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
      {...props}
    />
  );
});
BaseNode.displayName = 'BaseNode';
