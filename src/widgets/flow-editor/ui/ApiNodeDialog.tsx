import { Dialog, DialogContent, DialogTrigger } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Database } from 'lucide-react';
import { ApiNodeLoader } from './ApiNodeLoader';
import { useState } from 'react';

export function ApiNodeDialog() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          Load from API
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <ApiNodeLoader onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}