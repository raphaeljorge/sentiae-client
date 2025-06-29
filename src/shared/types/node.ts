export interface NodeType {
  id: string;
  name: string;
  description: string;
  category: NodeCategory;
  icon?: string;
}

export type NodeCategory = 'core' | 'auth' | 'database' | 'logic' | 'ai' | 'integration';