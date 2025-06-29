import { Search } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="text-center py-8 text-sm text-muted-foreground p-4">
      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>No nodes found</p>
    </div>
  );
}