import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SortConfig } from '@/types/sales';

interface SortOption {
  field: SortConfig['field'];
  label: string;
}

const sortOptions: SortOption[] = [
  { field: 'date', label: 'Date' },
  { field: 'quantity', label: 'Quantity' },
  { field: 'customer_name', label: 'Customer Name (A-Z)' },
  { field: 'final_amount', label: 'Amount' },
];

interface SortDropdownProps {
  value: SortConfig;
  onChange: (sort: SortConfig) => void;
  className?: string;
}

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const currentLabel = sortOptions.find((opt) => opt.field === value.field)?.label || 'Sort by';

  const handleSelect = (field: SortConfig['field']) => {
    if (field === value.field) {
      // Toggle direction
      onChange({ field, direction: value.direction === 'asc' ? 'desc' : 'asc' });
    } else {
      // Default to descending for date/amount, ascending for name
      onChange({ field, direction: field === 'customer_name' ? 'asc' : 'desc' });
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border bg-filter-bg border-filter-border text-foreground hover:border-muted-foreground/50 transition-colors"
      >
        <span className="text-muted-foreground">Sort by:</span>
        <span className="font-medium">{currentLabel}</span>
        {value.direction === 'asc' ? (
          <ArrowUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ArrowDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
        <ChevronDown className={cn('w-3.5 h-3.5 ml-0.5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-popover border border-border rounded-lg shadow-elevated z-50 animate-fade-in overflow-hidden">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.field}
                onClick={() => handleSelect(option.field)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  value.field === option.field
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <span className="flex-1">{option.label}</span>
                {value.field === option.field && (
                  <>
                    {value.direction === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )}
                    <Check className="w-4 h-4 text-primary" />
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
