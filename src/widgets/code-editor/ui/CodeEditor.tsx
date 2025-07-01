import { useEffect, useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/shared/ui/resizable';
import { cn } from '@/shared/lib/utils';
import { useCodeEditor } from '../model/use-code-editor';
import type { CodeEditorProps } from '../types';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { MonacoEditor } from './MonacoEditor';
import { TerminalPanel } from './TerminalPanel';
import { CommandPalette } from './CommandPalette';
import { StatusBar } from './StatusBar';

export function CodeEditor({ 
  initialFiles = [], 
  containerMode = 'fullpage',
  onContentChange,
  onFileChange,
  className 
}: CodeEditorProps) {
  const {
    openFiles,
    activeFile,
    currentFile,
    layout,
    openFile,
    closeFile,
    setActiveFile,
    togglePanel,
    handleContentChange,
    handleEditorDidMount,
    createTerminal,
  } = useCodeEditor();

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Initialize with provided files
  useEffect(() => {
    for (const file of initialFiles) {
      openFile(file.path, file.content, file.language);
    }
  }, [initialFiles, openFile]);

  // Notify parent of file changes
  useEffect(() => {
    onFileChange?.(openFiles);
  }, [openFiles, onFileChange]);

  // Notify parent of content changes
  useEffect(() => {
    if (currentFile && onContentChange) {
      onContentChange(currentFile.path, currentFile.content);
    }
  }, [currentFile?.content, currentFile?.path, onContentChange]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        // Save current file
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        togglePanel('terminal');
        if (!layout.panels.terminal.visible) {
          createTerminal();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePanel, layout.panels.terminal.visible, createTerminal]);

  const showExplorer = layout.panels.explorer.visible && layout.dimensions.width >= layout.breakpoints.showExplorer;
  const showTerminal = layout.panels.terminal.visible && layout.dimensions.height >= layout.breakpoints.showTerminal;

  return (
    <div className={cn('h-full w-full flex flex-col bg-background', className)}>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* File Explorer */}
        {showExplorer && (
          <>
            <ResizablePanel 
              defaultSize={25} 
              minSize={15} 
              maxSize={40}
              className="border-r"
            >
              <FileExplorer />
            </ResizablePanel>
            <ResizableHandle />
          </>
        )}

        {/* Main Editor Area */}
        <ResizablePanel defaultSize={showExplorer ? 75 : 100} minSize={30}>
          <ResizablePanelGroup direction="vertical" className="h-full">
            {/* Editor */}
            <ResizablePanel 
              defaultSize={showTerminal ? 70 : 100} 
              minSize={30}
              className="flex flex-col"
            >
              {/* Editor Tabs */}
              {openFiles.length > 0 && (
                <EditorTabs
                  files={openFiles}
                  activeFile={activeFile}
                  onSelectFile={setActiveFile}
                  onCloseFile={closeFile}
                />
              )}

              {/* Monaco Editor */}
              <div className="flex-1 min-h-0">
                {currentFile ? (
                  <MonacoEditor
                    file={currentFile}
                    onChange={handleContentChange}
                    onMount={handleEditorDidMount}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <p className="text-lg font-medium">No file open</p>
                      <p className="text-sm">Open a file from the explorer or create a new one</p>
                      <p className="text-xs mt-2">Press Cmd+Shift+P to open command palette</p>
                    </div>
                  </div>
                )}
              </div>
            </ResizablePanel>

            {/* Terminal */}
            {showTerminal && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
                  <TerminalPanel />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <StatusBar file={currentFile} />

      {/* Command Palette */}
      <CommandPalette 
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  );
} 