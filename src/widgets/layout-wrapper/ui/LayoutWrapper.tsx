import * as React from 'react';
import { AppSidebar } from '@/widgets/app-sidebar';
import { TopHeader } from '@/widgets/top-header';
import { SidebarProvider, SidebarInset } from '@/shared/ui/sidebar';
import type { LayoutConfig } from '@/shared/types/layout';

interface LayoutWrapperProps {
  children: React.ReactNode;
  layout: LayoutConfig;
}

export function LayoutWrapper({ children, layout }: LayoutWrapperProps) {
  switch (layout.type) {
    case 'sidebar':
      return (
        <SidebarProvider>
          <AppSidebar variant={layout.variant === 'inset' ? 'inset' : 'sidebar'} />
          <SidebarInset>
            {children}
          </SidebarInset>
        </SidebarProvider>
      );

    case 'header':
      return (
        <SidebarProvider>
          <div className="group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar">
            {/* Hidden peer sidebar for CSS targeting */}
            <div className="peer" data-variant="inset" style={{ display: 'none' }} />
            <div className="flex flex-col flex-1 overflow-hidden md:peer-data-[variant=inset]:rounded-xl">
              <TopHeader />
              <SidebarInset className="flex-1 rounded-t-none">
                {children}
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      );

    default:
      return <>{children}</>;
  }
}