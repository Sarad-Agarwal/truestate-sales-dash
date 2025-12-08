export interface SalesRecord {
  id: string;
  transaction_id: string;
  date: string;
  
  // Customer Fields
  customer_id: string;
  customer_name: string;
  phone_number: string | null;
  gender: string | null;
  age: number | null;
  customer_region: string | null;
  customer_type: string | null;
  
  // Product Fields
  product_id: string | null;
  product_name: string | null;
  brand: string | null;
  product_category: string | null;
  tags: string[] | null;
  
  // Sales Fields
  quantity: number;
  price_per_unit: number;
  discount_percentage: number | null;
  total_amount: number;
  final_amount: number;
  
  // Operational Fields
  payment_method: string | null;
  order_status: string | null;
  delivery_type: string | null;
  store_id: string | null;
  store_location: string | null;
  salesperson_id: string | null;
  employee_name: string | null;
  
  created_at: string;
}

export interface SalesFilters {
  search: string;
  customerRegions: string[];
  genders: string[];
  ageRange: { min: number | null; max: number | null };
  productCategories: string[];
  tags: string[];
  paymentMethods: string[];
  dateRange: { start: string | null; end: string | null };
}

export interface SortConfig {
  field: 'date' | 'quantity' | 'customer_name' | 'final_amount';
  direction: 'asc' | 'desc';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalPages: number;
  totalRecords: number;
}

export interface SalesResponse {
  data: SalesRecord[];
  pagination: PaginationInfo;
}

export interface FilterOptions {
  regions: string[];
  genders: string[];
  categories: string[];
  tags: string[];
  paymentMethods: string[];
}

export interface SummaryStats {
  totalUnitsSold: number;
  totalAmount: number;
  totalDiscount: number;
}
