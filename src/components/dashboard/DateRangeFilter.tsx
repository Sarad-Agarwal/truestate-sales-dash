import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onChange: (start: string | null, end: string | null) => void;
  className?: string;
}

export function DateRangeFilter({ startDate, endDate, onChange, className }: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localStart, setLocalStart] = useState(startDate || '');
  const [localEnd, setLocalEnd] = useState(endDate || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSelection = startDate || endDate;

  const applyFilter = () => {
    onChange(localStart || null, localEnd || null);
    setIsOpen(false);
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalStart('');
    setLocalEnd('');
    onChange(null, null);
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${format(new Date(startDate), 'MMM d')} - ${format(new Date(endDate), 'MMM d')}`;
    }
    if (startDate) return `From ${format(new Date(startDate), 'MMM d')}`;
    if (endDate) return `Until ${format(new Date(endDate), 'MMM d')}`;
    return 'Date';
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border transition-colors',
          hasSelection
            ? 'bg-filter-active-bg border-filter-active text-filter-active'
            : 'bg-filter-bg border-filter-border text-foreground hover:border-muted-foreground/50'
        )}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span className="font-medium">{getDisplayText()}</span>
        {hasSelection ? (
          <X className="w-3.5 h-3.5 ml-0.5" onClick={clearFilter} />
        ) : (
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-popover border border-border rounded-lg shadow-elevated z-50 animate-fade-in p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Start Date</label>
              <input
                type="date"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">End Date</label>
              <input
                type="date"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              onClick={applyFilter}
              className="w-full py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
