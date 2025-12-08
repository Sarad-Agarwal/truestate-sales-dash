import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterDropdown({ label, options, selected, onChange, className }: FilterDropdownProps) {
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

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((item) => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const hasSelection = selected.length > 0;

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
        <span className="font-medium">{label}</span>
        {hasSelection && (
          <span className="bg-filter-active text-filter-active-bg text-xs px-1.5 py-0.5 rounded-full font-medium">
            {selected.length}
          </span>
        )}
        {hasSelection ? (
          <X className="w-3.5 h-3.5 ml-0.5" onClick={clearSelection} />
        ) : (
          <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', isOpen && 'rotate-180')} />
        )}
      </button>

      {isOpen && options.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevated z-50 animate-fade-in overflow-hidden">
          <div className="max-h-60 overflow-y-auto scrollbar-thin py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors',
                  selected.includes(option)
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                )}
              >
                <div
                  className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                    selected.includes(option)
                      ? 'bg-primary border-primary'
                      : 'border-input'
                  )}
                >
                  {selected.includes(option) && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
                <span className="flex-1 truncate">{option}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
