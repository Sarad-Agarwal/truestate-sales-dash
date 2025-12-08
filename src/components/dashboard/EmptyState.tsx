import { Search, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  className?: string;
}

export function EmptyState({ hasFilters, onClearFilters, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16', className)}>
      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
        {hasFilters ? (
          <FilterX className="w-7 h-7 text-muted-foreground" />
        ) : (
          <Search className="w-7 h-7 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">No results found</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
        {hasFilters
          ? "We couldn't find any records matching your current filters. Try adjusting or clearing them."
          : "No sales data available. Data will appear here once it's added."}
      </p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
