import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { EditorPage } from '@/pages/editor';

const editorSearchSchema = z.object({
  id: z.string().catch(''),
});

export const Route = createFileRoute('/editor')({
  validateSearch: editorSearchSchema,
  component: () => <EditorPage />,
}); 