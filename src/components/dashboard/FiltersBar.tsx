import { FilterDropdown } from './FilterDropdown';
import { AgeRangeFilter } from './AgeRangeFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { SortDropdown } from './SortDropdown';
import type { SalesFilters, SortConfig, FilterOptions } from '@/types/sales';

interface FiltersBarProps {
  filters: SalesFilters;
  sort: SortConfig;
  filterOptions: FilterOptions;
  onFilterChange: (filters: Partial<SalesFilters>) => void;
  onSortChange: (sort: SortConfig) => void;
}

export function FiltersBar({
  filters,
  sort,
  filterOptions,
  onFilterChange,
  onSortChange,
}: FiltersBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterDropdown
        label="Customer Region"
        options={filterOptions.regions}
        selected={filters.customerRegions}
        onChange={(selected) => onFilterChange({ customerRegions: selected })}
      />
      
      <FilterDropdown
        label="Gender"
        options={filterOptions.genders}
        selected={filters.genders}
        onChange={(selected) => onFilterChange({ genders: selected })}
      />
      
      <AgeRangeFilter
        min={filters.ageRange.min}
        max={filters.ageRange.max}
        onChange={(min, max) => onFilterChange({ ageRange: { min, max } })}
      />
      
      <FilterDropdown
        label="Product Category"
        options={filterOptions.categories}
        selected={filters.productCategories}
        onChange={(selected) => onFilterChange({ productCategories: selected })}
      />
      
      <FilterDropdown
        label="Tags"
        options={filterOptions.tags}
        selected={filters.tags}
        onChange={(selected) => onFilterChange({ tags: selected })}
      />
      
      <FilterDropdown
        label="Payment Method"
        options={filterOptions.paymentMethods}
        selected={filters.paymentMethods}
        onChange={(selected) => onFilterChange({ paymentMethods: selected })}
      />
      
      <DateRangeFilter
        startDate={filters.dateRange.start}
        endDate={filters.dateRange.end}
        onChange={(start, end) => onFilterChange({ dateRange: { start, end } })}
      />

      <div className="ml-auto">
        <SortDropdown value={sort} onChange={onSortChange} />
      </div>
    </div>
  );
}
