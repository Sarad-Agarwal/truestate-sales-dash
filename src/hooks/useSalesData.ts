import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SalesRecord, SalesFilters, SortConfig, PaginationInfo, FilterOptions, SummaryStats } from '@/types/sales';

const DEFAULT_PAGE_SIZE = 10;

const defaultFilters: SalesFilters = {
  search: '',
  customerRegions: [],
  genders: [],
  ageRange: { min: null, max: null },
  productCategories: [],
  tags: [],
  paymentMethods: [],
  dateRange: { start: null, end: null },
};

const defaultSort: SortConfig = {
  field: 'date',
  direction: 'desc',
};

export function useSalesData() {
  const [data, setData] = useState<SalesRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SalesFilters>(defaultFilters);
  const [sort, setSort] = useState<SortConfig>(defaultSort);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalRecords: 0,
  });
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    regions: [],
    genders: [],
    categories: [],
    tags: [],
    paymentMethods: [],
  });
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0,
  });

  // Fetch filter options (distinct values)
  const fetchFilterOptions = useCallback(async () => {
    try {
      const { data: salesData, error } = await supabase
        .from('sales_data')
        .select('customer_region, gender, product_category, tags, payment_method');

      if (error) throw error;

      const regions = new Set<string>();
      const genders = new Set<string>();
      const categories = new Set<string>();
      const tags = new Set<string>();
      const paymentMethods = new Set<string>();

      salesData?.forEach((record) => {
        if (record.customer_region) regions.add(record.customer_region);
        if (record.gender) genders.add(record.gender);
        if (record.product_category) categories.add(record.product_category);
        if (record.payment_method) paymentMethods.add(record.payment_method);
        if (record.tags) {
          record.tags.forEach((tag: string) => tags.add(tag));
        }
      });

      setFilterOptions({
        regions: Array.from(regions).sort(),
        genders: Array.from(genders).sort(),
        categories: Array.from(categories).sort(),
        tags: Array.from(tags).sort(),
        paymentMethods: Array.from(paymentMethods).sort(),
      });
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  // Fetch sales data with filters, sorting, and pagination
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase.from('sales_data').select('*', { count: 'exact' });

      // Apply search filter (case-insensitive)
      if (filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(`customer_name.ilike.${searchTerm},phone_number.ilike.${searchTerm}`);
      }

      // Apply multi-select filters
      if (filters.customerRegions.length > 0) {
        query = query.in('customer_region', filters.customerRegions);
      }
      if (filters.genders.length > 0) {
        query = query.in('gender', filters.genders);
      }
      if (filters.productCategories.length > 0) {
        query = query.in('product_category', filters.productCategories);
      }
      if (filters.paymentMethods.length > 0) {
        query = query.in('payment_method', filters.paymentMethods);
      }

      // Apply age range filter
      if (filters.ageRange.min !== null) {
        query = query.gte('age', filters.ageRange.min);
      }
      if (filters.ageRange.max !== null) {
        query = query.lte('age', filters.ageRange.max);
      }

      // Apply date range filter
      if (filters.dateRange.start) {
        query = query.gte('date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('date', filters.dateRange.end);
      }

      // Apply tags filter (array contains)
      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      // Apply pagination
      const from = (pagination.page - 1) * pagination.limit;
      const to = from + pagination.limit - 1;
      query = query.range(from, to);

      const { data: salesData, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setData(salesData || []);
      setPagination((prev) => ({
        ...prev,
        totalRecords: count || 0,
        totalPages: Math.ceil((count || 0) / prev.limit),
      }));

      // Fetch summary stats for current filters (without pagination)
      await fetchSummaryStats();
    } catch (err) {
      console.error('Error fetching sales data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination.page, pagination.limit]);

  // Fetch summary statistics
  const fetchSummaryStats = useCallback(async () => {
    try {
      let query = supabase.from('sales_data').select('quantity, total_amount, discount_percentage, final_amount');

      // Apply same filters for accurate stats
      if (filters.search.trim()) {
        const searchTerm = `%${filters.search.trim()}%`;
        query = query.or(`customer_name.ilike.${searchTerm},phone_number.ilike.${searchTerm}`);
      }
      if (filters.customerRegions.length > 0) {
        query = query.in('customer_region', filters.customerRegions);
      }
      if (filters.genders.length > 0) {
        query = query.in('gender', filters.genders);
      }
      if (filters.productCategories.length > 0) {
        query = query.in('product_category', filters.productCategories);
      }
      if (filters.paymentMethods.length > 0) {
        query = query.in('payment_method', filters.paymentMethods);
      }
      if (filters.ageRange.min !== null) {
        query = query.gte('age', filters.ageRange.min);
      }
      if (filters.ageRange.max !== null) {
        query = query.lte('age', filters.ageRange.max);
      }
      if (filters.dateRange.start) {
        query = query.gte('date', filters.dateRange.start);
      }
      if (filters.dateRange.end) {
        query = query.lte('date', filters.dateRange.end);
      }
      if (filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
      }

      const { data: statsData, error: statsError } = await query;

      if (statsError) throw statsError;

      let totalUnitsSold = 0;
      let totalAmount = 0;
      let totalDiscount = 0;

      statsData?.forEach((record) => {
        totalUnitsSold += record.quantity || 0;
        totalAmount += Number(record.total_amount) || 0;
        const discountAmount = (Number(record.total_amount) || 0) * ((record.discount_percentage || 0) / 100);
        totalDiscount += discountAmount;
      });

      setSummaryStats({
        totalUnitsSold,
        totalAmount,
        totalDiscount,
      });
    } catch (err) {
      console.error('Error fetching summary stats:', err);
    }
  }, [filters]);

  // Update filters and reset to page 1
  const updateFilters = useCallback((newFilters: Partial<SalesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Update sort
  const updateSort = useCallback((newSort: SortConfig) => {
    setSort(newSort);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  // Navigate to page
  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  // Initial load
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // Fetch data when filters, sort, or page changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
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
    refetch: fetchData,
  };
}
