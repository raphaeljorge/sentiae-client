import { useState } from 'react';
import { Search, File, Terminal, Settings } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import { useCodeEditor } from '../model/use-code-editor';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { openFiles, openFile, togglePanel, createTerminal } = useCodeEditor();
  const [searchValue, setSearchValue] = useState('');

  const commands = [
    {
      group: 'Files',
      items: [
        {
          id: 'new-file',
          title: 'New File',
          description: 'Create a new file',
          icon: File,
          action: () => {
            const fileName = prompt('Enter file name:');
            if (fileName) {
              openFile(fileName, '', 'plaintext');
            }
          },
        },
        {
          id: 'open-file',
          title: 'Open File',
          description: 'Open an existing file',
          icon: File,
          action: () => {
            // In a real app, this would open a file picker
            console.log('Open file dialog');
          },
        },
      ],
    },
    {
      group: 'View',
      items: [
        {
          id: 'toggle-terminal',
          title: 'Toggle Terminal',
          description: 'Show/hide terminal panel',
          icon: Terminal,
          action: () => {
            togglePanel('terminal');
            createTerminal();
          },
        },
        {
          id: 'toggle-explorer',
          title: 'Toggle Explorer',
          description: 'Show/hide file explorer',
          icon: File,
          action: () => {
            togglePanel('explorer');
          },
        },
      ],
    },
    {
      group: 'Settings',
      items: [
        {
          id: 'preferences',
          title: 'Preferences',
          description: 'Open settings',
          icon: Settings,
          action: () => {
            console.log('Open preferences');
          },
        },
      ],
    },
  ];

  // Add recently opened files to commands
  if (openFiles.length > 0) {
         commands.unshift({
       group: 'Recent Files',
       items: openFiles.map((file) => ({
         id: `recent-${file.path}`,
         title: file.path.split('/').pop() || file.path,
         description: file.path,
         icon: File,
         action: () => {
           openFile(file.path, file.content, file.language);
         },
       })),
     });
  }

  const handleCommand = (commandId: string) => {
    const command = commands
      .flatMap(group => group.items)
      .find(item => item.id === commandId);
    
    if (command) {
      command.action();
      onOpenChange(false);
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Type a command or search..."
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((group) => (
          <CommandGroup key={group.group} heading={group.group}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.id}
                onSelect={() => handleCommand(item.id)}
                className="flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
} 