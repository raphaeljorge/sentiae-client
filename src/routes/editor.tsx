import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EditorPage } from '@/pages/editor';
import { LayoutWrapper } from '@/widgets/layout-wrapper';
import type { LayoutConfig } from '@/shared/types/layout';

const editorSearchSchema = z.object({
  id: z.string().catch(''),
});

const layoutConfig: LayoutConfig = {
  type: 'header',
  variant: 'inset'
};

function EditorPageWithLayout() {
  return (
    <LayoutWrapper layout={layoutConfig}>
      <EditorPage />
    </LayoutWrapper>
  );
}

export const Route = createFileRoute('/editor')({
  validateSearch: editorSearchSchema,
  component: EditorPageWithLayout,
});