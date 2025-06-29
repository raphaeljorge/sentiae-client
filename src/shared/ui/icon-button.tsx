import * as React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: [number, number, number];
}

export function IconButton({
  icon: Icon,
  active = false,
  size = 'md',
  color = [156, 163, 175],
  className,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const [r, g, b] = color;
  const colorStyle = active ? { color: `rgb(${r}, ${g}, ${b})` } : undefined;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeClasses[size],
        className
      )}
      style={colorStyle}
      {...props}
    >
      <Icon className={iconSizes[size]} />
    </button>
  );
}