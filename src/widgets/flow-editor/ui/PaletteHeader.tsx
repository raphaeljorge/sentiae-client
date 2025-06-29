import { Search } from 'lucide-react';
import { Input } from '@/shared/ui/input';

interface PaletteHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function PaletteHeader({ searchQuery, onSearchChange }: PaletteHeaderProps) {
  return (
    <div className="p-4 border-b border-border">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}