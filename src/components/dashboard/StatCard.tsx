import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  className?: string;
}

export function StatCard({ label, value, subValue, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-stat-bg border border-stat-border rounded-lg px-4 py-3 min-w-[140px]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <Info className="w-3 h-3 text-muted-foreground/60" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold text-foreground">{value}</span>
        {subValue && (
          <span className="text-xs text-muted-foreground">{subValue}</span>
        )}
      </div>
    </div>
  );
}
