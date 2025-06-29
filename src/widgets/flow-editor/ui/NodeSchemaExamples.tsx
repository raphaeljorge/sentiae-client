import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/shared/ui/accordion";
import { NODE_SCHEMA_EXAMPLES } from "@/shared/types/node-schema";
import { Button } from "@/shared/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export function NodeSchemaExamples() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success(`${label} schema copied to clipboard`))
      .catch(() => toast.error("Failed to copy to clipboard"));
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="examples">
        <AccordionTrigger className="text-sm">Node Schema Examples</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-4 text-xs">
            {Object.entries(NODE_SCHEMA_EXAMPLES).map(([key, schema]) => (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{key}</h4>
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
                <pre className="bg-muted p-2 rounded-md overflow-x-auto text-[10px] leading-tight">
                  {JSON.stringify(schema, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}