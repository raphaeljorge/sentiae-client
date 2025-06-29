import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Copy, HelpCircle } from "lucide-react";
import { toast } from "sonner";

const examples = {
  textInput: {
    type: "text-input",
    position: { x: 100, y: 100 },
    data: {
      config: {
        value: "Hello World"
      }
    }
  },
  generateText: {
    type: "generate-text",
    position: { x: 400, y: 100 },
    data: {
      config: {
        model: "llama-3.1-8b-instant"
      },
      dynamicHandles: {
        tools: [
          {
            name: "example-tool",
            description: "An example tool"
          }
        ]
      }
    }
  },
  promptCrafter: {
    type: "prompt-crafter",
    position: { x: 100, y: 300 },
    data: {
      config: {
        template: "This is a template with {{variable}}"
      },
      dynamicHandles: {
        "template-tags": [
          {
            name: "variable"
          }
        ]
      }
    }
  },
  visualizeText: {
    type: "visualize-text",
    position: { x: 400, y: 300 }
  }
};

export function JsonNodeExamples() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} schema copied to clipboard`))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2">
          <HelpCircle className="h-3 w-3 mr-1" />
          Examples
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-2 border-b">
          <h4 className="text-sm font-medium">Node Schema Examples</h4>
          <p className="text-xs text-muted-foreground">
            Copy and paste these examples into the JSON editor
          </p>
        </div>
        <Tabs defaultValue="textInput" className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="textInput" className="text-xs">Text Input</TabsTrigger>
            <TabsTrigger value="generateText" className="text-xs">Generate</TabsTrigger>
            <TabsTrigger value="promptCrafter" className="text-xs">Prompt</TabsTrigger>
            <TabsTrigger value="visualizeText" className="text-xs">Visualize</TabsTrigger>
          </TabsList>
          {Object.entries(examples).map(([key, schema]) => (
            <TabsContent key={key} value={key} className="p-2">
              <div className="flex justify-end mb-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2"
                  onClick={() => copyToClipboard(JSON.stringify(schema, null, 2), key)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto text-[10px] leading-tight max-h-40 overflow-y-auto">
                {JSON.stringify(schema, null, 2)}
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}