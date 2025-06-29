import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Input } from '@/shared/ui/input';
import { SidebarTrigger } from '@/shared/ui/sidebar';
import { Separator } from '@/shared/ui/separator';
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Star,
  Clock,
  Users,
  MoreHorizontal,
  Download,
  Share,
  Edit,
  Trash2
} from 'lucide-react';

export function WorkspacePage() {
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
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
            <p className="text-muted-foreground">
              Manage your files, projects, and collaborate with your team.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New File
            </Button>
          </div>
        </div>
  
        {/* Search and View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                className="pl-10"
              />
            </div>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
  
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">New Document</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Folder className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">New Folder</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Image className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Upload Image</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <Video className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Upload Video</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                <Music className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Upload Audio</span>
            </div>
          </Card>
          
          <Card className="p-4 hover:bg-accent/50 cursor-pointer transition-colors">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                <Archive className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Upload Archive</span>
            </div>
          </Card>
        </div>
  
        {/* File Grid */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* File Card 1 */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className="font-medium text-sm mb-1">Project Proposal.docx</h4>
                  <p className="text-xs text-muted-foreground mb-2">Modified 2 hours ago</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Document</Badge>
                    <span className="text-xs text-muted-foreground">2.4 MB</span>
                  </div>
                </CardContent>
              </Card>
  
              {/* File Card 2 */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className="font-medium text-sm mb-1">Design Assets</h4>
                  <p className="text-xs text-muted-foreground mb-2">Modified 1 day ago</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Folder</Badge>
                    <span className="text-xs text-muted-foreground">24 items</span>
                  </div>
                </CardContent>
              </Card>
  
              {/* File Card 3 */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                      <Image className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className="font-medium text-sm mb-1">hero-banner.png</h4>
                  <p className="text-xs text-muted-foreground mb-2">Modified 3 days ago</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Image</Badge>
                    <span className="text-xs text-muted-foreground">1.8 MB</span>
                  </div>
                </CardContent>
              </Card>
  
              {/* File Card 4 */}
              <Card className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                      <Video className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h4 className="font-medium text-sm mb-1">demo-video.mp4</h4>
                  <p className="text-xs text-muted-foreground mb-2">Modified 1 week ago</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">Video</Badge>
                    <span className="text-xs text-muted-foreground">45.2 MB</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
  
          {/* Shared Files */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shared with Me</h3>
            <div className="space-y-2">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Q4 Financial Report.xlsx</h4>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Shared by John Doe • 2 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Spreadsheet</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
  
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Marketing Campaign Assets</h4>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        Shared by Sarah Wilson • 5 days ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">Folder</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}