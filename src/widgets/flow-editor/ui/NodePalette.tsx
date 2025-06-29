import { useState, useEffect } from 'react';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { LayoutGroup } from 'motion/react';
import { MOCK_NODE_TYPES } from '../data/mockNodeTypes';
import { PaletteHeader } from './PaletteHeader';
import { FavoritesSection } from './FavoritesSection';
import { CategorySection } from './CategorySection';
import { EmptyState } from './EmptyState';
import { NodeSchemaExamples } from './NodeSchemaExamples';
import type { NodeType, NodeCategory } from '@/shared/types/node';
import type { Transition } from 'motion/react';

// Animation configuration
const TRANSITION: Transition = {
  stiffness: 320,
  damping: 20,
  mass: 0.8,
  type: 'spring'
};

interface NodePaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NodePalette({ isOpen, onClose }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState<string[]>(['favorites', 'core']);
  const [favoriteNodes, setFavoriteNodes] = useState<Set<string>>(new Set(['http-request', 'if-condition', 'json-node']));
  const [togglingGroup, setTogglingGroup] = useState<'favorites' | 'regular' | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Add initialization delay to ensure proper rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // Filter nodes based on search query
  const filteredNodes = MOCK_NODE_TYPES.filter((node) => {
    const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Get favorites (nodes that are favorited)
  const favorites = filteredNodes.filter(node => favoriteNodes.has(node.id));

  // Group ALL filtered nodes by category (including favorited ones)
  const nodesByCategory = filteredNodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<NodeCategory, NodeType[]>);

  // Get categories that have nodes (for search filtering)
  const categoriesWithNodes = Object.keys(nodesByCategory) as NodeCategory[];

  const handleDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType.id);
    event.dataTransfer.effectAllowed = 'move';
  };

  const toggleFavorite = (nodeId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent drag start

    const isFavorited = favoriteNodes.has(nodeId);
    setTogglingGroup(isFavorited ? 'favorites' : 'regular');

    setFavoriteNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });

    // Reset group z-index after animation
    setTimeout(() => setTogglingGroup(null), 500);
  };

  if (!isOpen) return null;

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-lg">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-xs text-muted-foreground">Loading palette...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-lg flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Node Palette</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>

        <PaletteHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
          <div className="relative">
            <LayoutGroup>
              <FavoritesSection
                favorites={favorites}
                favoriteNodes={favoriteNodes}
                togglingGroup={togglingGroup}
                transition={TRANSITION}
                onDragStart={handleDragStart}
                onToggleFavorite={toggleFavorite}
              />

              {/* Regular Categories or Empty State */}
              {(favorites.length === 0 && categoriesWithNodes.length === 0) ? (
                <EmptyState />
              ) : (
                <CategorySection
                  nodesByCategory={nodesByCategory}
                  categoriesWithNodes={categoriesWithNodes}
                  favoriteNodes={favoriteNodes}
                  openAccordions={openAccordions}
                  togglingGroup={togglingGroup}
                  transition={TRANSITION}
                  onValueChange={setOpenAccordions}
                  onDragStart={handleDragStart}
                  onToggleFavorite={toggleFavorite}
                />
              )}
            </LayoutGroup>
          </div>
        </div>

        {/* Node Schema Examples */}
        <div className="border-t border-border p-4">
          <NodeSchemaExamples />
        </div>
      </div>
    </TooltipProvider>
  );
}