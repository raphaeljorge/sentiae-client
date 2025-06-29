import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EditorPage } from '@/pages/editor';

const editorSearchSchema = z.object({
  id: z.string().catch(''),
});

// Editor pages don't use the layout wrapper - they have their own layout
function EditorPageWithoutLayout() {
  return <EditorPage />;
}

export const Route = createFileRoute('/editor')({
  validateSearch: editorSearchSchema,
  component: EditorPageWithoutLayout,
});