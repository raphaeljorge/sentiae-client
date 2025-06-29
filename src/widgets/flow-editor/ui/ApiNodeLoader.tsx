import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Loader2, RefreshCw, Database } from 'lucide-react';
import { createDynamicNodes } from '@/shared/ui/flow/dynamic-node-factory';
import { useWorkflow } from '@/shared/hooks/use-workflow';
import { toast } from 'sonner';

interface ApiNodeLoaderProps {
  onClose?: () => void;
}

export function ApiNodeLoader({ onClose }: ApiNodeLoaderProps) {
  const [apiUrl, setApiUrl] = useState('/api/node-types');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { onNodesChange } = useWorkflow();

  const handleLoadNodes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch node definitions from API
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate the response data
      if (!Array.isArray(data)) {
        throw new Error('API response is not an array of node definitions');
      }
      
      // Create nodes from the JSON definitions
      const nodes = createDynamicNodes(data);
      
      // Add the nodes to the workflow
      const addChanges = nodes.map(node => ({
        type: 'add' as const,
        item: node,
      }));
      
      onNodesChange(addChanges);
      
      toast.success(`Successfully loaded ${nodes.length} nodes from API`);
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Failed to load nodes from API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Load Nodes from API
        </CardTitle>
        <CardDescription>
          Fetch node definitions from an API endpoint and add them to the workflow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-url" className="text-sm font-medium">
              API Endpoint URL
            </label>
            <Input
              id="api-url"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="https://api.example.com/nodes"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              The API should return an array of node definitions in JSON format
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleLoadNodes} disabled={isLoading || !apiUrl}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Load Nodes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}