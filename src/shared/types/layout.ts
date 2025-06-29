export type LayoutType = 'sidebar' | 'header' | 'none';

export interface LayoutConfig {
  type: LayoutType;
  variant?: 'default' | 'inset' | 'floating';
}

// Route context for layout configuration
export interface RouteLayoutContext {
  layout: LayoutConfig;
}