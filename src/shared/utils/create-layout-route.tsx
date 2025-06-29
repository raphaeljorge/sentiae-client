import { LayoutWrapper } from '@/widgets/layout-wrapper';
import type { LayoutConfig } from '@/shared/types/layout';
import type { ComponentType } from 'react';

/**
 * Utility function to create a route component with layout configuration
 * @param PageComponent - The page component to render
 * @param layoutConfig - The layout configuration for this route
 * @returns A component that wraps the page with the specified layout
 */
export function createLayoutRoute<T = {}>(
  PageComponent: ComponentType<T>,
  layoutConfig: LayoutConfig
) {
  return function LayoutRoute(props: T) {
    return (
      <LayoutWrapper layout={layoutConfig}>
        <PageComponent {...props} />
      </LayoutWrapper>
    );
  };
}

/**
 * Predefined layout configurations for common use cases
 */
export const LAYOUT_CONFIGS = {
  SIDEBAR_INSET: { type: 'sidebar', variant: 'inset' } as const,
  SIDEBAR_DEFAULT: { type: 'sidebar', variant: 'default' } as const,
  SIDEBAR_FLOATING: { type: 'sidebar', variant: 'floating' } as const,
  HEADER_INSET: { type: 'header', variant: 'inset' } as const,
  HEADER_DEFAULT: { type: 'header', variant: 'default' } as const,
  HEADER_FLOATING: { type: 'header', variant: 'floating' } as const,
  NONE: { type: 'none' } as const,
} as const;