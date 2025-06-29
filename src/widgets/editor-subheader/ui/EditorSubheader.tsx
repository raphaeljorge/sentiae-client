import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { Play, Save, Menu, X, Workflow, Clock, CheckCircle, AlertCircle, Square, Command, PanelLeft } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import { motion, type Variants, type Transition } from 'framer-motion';

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

const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: {
    rest: { maxWidth: '40px' },
    hover: {
      maxWidth: '140px',
      transition: { type: 'spring', stiffness: 200, damping: 35, delay: 0.15 },
    },
    tap: { scale: 0.95 },
  },
  transition: { type: 'spring', stiffness: 250, damping: 25 },
} as const;

const LABEL_VARIANTS: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: 'visible' },
  tap: { opacity: 1, x: 0, visibility: 'visible' },
};

const LABEL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
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
          <motion.button
            {...BUTTON_MOTION_CONFIG}
            onClick={onTogglePalette}
            className="flex h-8 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-200/60 dark:bg-neutral-600/80 px-2 py-1.5 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-300/60 dark:hover:bg-neutral-500/80 transition-colors"
            aria-label="Toggle Node Palette"
          >
            <PanelLeft className="h-4 w-4 shrink-0" />
            <motion.span
              variants={LABEL_VARIANTS}
              transition={LABEL_TRANSITION}
              className="invisible text-xs font-medium"
            >
              Node Palette
            </motion.span>
          </motion.button>
          
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
          
          <motion.button
            whileTap={{ scale: 0.975 }}
            onClick={onRun}
            disabled={isRunning}
            className="flex w-full h-8 text-xs cursor-pointer items-center justify-center rounded-lg bg-teal-500 dark:bg-teal-600/80 px-3 py-1.5 text-white transition-colors duration-300 dark:hover:bg-teal-800 hover:bg-teal-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-1 text-neutral-200">
              {isRunning ? 'Running...' : 'Run'}
            </span>
            <span>{isRunning ? 'Flow' : 'Flow'}</span>
            <div className="mx-2 h-4 w-px bg-white/40 rounded-full" />
            <div className="flex items-center gap-1 rounded-md bg-white/20 px-1.5 py-0.5 -mr-1">
              <Command className="h-3 w-3" />
              {isRunning ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}