import { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { EditorFile } from '../types';

interface MonacoEditorProps {
  file: EditorFile;
  onChange?: (value: string | undefined) => void;
  onMount?: (editor: any, monaco: any) => void;
}

export function MonacoEditor({ file, onChange, onMount }: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    onMount?.(editor, monaco);

    // Configure editor settings
    editor.updateOptions({
      fontSize: 14,
      fontFamily: '"Fira Code", "Cascadia Code", "JetBrains Mono", monospace',
      fontLigatures: true,
      minimap: { enabled: true },
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      smoothScrolling: true,
    });

    // Set up keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save file
      console.log('Save file shortcut');
    });
  };

  // Update editor content when file changes
  useEffect(() => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== file.content) {
        editorRef.current.setValue(file.content);
        // Set cursor to beginning of file
        editorRef.current.setPosition({ lineNumber: 1, column: 1 });
      }
    }
  }, [file.path, file.content]);

  const handleEditorChange = (value: string | undefined) => {
    onChange?.(value);
  };

  return (
    <div className="h-full w-full">
      <Editor
        key={file.path} // Force re-render when file changes
        height="100%"
        language={file.language}
        value={file.content}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
      />
    </div>
  );
} 