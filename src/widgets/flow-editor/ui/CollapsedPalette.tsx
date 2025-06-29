import { Package } from 'lucide-react';
import { Button } from '@/shared/ui/button';

export function CollapsedPalette() {
  return (
    <div className="border-r bg-card flex flex-col h-full w-12">
      <div className="flex items-center justify-center p-2">
        <Button variant="ghost" size="sm">
          <Package className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}