'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';

interface PinListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PinList({ className, children, ...props }: PinListProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  );
}