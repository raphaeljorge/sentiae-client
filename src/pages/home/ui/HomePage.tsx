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
  Settings
} from 'lucide-react';

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
                  <span className="text-sm">React Flow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  <span className="text-sm">Form Validation</span>
                </div>
              </CardContent>
            </Card>
          </div>
  
          {/* Tabs Section */}
          <Tabs defaultValue="architecture" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tooling">Tooling</TabsTrigger>
              <TabsTrigger value="getting-started">Get Started</TabsTrigger>
            </TabsList>
  
            <TabsContent value="architecture" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Feature-Sliced Design
                  </CardTitle>
                  <CardDescription>
                    Organized code structure following FSD principles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Layers</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• app - Application configuration</li>
                        <li>• pages - Route components</li>
                        <li>• widgets - Complex UI blocks</li>
                        <li>• features - Business logic</li>
                        <li>• entities - Domain models</li>
                        <li>• shared - Reusable utilities</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Benefits</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Clear separation of concerns</li>
                        <li>• Predictable import rules</li>
                        <li>• Scalable architecture</li>
                        <li>• Team collaboration</li>
                        <li>• Maintainable codebase</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5" />
                      Visual Editing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Integrated Monaco Editor and React Flow for advanced editing capabilities.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">Code editing with syntax highlighting</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm">Visual flow diagrams</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
  
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Form Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Powerful form handling with validation and type safety.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">TanStack Form integration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Zod schema validation</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
  
            <TabsContent value="tooling" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Development Tooling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Code Quality</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Biomejs linting</li>
                        <li>• TypeScript strict mode</li>
                        <li>• ESLint integration</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Testing</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Vitest test runner</li>
                        <li>• Test UI interface</li>
                        <li>• Coverage reporting</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm">Git Hooks</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Husky pre-commit</li>
                        <li>• Lint staged files</li>
                        <li>• Type checking</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
  
            <TabsContent value="getting-started" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Start</CardTitle>
                  <CardDescription>
                    Get up and running with your new application
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Development Commands</h4>
                    <div className="bg-muted p-3 rounded-md font-mono text-sm space-y-1">
                      <div>npm run dev      # Start development server</div>
                      <div>npm run build    # Build for production</div>
                      <div>npm run lint     # Run linting</div>
                      <div>npm run test     # Run tests</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Next Steps</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Explore the folder structure</li>
                      <li>• Add your first feature</li>
                      <li>• Configure additional routes</li>
                      <li>• Set up your data layer</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
  
          {/* Call to Action */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-90">
              Start Building
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}