import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { LayoutWrapper } from '@/widgets/layout-wrapper';
import { Toaster } from '@/shared/ui/toaster';
import type { LayoutConfig } from '@/shared/types/layout';

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools />
      </ThemeProvider>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});