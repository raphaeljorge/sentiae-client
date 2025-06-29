import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { Play, Save, Menu, X, Workflow, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface EditorSubheaderProps {
  workflowName?: string;
  isRunning?: boolean;
  lastRun?: string;
  status?: 'idle' | 'running' | 'success' | 'error';
  errorCount?: number;
  isPaletteOpen?: boolean;
  onRun?: () => void;
  onSave?: () => void;
  onTogglePalette?: () => void;
}

const statusConfig = {
  idle: {
    icon: Clock,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Ready'
  },
  running: {
    icon: Play,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    label: 'Running'
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    label: 'Success'
  },
  error: {
    icon: AlertCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    label: 'Error'
  }
};

export function EditorSubheader({
  workflowName = 'Untitled Workflow',
  isRunning = false,
  lastRun,
  status = 'idle',
  errorCount = 0,
  isPaletteOpen = false,
  onRun,
  onSave,
  onTogglePalette,
}: EditorSubheaderProps) {
  const currentStatus = isRunning ? 'running' : status;
  const StatusIcon = statusConfig[currentStatus].icon;

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side - Workflow info and status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold truncate max-w-[300px]">
              {workflowName}
            </h1>
          </div>
          
          <Separator orientation="vertical" className="h-6" />
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium",
              statusConfig[currentStatus].bgColor
            )}>
              <StatusIcon className={cn("h-3 w-3", statusConfig[currentStatus].color)} />
              <span className={statusConfig[currentStatus].color}>
                {statusConfig[currentStatus].label}
              </span>
            </div>
            
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} error{errorCount !== 1 ? 's' : ''}
              </Badge>
            )}
            
            {lastRun && !isRunning && (
              <span className="text-xs text-muted-foreground">
                Last run: {lastRun}
              </span>
            )}
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePalette}
            className="flex items-center gap-2"
          >
            {isPaletteOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            Nodes
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>
      </div>
    </div>
  );
}