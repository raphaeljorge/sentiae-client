export interface EditorFile {
  path: string;
  content: string;
  language: string;
  isDirty: boolean;
  lastModified: Date;
}

export interface EditorState {
  openFiles: EditorFile[];
  activeFile?: string;
  splitView?: {
    orientation: 'horizontal' | 'vertical';
    files: [string, string];
  };
  terminalSessions: TerminalSession[];
  layout: LayoutState;
}

export interface LayoutState {
  containerMode: 'fullpage' | 'modal' | 'drawer';
  dimensions: { width: number; height: number };
  panels: {
    explorer: { visible: boolean; width: number };
    terminal: { visible: boolean; height: number };
    search: { visible: boolean };
  };
  breakpoints: {
    showExplorer: number;
    showTerminal: number;
    enableSplitView: number;
  };
}

export interface TerminalSession {
  id: string;
  title: string;
  cwd: string;
  isActive: boolean;
}

export interface CodeEditorProps {
  initialFiles?: EditorFile[];
  containerMode?: 'fullpage' | 'modal' | 'drawer';
  onContentChange?: (file: string, content: string) => void;
  onFileChange?: (files: EditorFile[]) => void;
  className?: string;
} 