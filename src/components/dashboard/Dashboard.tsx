import { useSalesData } from '@/hooks/useSalesData';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { FiltersBar } from './FiltersBar';
import { StatCard } from './StatCard';
import { SalesTable } from './SalesTable';
import { Pagination } from './Pagination';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { Users } from 'lucide-react';

export function Dashboard() {
  const {
    data,
    loading,
    error,
    filters,
    sort,
    pagination,
    filterOptions,
    summaryStats,
    updateFilters,
    clearFilters,
    updateSort,
    goToPage,
    refetch,
  } = useSalesData();

  const hasActiveFilters =
    filters.search.trim() !== '' ||
    filters.customerRegions.length > 0 ||
    filters.genders.length > 0 ||
    filters.productCategories.length > 0 ||
    filters.tags.length > 0 ||
    filters.paymentMethods.length > 0 ||
    filters.ageRange.min !== null ||
    filters.ageRange.max !== null ||
    filters.dateRange.start !== null ||
    filters.dateRange.end !== null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-dashboard-header">
                Sales Management System
              </h1>
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">M</span>
                </div>
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center -ml-1">
                  <span className="text-xs font-medium text-accent-foreground">R</span>
                </div>
                <span className="text-xs text-muted-foreground ml-1">3</span>
              </div>
            </div>

            <SearchBar
              value={filters.search}
              onChange={(search) => updateFilters({ search })}
              className="w-64"
            />
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6">
          {/* Filters */}
          <FiltersBar
            filters={filters}
            sort={sort}
            filterOptions={filterOptions}
            onFilterChange={updateFilters}
            onSortChange={updateSort}
          />

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            <StatCard
              label="Total units sold"
              value={summaryStats.totalUnitsSold.toLocaleString()}
            />
            <StatCard
              label="Total Amount"
              value={formatCurrency(summaryStats.totalAmount)}
              subValue={`(${pagination.totalRecords} SRs)`}
            />
            <StatCard
              label="Total Discount"
              value={formatCurrency(summaryStats.totalDiscount)}
              subValue={`(${pagination.totalRecords} SRs)`}
            />
          </div>

          {/* Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            {error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : data.length === 0 && !loading ? (
              <EmptyState
                hasFilters={hasActiveFilters}
                onClearFilters={hasActiveFilters ? clearFilters : undefined}
              />
            ) : (
              <SalesTable data={data} loading={loading} />
            )}
          </div>

          {/* Pagination */}
          {!error && data.length > 0 && (
            <div className="mt-4">
              <Pagination pagination={pagination} onPageChange={goToPage} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
