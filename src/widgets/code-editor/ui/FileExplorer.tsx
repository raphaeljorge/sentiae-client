import { useState } from 'react';
import { Folder, File, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { useCodeEditor } from '../model/use-code-editor';

interface FileNode {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export function FileExplorer() {
  const { openFiles, activeFile, openFile, setActiveFile } = useCodeEditor();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  // Mock file tree - in a real app this would come from an API
  const fileTree: FileNode[] = [
    {
      path: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          path: 'src/components',
          name: 'components',
          type: 'folder',
          children: [
            { path: 'src/components/App.tsx', name: 'App.tsx', type: 'file' },
            { path: 'src/components/Header.tsx', name: 'Header.tsx', type: 'file' },
          ],
        },
        { path: 'src/main.tsx', name: 'main.tsx', type: 'file' },
        { path: 'src/index.css', name: 'index.css', type: 'file' },
      ],
    },
    { path: 'package.json', name: 'package.json', type: 'file' },
    { path: 'README.md', name: 'README.md', type: 'file' },
    { path: 'vite.config.ts', name: 'vite.config.ts', type: 'file' },
  ];

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleFileClick = (path: string) => {
    // Check if file is already open
    const existingFile = openFiles.find((f) => f.path === path);
    
    if (existingFile) {
      // If the file is already open, just re-open it to refresh the content
      openFile(path, existingFile.content, existingFile.language);
    } else {
      // File is not open, generate content and open it
      const ext = path.split('.').pop()?.toLowerCase();
      let content = '';
      let language = 'plaintext';

      switch (ext) {
        case 'tsx':
        case 'ts':
          language = 'typescript';
          content = `// ${path}\nimport React from 'react';\n\nexport default function Component() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}`;
          break;
        case 'css':
          language = 'css';
          content = `/* ${path} */\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: Arial, sans-serif;\n}`;
          break;
        case 'json':
          language = 'json';
          content = `{\n  "name": "example",\n  "version": "1.0.0",\n  "description": "Example project"\n}`;
          break;
        case 'md':
          language = 'markdown';
          content = `# ${path}\n\nThis is a markdown file.\n\n## Features\n\n- Feature 1\n- Feature 2`;
          break;
        default:
          content = `// ${path}\n\n// Your code here...`;
      }

      // Use the hook's openFile function which properly handles the file creation
      openFile(path, content, language);
    }
  };

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isOpen = openFiles.some((f) => f.path === node.path);
    const isActive = activeFile === node.path;
    const isDirty = openFiles.find((f) => f.path === node.path)?.isDirty;

    if (node.type === 'folder') {
      return (
        <div key={node.path}>
          <Collapsible open={isExpanded} onOpenChange={() => toggleFolder(node.path)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-6 px-2 text-left font-normal"
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                <Folder className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="truncate">{node.name}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {node.children?.map(child => renderFileNode(child, depth + 1))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    return (
      <Button
        key={node.path}
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start h-6 px-2 text-left font-normal"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => handleFileClick(node.path)}
      >
        <File className="h-4 w-4 mr-1 flex-shrink-0" />
        <span className="truncate">{node.name}</span>
        {isDirty && !isActive && (
          <div className="ml-auto w-1 h-1 bg-blue-500 rounded-full" />
        )}
      </Button>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b">
        <span className="text-sm font-medium">Explorer</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-1">
          {fileTree.map(node => renderFileNode(node))}
        </div>
      </ScrollArea>
    </div>
  );
} 