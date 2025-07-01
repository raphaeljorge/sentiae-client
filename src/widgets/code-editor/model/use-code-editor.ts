import { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import type { EditorFile, EditorState, TerminalSession } from '../types';
import { useCodeEditorStore } from './store';

export function useCodeEditor() {
  const {
    openFiles,
    activeFile,
    splitView,
    terminalSessions,
    layout,
    openFile,
    closeFile,
    setActiveFile,
    updateFileContent,
    saveFile,
    createFile,
    deleteFile,
    togglePanel,
    setContainerMode,
    updateLayout,
    addTerminalSession,
    removeTerminalSession,
    setActiveTerminalSession,
  } = useCodeEditorStore();

  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    monacoRef.current = { editor, monaco };
  }, []);

  const handleContentChange = useCallback((value: string | undefined) => {
    if (activeFile && value !== undefined) {
      updateFileContent(activeFile, value);
    }
  }, [activeFile, updateFileContent]);

  const getFileContent = useCallback((path: string): string => {
    const file = openFiles.find(f => f.path === path);
    return file?.content || '';
  }, [openFiles]);

  const getCurrentFile = useCallback((): EditorFile | undefined => {
    return openFiles.find(f => f.path === activeFile);
  }, [openFiles, activeFile]);

  const openFileByPath = useCallback((path: string, content?: string, language?: string) => {
    const existingFile = openFiles.find(f => f.path === path);
    
    if (existingFile) {
      setActiveFile(path);
    } else {
      const newFile: EditorFile = {
        path,
        content: content || '',
        language: language || getLanguageFromPath(path),
        isDirty: false,
        lastModified: new Date(),
      };
      openFile(newFile);
      setActiveFile(path);
    }
  }, [openFiles, openFile, setActiveFile]);

  const closeFileByPath = useCallback((path: string) => {
    const fileIndex = openFiles.findIndex(f => f.path === path);
    if (fileIndex === -1) return;

    closeFile(path);

    // Set new active file if we closed the active one
    if (path === activeFile) {
      if (openFiles.length > 1) {
        const nextIndex = fileIndex === openFiles.length - 1 ? fileIndex - 1 : fileIndex;
        const nextFile = openFiles[nextIndex === fileIndex ? nextIndex + 1 : nextIndex];
        if (nextFile) {
          setActiveFile(nextFile.path);
        }
      } else {
        setActiveFile(undefined);
      }
    }
  }, [openFiles, activeFile, closeFile, setActiveFile]);

  const saveCurrentFile = useCallback(async () => {
    if (activeFile) {
      await saveFile(activeFile);
    }
  }, [activeFile, saveFile]);

  const createNewFile = useCallback((path: string, content = '', language?: string) => {
    const newFile: EditorFile = {
      path,
      content,
      language: language || getLanguageFromPath(path),
      isDirty: false,
      lastModified: new Date(),
    };
    createFile(newFile);
    setActiveFile(path);
  }, [createFile, setActiveFile]);

  const createNewTerminal = useCallback((title?: string, cwd?: string) => {
    const session: TerminalSession = {
      id: nanoid(),
      title: title || `Terminal ${terminalSessions.length + 1}`,
      cwd: cwd || '/',
      isActive: true,
    };
    addTerminalSession(session);
    return session;
  }, [terminalSessions.length, addTerminalSession]);

  return {
    // State
    openFiles,
    activeFile,
    splitView,
    terminalSessions,
    layout,
    
    // Computed
    currentFile: getCurrentFile(),
    
    // File operations
    openFile: openFileByPath,
    closeFile: closeFileByPath,
    saveFile: saveCurrentFile,
    createFile: createNewFile,
    deleteFile,
    getFileContent,
    
    // Editor operations
    handleEditorDidMount,
    handleContentChange,
    setActiveFile,
    
    // Layout operations
    togglePanel,
    setContainerMode,
    updateLayout,
    
    // Terminal operations
    createTerminal: createNewTerminal,
    removeTerminal: removeTerminalSession,
    setActiveTerminal: setActiveTerminalSession,
    
    // Monaco ref
    monacoRef,
  };
}

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'rb': 'ruby',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'sass': 'sass',
    'less': 'less',
    'json': 'json',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'md': 'markdown',
    'sh': 'shell',
    'sql': 'sql',
  };
  
  return languageMap[ext || ''] || 'plaintext';
} 