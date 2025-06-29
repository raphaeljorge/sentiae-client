import type { NodeCategory } from '@/shared/types/node';

export const NODE_CATEGORIES: Record<NodeCategory, string> = {
  core: 'Core',
  auth: 'Authentication',
  database: 'Database',
  logic: 'Logic',
  ai: 'AI & ML',
  integration: 'Integration',
};