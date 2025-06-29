import * as React from 'react';
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  BellIcon,
  CameraIcon,
  ChevronsUpDown,
  ClipboardListIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  MoreVerticalIcon,
  PlusCircleIcon,
  SearchIcon,
  SettingsIcon,
  UserCircleIcon,
  UsersIcon,
  BriefcaseIcon,
} from 'lucide-react';
import { useRouter } from '@tanstack/react-router';

import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import { Separator } from '@/shared/ui/separator';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Home',
      url: '/',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Workspace',
      url: '/workspace',
      icon: BriefcaseIcon,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: ListIcon,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: BarChartIcon,
    },
    {
      title: 'Projects',
      url: '#',
      icon: FolderIcon,
    },
    {
      title: 'Team',
      url: '#',
      icon: UsersIcon,
    },
  ],
  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: DatabaseIcon,
    },
    {
      name: 'Reports',
      url: '#',
      icon: ClipboardListIcon,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: FileIcon,
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '#',
      icon: SettingsIcon,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: HelpCircleIcon,
    },
    {
      title: 'Search',
      url: '#',
      icon: SearchIcon,
    },
  ],
};

export function TopHeader() {
  const router = useRouter();

  const handleNavigation = (url: string) => {
    if (url === '#') return;
    
    if ('startViewTransition' in document && document.startViewTransition) {
      document.startViewTransition(() => {
        router.navigate({ to: url });
      });
    } else {
      router.navigate({ to: url });
    }
  };

  return (
    <header 
      className="flex h-16 shrink-0 items-center gap-2 border-b bg-sidebar transition-all duration-300 ease-in-out px-4"
      style={{ viewTransitionName: 'sidebar-header' }}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side - Logo/Brand and Main Navigation */}
        <div className="flex items-center gap-4">
          {/* User Avatar - morphs from sidebar */}
          <div 
            className="flex items-center gap-2"
            style={{ viewTransitionName: 'user-avatar' }}
          >
            <Avatar className="h-8 w-8 rounded-lg grayscale">
              <AvatarImage src={data.user.avatar} alt={data.user.name} />
              <AvatarFallback className="rounded-lg">CN</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <span className="text-sm font-medium">{data.user.name}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Quick Create Button - morphs from sidebar */}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            style={{ viewTransitionName: 'quick-create-btn' }}
          >
            <PlusCircleIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Quick Create</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="hidden sm:flex"
          >
            <MailIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Center - Main Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {data.navMain.map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => handleNavigation(item.url)}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Button>
          ))}
        </nav>

        {/* Right side - Actions and User Menu */}
        <div className="flex items-center gap-2">
          {/* Documents Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <DatabaseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {data.documents.map((doc) => (
                <DropdownMenuItem key={doc.name}>
                  <doc.icon className="h-4 w-4 mr-2" />
                  {doc.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <MenuIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {data.navMain.map((item) => (
                <DropdownMenuItem 
                  key={item.title}
                  onClick={() => handleNavigation(item.url)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              {data.navSecondary.map((item) => (
                <DropdownMenuItem key={item.title}>
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={data.user.avatar} alt={data.user.name} />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{data.user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserCircleIcon className="h-4 w-4 mr-2" />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BellIcon className="h-4 w-4 mr-2" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}