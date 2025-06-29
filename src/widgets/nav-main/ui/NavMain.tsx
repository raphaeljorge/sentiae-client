import { MailIcon, PlusCircleIcon, BriefcaseIcon, type LucideIcon } from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/ui/sidebar';

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const router = useRouter();

  const handleNavigateToWorkspace = () => {
    if ('startViewTransition' in document && document.startViewTransition) {
      document.startViewTransition(() => {
        router.navigate({ to: '/workspace' });
      });
    } else {
      router.navigate({ to: '/workspace' });
    }
  };

  const handleNavigation = (url: string) => {
    if ('startViewTransition' in document && document.startViewTransition) {
      document.startViewTransition(() => {
        router.navigate({ to: url });
      });
    } else {
      router.navigate({ to: url });
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              style={{ viewTransitionName: 'quick-create-btn' }}
              onClick={handleNavigateToWorkspace}
            >
              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon className="h-4 w-4" />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => handleNavigation(item.url)}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          {/* Add Workspace to the menu */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              tooltip="Workspace"
              onClick={handleNavigateToWorkspace}
            >
              <BriefcaseIcon />
              <span>Workspace</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}