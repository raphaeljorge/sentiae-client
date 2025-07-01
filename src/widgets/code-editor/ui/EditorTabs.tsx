import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { EditorFile } from '../types';

interface EditorTabsProps {
  files: EditorFile[];
  activeFile?: string;
  onSelectFile: (path: string) => void;
  onCloseFile: (path: string) => void;
}

export function EditorTabs({ files, activeFile, onSelectFile, onCloseFile }: EditorTabsProps) {
  const handleCloseFile = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    onCloseFile(path);
  };

  const getFileDisplayName = (path: string) => {
    return path.split('/').pop() || path;
  };

  const getFileIcon = (language: string) => {
    const iconMap: Record<string, string> = {
      'javascript': '🟨',
      'typescript': '🔷',
      'python': '🐍',
      'html': '🌐',
      'css': '🎨',
      'json': '📄',
      'markdown': '📝',
    };
    return iconMap[language] || '📄';
  };

  return (
    <div className="flex items-center border-b bg-muted/30 overflow-x-auto">
      {files.map((file) => (
        <div
          key={file.path}
          className={cn(
            'flex items-center gap-2 px-3 py-2 border-r cursor-pointer hover:bg-muted/50 min-w-0 flex-shrink-0',
            activeFile === file.path && 'bg-background border-b-0'
          )}
          onClick={() => onSelectFile(file.path)}
        >
          <span className="text-sm flex-shrink-0">
            {getFileIcon(file.language)}
          </span>
          <span className="text-sm truncate max-w-32">
            {getFileDisplayName(file.path)}
          </span>
          {file.isDirty && (
            <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full bg-orange-500" />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
            onClick={(e) => handleCloseFile(e, file.path)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
} 