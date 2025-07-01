import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import type { EditorFile } from '../types';

interface StatusBarProps {
  file?: EditorFile;
}

export function StatusBar({ file }: StatusBarProps) {
  if (!file) {
    return (
      <div className="h-6 bg-muted/50 border-t flex items-center justify-between px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">No file selected</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Ready</span>
        </div>
      </div>
    );
  }

  const getLanguageDisplayName = (language: string) => {
    const displayNames: Record<string, string> = {
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'python': 'Python',
      'html': 'HTML',
      'css': 'CSS',
      'json': 'JSON',
      'markdown': 'Markdown',
      'plaintext': 'Plain Text',
    };
    return displayNames[language] || language;
  };

  return (
    <div className="h-6 bg-muted/50 border-t flex items-center justify-between px-2 text-xs">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">{file.path}</span>
        {file.isDirty && (
          <Badge variant="secondary" className="h-4 text-xs">
            Modified
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-4 px-1 text-xs"
        >
          {getLanguageDisplayName(file.language)}
        </Button>
        <span className="text-muted-foreground">
          UTF-8
        </span>
        <span className="text-muted-foreground">
          LF
        </span>
        <span className="text-muted-foreground">
          Last modified: {file.lastModified.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
} 