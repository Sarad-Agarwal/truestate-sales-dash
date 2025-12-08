import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgeRangeFilterProps {
  min: number | null;
  max: number | null;
  onChange: (min: number | null, max: number | null) => void;
  className?: string;
}

export function AgeRangeFilter({ min, max, onChange, className }: AgeRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(min?.toString() || '');
  const [localMax, setLocalMax] = useState(max?.toString() || '');
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

  const hasSelection = min !== null || max !== null;

  const applyFilter = () => {
    const minVal = localMin ? parseInt(localMin, 10) : null;
    const maxVal = localMax ? parseInt(localMax, 10) : null;
    onChange(minVal, maxVal);
    setIsOpen(false);
  };

  const clearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalMin('');
    setLocalMax('');
    onChange(null, null);
  };

  const getDisplayText = () => {
    if (min !== null && max !== null) return `${min} - ${max}`;
    if (min !== null) return `${min}+`;
    if (max !== null) return `≤${max}`;
    return 'Age Range';
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
        <span className="font-medium">{getDisplayText()}</span>
        {hasSelection ? (
          <X className="w-3.5 h-3.5 ml-0.5" onClick={clearFilter} />
        ) : (
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50 animate-fade-in p-3">
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Min</label>
                <input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder="0"
                  min="0"
                  max="150"
                  className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Max</label>
                <input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder="100"
                  min="0"
                  max="150"
                  className="w-full px-2 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
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
