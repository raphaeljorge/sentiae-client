import { EditorPage } from '@/pages/editor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor')({
  component: EditorPage,
})