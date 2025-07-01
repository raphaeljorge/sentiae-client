import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { EditorFile, EditorState, TerminalSession, LayoutState } from '../types';

interface CodeEditorStore extends EditorState {
  // File operations
  openFile: (file: EditorFile) => void;
  closeFile: (path: string) => void;
  setActiveFile: (path: string | undefined) => void;
  updateFileContent: (path: string, content: string) => void;
  saveFile: (path: string) => Promise<void>;
  createFile: (file: EditorFile) => void;
  deleteFile: (path: string) => void;
  
  // Layout operations
  togglePanel: (panel: keyof LayoutState['panels']) => void;
  setContainerMode: (mode: 'fullpage' | 'modal' | 'drawer') => void;
  updateLayout: (updates: Partial<LayoutState>) => void;
  
  // Terminal operations
  addTerminalSession: (session: TerminalSession) => void;
  removeTerminalSession: (id: string) => void;
  setActiveTerminalSession: (id: string) => void;
}

const initialLayout: LayoutState = {
  containerMode: 'fullpage',
  dimensions: { width: 1200, height: 800 },
  panels: {
    explorer: { visible: true, width: 300 },
    terminal: { visible: false, height: 200 },
    search: { visible: false },
  },
  breakpoints: {
    showExplorer: 768,
    showTerminal: 600,
    enableSplitView: 1024,
  },
};

export const useCodeEditorStore = create<CodeEditorStore>()(
  immer((set, get) => ({
    // Initial state
    openFiles: [],
    activeFile: undefined,
    splitView: undefined,
    terminalSessions: [],
    layout: initialLayout,

    // File operations
    openFile: (file) =>
      set((state) => {
        const existingIndex = state.openFiles.findIndex(f => f.path === file.path);
        if (existingIndex >= 0) {
          // Update existing file but preserve dirty state if it was already dirty
          const existingFile = state.openFiles[existingIndex];
          const wasDirty = existingFile.isDirty;
          state.openFiles[existingIndex] = {
            ...file,
            isDirty: wasDirty, // Preserve the original dirty state
          };
        } else {
          // New file should not be dirty
          state.openFiles.push({
            ...file,
            isDirty: false,
          });
        }
      }),

    closeFile: (path) =>
      set((state) => {
        state.openFiles = state.openFiles.filter(f => f.path !== path);
        if (state.activeFile === path) {
          state.activeFile = state.openFiles[0]?.path;
        }
      }),

    setActiveFile: (path) =>
      set((state) => {
        state.activeFile = path;
      }),

    updateFileContent: (path, content) =>
      set((state) => {
        const file = state.openFiles.find(f => f.path === path);
        if (file) {
          file.content = content;
          file.isDirty = true;
          file.lastModified = new Date();
        }
      }),

    saveFile: async (path) => {
      set((state) => {
        const file = state.openFiles.find(f => f.path === path);
        if (file) {
          file.isDirty = false;
        }
      });
      // In a real implementation, this would save to a backend
      console.log('Saving file:', path);
    },

    createFile: (file) =>
      set((state) => {
        state.openFiles.push(file);
      }),

    deleteFile: (path) =>
      set((state) => {
        state.openFiles = state.openFiles.filter(f => f.path !== path);
        if (state.activeFile === path) {
          state.activeFile = state.openFiles[0]?.path;
        }
      }),

    // Layout operations
    togglePanel: (panel) =>
      set((state) => {
        state.layout.panels[panel].visible = !state.layout.panels[panel].visible;
      }),

    setContainerMode: (mode) =>
      set((state) => {
        state.layout.containerMode = mode;
      }),

    updateLayout: (updates) =>
      set((state) => {
        Object.assign(state.layout, updates);
      }),

    // Terminal operations
    addTerminalSession: (session) =>
      set((state) => {
        // Set all existing sessions to inactive
        for (const s of state.terminalSessions) {
          s.isActive = false;
        }
        state.terminalSessions.push(session);
      }),

    removeTerminalSession: (id) =>
      set((state) => {
        state.terminalSessions = state.terminalSessions.filter(s => s.id !== id);
      }),

    setActiveTerminalSession: (id) =>
      set((state) => {
        for (const s of state.terminalSessions) {
          s.isActive = s.id === id;
        }
      }),
  }))
); 