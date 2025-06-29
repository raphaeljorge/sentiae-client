import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Separator } from '@/shared/ui/separator';
import { 
  Code2, 
  Database, 
  Layers, 
  Zap, 
  Palette, 
  Shield,
  Workflow,
  FileText,
  Settings,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Search
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

const workflowExamples = [
  {
    id: 'flow-chain',
    name: 'Chain Workflow',
    description: 'Step-by-step content creation with quality checks',
    icon: ArrowRight,
    color: 'bg-blue-500',
  },
  {
    id: 'flow-routing',
    name: 'Routing Workflow', 
    description: 'Content classification and specialist routing',
    icon: Search,
    color: 'bg-green-500',
  },
  {
    id: 'flow-parallelization',
    name: 'Parallelization Workflow',
    description: 'Parallel exam creation with aggregation',
    icon: Zap,
    color: 'bg-yellow-500',
  },
  {
    id: 'flow-orchestrator',
    name: 'Orchestrator Workflow',
    description: 'Coordinated development task distribution',
    icon: Layers,
    color: 'bg-purple-500',
  },
];

export function HomePage() {
  return (
    <>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <SidebarTrigger className="[&_svg]:size-4 -ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">Documents</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
              <a
                href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
                rel="noopener noreferrer"
                target="_blank"
                className="dark:text-foreground"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              TanStack React Start
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Modern React application with Feature-Sliced Design architecture
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Badge variant="secondary">React 19</Badge>
              <Badge variant="secondary">TanStack Start</Badge>
              <Badge variant="secondary">Feature-Sliced Design</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
            </div>
          </div>
  
          {/* Workflow Examples Section */}
          <div className="space-y-4 mb-12">
            <div className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              <h2 className="text-2xl font-semibold tracking-tight">Workflow Examples</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {workflowExamples.map((workflow) => (
                <Card key={workflow.id} className="group hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${workflow.color}`} />
                      <workflow.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {workflow.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link
                      to="/editor"
                      search={{ id: workflow.id }}
                      className="inline-flex"
                    >
                      <Button size="sm" className="w-full group-hover:bg-primary/90">
                        Open Editor
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">React 19 with Concurrent Features</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Vite 6 Fast Build Tool</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">TypeScript Type Safety</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  State Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">TanStack Query</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Zustand Store</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Immer Integration</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">Feature-Sliced Design</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">TanStack Router</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">Modular Structure</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Biomejs Linting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Vitest Testing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Husky Git Hooks</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  UI Components
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full" />
                  <span className="text-sm">shadcn/ui Library</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full" />
                  <span className="text-sm">Radix UI Primitives</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full" />
                  <span className="text-sm">Tailwind CSS</span>
                </div>
              </CardContent>
            </Card>
  
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-sm">Monaco Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-sm">Syntax Highlighting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-sm">Code Completion</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Getting Started</h2>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="development">Development</TabsTrigger>
                <TabsTrigger value="architecture">Architecture</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Overview</CardTitle>
                    <CardDescription>
                      This project demonstrates modern React development with Feature-Sliced Design
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="font-medium">Key Features</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• File-based routing with TanStack Router</li>
                          <li>• Server state management with TanStack Query</li>
                          <li>• Component composition patterns</li>
                          <li>• Type-safe development with TypeScript</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium">Development Tools</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Vite for fast development builds</li>
                          <li>• Biome for code formatting and linting</li>
                          <li>• Vitest for unit testing</li>
                          <li>• Husky for git hooks</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="development" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code2 className="h-4 w-4" />
                        Quick Start
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Install dependencies:</p>
                        <code className="block p-2 bg-muted rounded text-sm">npm install</code>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Start development server:</p>
                        <code className="block p-2 bg-muted rounded text-sm">npm run dev</code>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Available Scripts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <code>npm run build</code>
                          <span className="text-muted-foreground">Production build</span>
                        </div>
                        <div className="flex justify-between">
                          <code>npm run lint</code>
                          <span className="text-muted-foreground">Run linter</span>
                        </div>
                        <div className="flex justify-between">
                          <code>npm run test</code>
                          <span className="text-muted-foreground">Run tests</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="architecture" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Feature-Sliced Design
                    </CardTitle>
                    <CardDescription>
                      Modular architecture for scalable React applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium">Layers</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• <strong>shared</strong> - Reusable utilities</li>
                            <li>• <strong>entities</strong> - Business entities</li>
                            <li>• <strong>features</strong> - User features</li>
                            <li>• <strong>widgets</strong> - UI compositions</li>
                            <li>• <strong>pages</strong> - Application pages</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Slices</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• <strong>api</strong> - External integrations</li>
                            <li>• <strong>ui</strong> - User interface</li>
                            <li>• <strong>model</strong> - Business logic</li>
                            <li>• <strong>lib</strong> - Internal utilities</li>
                            <li>• <strong>config</strong> - Configuration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}