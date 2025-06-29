import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/pages/home';
import { LayoutWrapper } from '@/widgets/layout-wrapper';
import type { LayoutConfig } from '@/shared/types/layout';

const layoutConfig: LayoutConfig = {
  type: 'sidebar',
  variant: 'inset'
};

function HomePageWithLayout() {
  return (
    <LayoutWrapper layout={layoutConfig}>
      <HomePage />
    </LayoutWrapper>
  );
}

export const Route = createFileRoute('/')({
  component: HomePageWithLayout,
});