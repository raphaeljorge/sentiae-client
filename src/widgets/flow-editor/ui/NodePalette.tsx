import * as React from 'react';
import { useState } from 'react';
import { Search, Star, Bot, PenLine, Eye, FileText, Zap, Database, Code, Workflow } from 'lucide-react';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { Badge } from '@/shared/ui/badge';
import { PinList } from '@/shared/ui/pin-list';
import { cn } from '@/shared/lib/utils';

interface NodeType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  isFavorite?: boolean;
}

const nodeTypes: NodeType[] = [
  {
    id: 'text-input',
    name: 'Text Input',
    description: 'Input text data into the workflow',
    icon: PenLine,
    category: 'Input/Output',
  },
  {
    id: 'visualize-text',
    name: 'Visualize Text',
    description: 'Display and visualize text content',
    icon: Eye,
    category: 'Input/Output',
  },
  {
    id: 'generate-text',
    name: 'Generate Text',
    description: 'Generate text using AI models',
    icon: Bot,
    category: 'AI & ML',
    isFavorite: true,
  },
  {
    id: 'prompt-crafter',
    name: 'Prompt Crafter',
    description: 'Create dynamic prompts with templates',
    icon: FileText,
    category: 'AI & ML',
    isFavorite: true,
  },
  // Additional node types for demonstration
  {
    id: 'http-request',
    name: 'HTTP Request',
    description: 'Make HTTP requests to external APIs',
    icon: Zap,
    category: 'Integration',
  },
  {
    id: 'database-query',
    name: 'Database Query',
    description: 'Query databases and retrieve data',
    icon: Database,
    category: 'Database',
  },
  {
    id: 'code-executor',
    name: 'Code Executor',
    description: 'Execute custom code snippets',
    icon: Code,
    category: 'Logic',
  },
  {
    id: 'workflow-trigger',
    name: 'Workflow Trigger',
    description: 'Trigger other workflows',
    icon: Workflow,
    category: 'Logic',
  },
];

const categories = [
  { name: 'Favorites', icon: Star, count: nodeTypes.filter(n => n.isFavorite).length, color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200' },
  { name: 'Input/Output', icon: PenLine, count: nodeTypes.filter(n => n.category === 'Input/Output').length, color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  { name: 'AI & ML', icon: Bot, count: nodeTypes.filter(n => n.category === 'AI & ML').length, color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
  { name: 'Logic', icon: Code, count: nodeTypes.filter(n => n.category === 'Logic').length, color: 'bg-green-500/10 text-green-600 border-green-200' },
  { name: 'Database', icon: Database, count: nodeTypes.filter(n => n.category === 'Database').length, color: 'bg-orange-500/10 text-orange-600 border-orange-200' },
  { name: 'Integration', icon: Zap, count: nodeTypes.filter(n => n.category === 'Integration').length, color: 'bg-pink-500/10 text-pink-600 border-pink-200' },
];

interface NodePaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NodePalette({ isOpen, onClose }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(
    new Set(nodeTypes.filter(n => n.isFavorite).map(n => n.id))
  );

  const filteredNodes = nodeTypes.filter(node =>
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNodesByCategory = (categoryName: string) => {
    if (categoryName === 'Favorites') {
      return filteredNodes.filter(node => favorites.has(node.id));
    }
    return filteredNodes.filter(node => node.category === categoryName);
  };

  const toggleFavorite = (nodeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(nodeId)) {
        newFavorites.delete(nodeId);
      } else {
        newFavorites.add(nodeId);
      }
      return newFavorites;
    });
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-80 bg-background border-r border-border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Node Palette</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes, categories, or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-auto p-4">
        <Accordion type="multiple" defaultValue={['Favorites', 'AI & ML', 'Input/Output']} className="w-full">
          {categories.map((category) => {
            const categoryNodes = getNodesByCategory(category.name);
            if (categoryNodes.length === 0 && searchQuery) return null;

            return (
              <AccordionItem key={category.name} value={category.name}>
                <AccordionTrigger className={cn(
                  "hover:no-underline rounded-lg border px-3 py-2 mb-2",
                  category.color
                )}>
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {categoryNodes.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-2 pt-2">
                  <PinList className="space-y-2">
                    {categoryNodes.map((node) => (
                      <div
                        key={node.id}
                        className={cn(
                          "group relative p-3 rounded-lg border cursor-grab transition-all duration-200",
                          "hover:shadow-md hover:scale-[1.02] hover:border-primary/20",
                          category.color.replace('/10', '/5').replace('text-', 'hover:text-'),
                          "bg-card hover:bg-accent/30"
                        )}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center transition-colors",
                            category.color.replace('/10', '/20')
                          )}>
                            <node.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium truncate">{node.name}</h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={cn(
                                  "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                  favorites.has(node.id) && "opacity-100"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(node.id);
                                }}
                              >
                                <Star 
                                  className={cn(
                                    "h-3 w-3",
                                    favorites.has(node.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  )} 
                                />
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </PinList>
                  {categoryNodes.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      No nodes found in this category
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {filteredNodes.length === 0 && searchQuery && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No nodes found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
</AccordionTrigger>