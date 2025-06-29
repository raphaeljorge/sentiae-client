import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/pages/dashboard';
import { LayoutWrapper } from '@/widgets/layout-wrapper';
import type { LayoutConfig } from '@/shared/types/layout';

const layoutConfig: LayoutConfig = {
  type: 'sidebar',
  variant: 'inset'
};

function DashboardPageWithLayout() {
  return (
    <LayoutWrapper layout={layoutConfig}>
      <DashboardPage />
    </LayoutWrapper>
  );
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPageWithLayout,
});