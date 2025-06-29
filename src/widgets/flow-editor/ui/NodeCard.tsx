import { motion } from 'motion/react';
import { Package } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { IconButton } from '@/shared/ui/icon-button';
import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { NodeTooltipContent } from './NodeTooltipContent';
import type { NodeType } from '@/shared/types/node';
import type { Transition } from 'motion/react';

interface NodeCardProps {
  node: NodeType;
  isFavorited: boolean;
  layoutId: string;
  transition: Transition;
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
  onToggleFavorite: (nodeId: string, event: React.MouseEvent) => void;
  showGripHandle?: boolean;
}

export function NodeCard({
  node,
  isFavorited,
  layoutId,
  transition,
  onDragStart,
  onToggleFavorite,
  showGripHandle = false,
}: NodeCardProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          layoutId={layoutId}
          transition={transition}
          draggable
          onDragStart={(e) => onDragStart(e, node)}
          className="flex items-center gap-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 p-2 cursor-move hover:bg-accent transition-colors group"
        >
          <div className="rounded-lg bg-background p-2">
            <Package className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{node.name}</div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
              {node.description}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <IconButton
              icon={Star}
              active={isFavorited}
              onClick={(e) => onToggleFavorite(node.id, e)}
              size="sm"
              color={isFavorited ? [255, 193, 7] : [156, 163, 175]} // Gold for favorites, gray for non-favorites
              className={cn(
                "!bg-transparent hover:!bg-transparent transition-opacity",
                isFavorited ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
            />
          </div>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="right" className="p-3">
        <NodeTooltipContent node={node} />
      </TooltipContent>
    </Tooltip>
  );
}