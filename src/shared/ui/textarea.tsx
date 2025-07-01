import * as React from "react"

import { cn } from "@/shared/lib/utils"

export interface TextareaProps
  extends React.ComponentProps<"textarea"> {
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;

    React.useLayoutEffect(() => {
      if (autoResize && textareaRef && 'current' in textareaRef && textareaRef.current) {
        const textarea = textareaRef.current;
        
        const adjustHeight = () => {
          // Reset height to get accurate scrollHeight
          textarea.style.height = 'auto';
          // Set height to scrollHeight to fit content
          textarea.style.height = `${textarea.scrollHeight}px`;
        };

        // Adjust height initially
        adjustHeight();

        // Adjust height on input
        const handleInput = () => {
          adjustHeight();
        };

        textarea.addEventListener('input', handleInput);
        
        // Cleanup event listener
        return () => {
          textarea.removeEventListener('input', handleInput);
        };
      }
    }, [autoResize, textareaRef, props.value]);

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          autoResize && "resize-none overflow-hidden",
          className
        )}
        ref={textareaRef}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
