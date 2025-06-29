import { createFileRoute } from '@tanstack/react-router';
import { WorkspacePage } from '@/pages/workspace';
import { LayoutWrapper } from '@/widgets/layout-wrapper';
import type { LayoutConfig } from '@/shared/types/layout';

const layoutConfig: LayoutConfig = {
  type: 'header',
  variant: 'inset'
};

function WorkspacePageWithLayout() {
  return (
    <LayoutWrapper layout={layoutConfig}>
      <WorkspacePage />
    </LayoutWrapper>
  );
}

export const Route = createFileRoute('/workspace')({
  component: WorkspacePageWithLayout,
});