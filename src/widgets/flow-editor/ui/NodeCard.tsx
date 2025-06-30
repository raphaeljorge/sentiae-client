import { motion } from 'framer-motion';
import { Package, Star, CheckCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { IconButton } from '@/shared/ui/icon-button';
import { cn } from '@/shared/lib/utils';
import { NodeTooltipContent } from './NodeTooltipContent';
import type { NodeType } from '@/shared/types/node';
import type { Transition } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface NodeCardProps {
  node: NodeType;
  isFavorited: boolean;
  layoutId: string;
  transition: Transition;
  onDragStart: (event: any, nodeType: NodeType) => void;
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
}: NodeCardProps) {
  const Icon = (LucideIcons as any)[node.ui.icon] || Package;
  const isCore = node.metadata?.author === 'core';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          layoutId={layoutId}
          transition={transition}
          draggable
          onDragStart={(e) => onDragStart(e, node)}
          className="flex items-center gap-3 rounded-lg bg-card border p-2 cursor-move hover:bg-accent hover:border-accent-foreground transition-colors group"
        >
          <div className="rounded-md bg-muted p-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold truncate">{node.name}</div>
              <div className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-mono">
                v{node.version}
              </div>
            </div>
            <div className="text-xs text-muted-foreground font-medium truncate flex items-center gap-1.5">
              <span>{node.metadata?.author}</span>
              {isCore && <CheckCircle className="h-3 w-3 text-green-500" />}
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