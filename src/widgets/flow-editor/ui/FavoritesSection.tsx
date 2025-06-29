import { motion, AnimatePresence } from 'motion/react';
import { NodeCard } from './NodeCard';
import { cn } from '@/shared/lib/utils';
import type { NodeType } from '@/shared/types/node';
import type { Transition } from 'motion/react';

interface FavoritesSectionProps {
  favorites: NodeType[];
  favoriteNodes: Set<string>;
  togglingGroup: 'favorites' | 'regular' | null;
  transition: Transition;
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
  onToggleFavorite: (nodeId: string, event: React.MouseEvent) => void;
}

export function FavoritesSection({
  favorites,
  favoriteNodes,
  togglingGroup,
  transition,
  onDragStart,
  onToggleFavorite,
}: FavoritesSectionProps) {
  return (
    <div className="p-4">
      <AnimatePresence>
        {favorites.length > 0 && (
          <motion.div
            layout
            key="favorites-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            <motion.p
              layout
              className="font-medium px-3 text-neutral-500 dark:text-neutral-300 text-sm mb-2"
            >
              Favorites
            </motion.p>
            <div
              className={cn(
                'space-y-2 relative',
                togglingGroup === 'favorites' ? 'z-5' : 'z-10'
              )}
            >
              {favorites.map((node) => (
                <NodeCard
                  key={`favorites-${node.id}`}
                  node={node}
                  isFavorited={favoriteNodes.has(node.id)}
                  layoutId={`node-favorites-${node.id}`}
                  transition={transition}
                  onDragStart={onDragStart}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}