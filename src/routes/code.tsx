import { createFileRoute } from '@tanstack/react-router';
import { CodeEditor } from '@/widgets/code-editor';
import type { EditorFile } from '@/widgets/code-editor/types';

function CodeEditorDemo() {
  const handleContentChange = (filePath: string, content: string) => {
    console.log('File changed:', filePath, content.length, 'characters');
  };

  const handleFileChange = (files: EditorFile[]) => {
    console.log('Files updated:', files.map(f => f.path));
  };

  return (
    <div className="h-screen w-full">
      <CodeEditor
        containerMode="fullpage"
        onContentChange={handleContentChange}
        onFileChange={handleFileChange}
        className="border rounded-lg"
      />
    </div>
  );
}

export const Route = createFileRoute('/code')({
  component: CodeEditorDemo,
}); 