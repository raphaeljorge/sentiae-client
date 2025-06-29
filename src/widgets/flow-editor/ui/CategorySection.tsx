import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';
import { NodeCard } from './NodeCard';
import { cn } from '@/shared/lib/utils';
import {
  Package,
  Shield,
  Database,
  Zap,
  Brain,
  Link,
} from 'lucide-react';
import type { NodeType, NodeCategory } from '@/shared/types/node';
import type { Transition } from 'motion/react';
import { NODE_CATEGORIES } from '@/shared/constants/node-categories';

const categoryIcons = {
  core: Package,
  auth: Shield,
  database: Database,
  logic: Zap,
  ai: Brain,
  integration: Link,
};

interface CategorySectionProps {
  nodesByCategory: Record<NodeCategory, NodeType[]>;
  categoriesWithNodes: NodeCategory[];
  favoriteNodes: Set<string>;
  openAccordions: string[];
  togglingGroup: 'favorites' | 'regular' | null;
  transition: Transition;
  onValueChange: (value: string[]) => void;
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
  onToggleFavorite: (nodeId: string, event: React.MouseEvent) => void;
}

export function CategorySection({
  nodesByCategory,
  categoriesWithNodes,
  favoriteNodes,
  openAccordions,
  togglingGroup,
  transition,
  onValueChange,
  onDragStart,
  onToggleFavorite,
}: CategorySectionProps) {
  return (
    <div
      className={cn(
        'space-y-1 relative p-4',
        togglingGroup === 'regular' ? 'z-5' : 'z-10'
      )}
    >
      <Accordion
        type="multiple"
        value={openAccordions}
        onValueChange={onValueChange}
        className="space-y-1"
      >
        {categoriesWithNodes.map((category) => {
          const Icon = categoryIcons[category];
          const nodes = nodesByCategory[category];

          return (
            <AccordionItem 
              key={category} 
              value={category}
              className="border bg-background rounded-none"
            >
              <AccordionTrigger className="px-3 py-2 hover:no-underline rounded-none text-sm">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-primary/10">
                    <Icon className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-medium">{NODE_CATEGORIES[category]}</span>
                  <Badge variant="outline" className="text-xs h-4 px-1">
                    {nodes.length}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-2">
                <div className="space-y-2 pt-2">
                  {nodes.map((node) => {
                    const isFavorited = favoriteNodes.has(node.id);
                    return (
                      <NodeCard
                        key={`category-${category}-${node.id}`}
                        node={node}
                        isFavorited={isFavorited}
                        layoutId={`node-category-${category}-${node.id}`}
                        transition={transition}
                        onDragStart={onDragStart}
                        onToggleFavorite={onToggleFavorite}
                        showGripHandle={true}
                      />
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}