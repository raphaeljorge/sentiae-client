import { useEffect, useRef, useState } from 'react';
import { Terminal, Plus, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useCodeEditor } from '../model/use-code-editor';

export function TerminalPanel() {
  const { terminalSessions, createTerminal, removeTerminal, setActiveTerminal } = useCodeEditor();
  const [activeTerminalId, setActiveTerminalId] = useState<string>();
  const terminalRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Create first terminal if none exist
  useEffect(() => {
    if (terminalSessions.length === 0) {
      const session = createTerminal();
      setActiveTerminalId(session.id);
    } else {
      const activeSession = terminalSessions.find((s) => s.isActive);
      if (activeSession) {
        setActiveTerminalId(activeSession.id);
      }
    }
  }, [terminalSessions, createTerminal]);

  const handleNewTerminal = () => {
    const session = createTerminal();
    setActiveTerminalId(session.id);
  };

  const handleCloseTerminal = (id: string) => {
    removeTerminal(id);
    if (activeTerminalId === id && terminalSessions.length > 1) {
      const remainingSessions = terminalSessions.filter((s) => s.id !== id);
      if (remainingSessions.length > 0) {
        setActiveTerminalId(remainingSessions[0].id);
      }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTerminalId(value);
    setActiveTerminal(value);
  };

  // Mock terminal component - in a real app you'd use xterm.js
  const MockTerminal = ({ sessionId }: { sessionId: string }) => {
    const [output, setOutput] = useState<string[]>(['Welcome to the terminal!', '$ ']);
    const [input, setInput] = useState('');

    const handleCommand = (command: string) => {
      if (!command.trim()) return;

      const newOutput = [...output];
      newOutput[newOutput.length - 1] = `$ ${command}`;
      
      // Mock command responses
      switch (command.toLowerCase()) {
        case 'help':
          newOutput.push('Available commands: help, clear, ls, pwd, date');
          break;
        case 'clear':
          setOutput(['Welcome to the terminal!', '$ ']);
          setInput('');
          return;
        case 'ls':
          newOutput.push('src/  package.json  README.md  vite.config.ts');
          break;
        case 'pwd':
          newOutput.push('/workspace');
          break;
        case 'date':
          newOutput.push(new Date().toString());
          break;
        default:
          newOutput.push(`Command not found: ${command}`);
      }
      
      newOutput.push('$ ');
      setOutput(newOutput);
      setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCommand(input);
      }
    };

    return (
      <div className="h-full bg-black text-green-400 font-mono text-sm p-2 overflow-y-auto">
        <div className="space-y-1">
          {output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">
              {index === output.length - 1 && line.startsWith('$ ') ? (
                <div className="flex">
                  <span>$ </span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent outline-none text-green-400"
                    autoFocus
                  />
                </div>
              ) : (
                line
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (terminalSessions.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Terminal className="h-8 w-8 mx-auto mb-2" />
          <p className="text-sm">No terminal sessions</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={handleNewTerminal}>
            <Plus className="h-4 w-4 mr-1" />
            New Terminal
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs 
        value={activeTerminalId} 
        onValueChange={handleTabChange}
        className="h-full flex flex-col"
      >
        {/* Terminal Tabs */}
        <div className="flex items-center justify-between border-b px-2 py-1">
          <TabsList className="h-8">
            {terminalSessions.map((session) => (
              <TabsTrigger
                key={session.id}
                value={session.id}
                className="text-xs px-2 py-1 group"
              >
                <Terminal className="h-3 w-3 mr-1" />
                {session.title}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTerminal(session.id);
                  }}
                >
                  <X className="h-2 w-2" />
                </Button>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <Button variant="ghost" size="sm" onClick={handleNewTerminal}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 min-h-0">
          {terminalSessions.map((session) => (
            <TabsContent 
              key={session.id} 
              value={session.id} 
              className="h-full m-0 data-[state=active]:flex"
            >
              <MockTerminal sessionId={session.id} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
} 