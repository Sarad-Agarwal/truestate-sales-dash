import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';
import type { SalesRecord } from '@/types/sales';
import { format } from 'date-fns';

interface SalesTableProps {
  data: SalesRecord[];
  loading?: boolean;
  className?: string;
}

export function SalesTable({ data, loading, className }: SalesTableProps) {
  if (loading) {
    return <SalesTableSkeleton />;
  }

  return (
    <div className={cn('overflow-x-auto scrollbar-thin', className)}>
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-table-header border-b border-table-border">
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Transaction ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Customer ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Customer name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Phone Number
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Gender
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Age
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Product Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Quantity
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-table-border">
          {data.map((record, index) => (
            <tr
              key={record.id}
              className={cn(
                'hover:bg-table-hover transition-colors animate-fade-in',
                index % 2 === 0 ? 'bg-card' : 'bg-card/50'
              )}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <td className="px-4 py-3 text-sm text-foreground font-medium">
                {record.transaction_id}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {format(new Date(record.date), 'yyyy-MM-dd')}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {record.customer_id}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {record.customer_name}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  {record.phone_number || '-'}
                  {record.phone_number && (
                    <ExternalLink className="w-3 h-3 text-primary/60" />
                  )}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {record.gender || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {record.age ?? '-'}
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground">
                {record.product_category || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-foreground font-medium">
                {String(record.quantity).padStart(2, '0')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SalesTableSkeleton() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px]">
        <thead>
          <tr className="bg-table-header border-b border-table-border">
            {Array.from({ length: 9 }).map((_, i) => (
              <th key={i} className="px-4 py-3">
                <div className="h-3 bg-muted rounded animate-pulse w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-table-border">
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="bg-card">
              {Array.from({ length: 9 }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <div
                    className="h-4 bg-muted rounded animate-pulse"
                    style={{
                      width: `${60 + Math.random() * 40}%`,
                      animationDelay: `${rowIndex * 0.05}s`,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
