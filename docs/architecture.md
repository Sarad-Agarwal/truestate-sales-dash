# Retail Sales Management System - Architecture Documentation

## Overview

This document describes the architecture of the Retail Sales Management System, a full-stack application for managing and analyzing retail sales data with advanced search, filtering, sorting, and pagination capabilities.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Custom components built on Radix UI primitives (shadcn/ui)
- **State Management**: React hooks (useState, useCallback, useEffect)
- **Data Fetching**: TanStack Query + Supabase Client
- **Date Handling**: date-fns

### Backend
- **Platform**: Lovable Cloud (Supabase)
- **Database**: PostgreSQL
- **API**: Supabase REST API with PostgREST
- **Authentication**: Supabase Auth (optional, RLS configured for public read)

---

## Frontend Architecture

```
src/
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   │   ├── Dashboard.tsx    # Main dashboard container
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── SearchBar.tsx    # Search input component
│   │   ├── FiltersBar.tsx   # Filters container
│   │   ├── FilterDropdown.tsx    # Multi-select filter
│   │   ├── AgeRangeFilter.tsx    # Range-based filter
│   │   ├── DateRangeFilter.tsx   # Date range picker
│   │   ├── SortDropdown.tsx      # Sorting options
│   │   ├── StatCard.tsx     # Summary statistics card
│   │   ├── SalesTable.tsx   # Data table with skeleton
│   │   ├── Pagination.tsx   # Pagination controls
│   │   ├── EmptyState.tsx   # No results display
│   │   └── ErrorState.tsx   # Error display
│   ├── ui/                  # Reusable UI primitives
│   └── NavLink.tsx          # Navigation link wrapper
├── hooks/
│   ├── useSalesData.ts      # Main data fetching hook
│   ├── use-mobile.tsx       # Mobile detection
│   └── use-toast.ts         # Toast notifications
├── integrations/
│   └── supabase/
│       ├── client.ts        # Supabase client (auto-generated)
│       └── types.ts         # Database types (auto-generated)
├── lib/
│   └── utils.ts             # Utility functions (cn)
├── pages/
│   ├── Index.tsx            # Home page (Dashboard)
│   └── NotFound.tsx         # 404 page
├── types/
│   └── sales.ts             # TypeScript interfaces
├── App.tsx                  # App root with routing
├── main.tsx                 # Entry point
└── index.css                # Global styles & design tokens
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| Dashboard | Orchestrates all dashboard components, manages overall state |
| Sidebar | Navigation menu with collapsible sections |
| SearchBar | Full-text search input with clear functionality |
| FiltersBar | Container for all filter components |
| FilterDropdown | Multi-select dropdown for categorical filters |
| AgeRangeFilter | Numeric range filter with min/max inputs |
| DateRangeFilter | Date range picker with start/end dates |
| SortDropdown | Sorting options with direction toggle |
| StatCard | Displays summary statistics |
| SalesTable | Renders data table with loading skeletons |
| Pagination | Page navigation with page numbers |
| EmptyState | Displays when no results match filters |
| ErrorState | Displays on API errors with retry option |

---

## Backend Architecture

### Database Schema

```sql
sales_data
├── id (UUID, PK)
├── transaction_id (TEXT)
├── date (DATE)
├── customer_id (TEXT)
├── customer_name (TEXT)
├── phone_number (TEXT)
├── gender (TEXT)
├── age (INTEGER)
├── customer_region (TEXT)
├── customer_type (TEXT)
├── product_id (TEXT)
├── product_name (TEXT)
├── brand (TEXT)
├── product_category (TEXT)
├── tags (TEXT[])
├── quantity (INTEGER)
├── price_per_unit (NUMERIC)
├── discount_percentage (NUMERIC)
├── total_amount (NUMERIC)
├── final_amount (NUMERIC)
├── payment_method (TEXT)
├── order_status (TEXT)
├── delivery_type (TEXT)
├── store_id (TEXT)
├── store_location (TEXT)
├── salesperson_id (TEXT)
├── employee_name (TEXT)
└── created_at (TIMESTAMPTZ)
```

### Indexes

| Index | Type | Purpose |
|-------|------|---------|
| idx_sales_data_customer_name | GIN (tsvector) | Full-text search |
| idx_sales_data_phone_number | B-tree | Phone search |
| idx_sales_data_customer_region | B-tree | Region filter |
| idx_sales_data_gender | B-tree | Gender filter |
| idx_sales_data_age | B-tree | Age range filter |
| idx_sales_data_product_category | B-tree | Category filter |
| idx_sales_data_payment_method | B-tree | Payment filter |
| idx_sales_data_date | B-tree | Date range filter |
| idx_sales_data_tags | GIN | Array containment |

### Row Level Security (RLS)

- Public read access enabled for dashboard viewing
- Policy: "Allow public read access to sales data"

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   Filters    │───▶│ useSalesData │───▶│   Supabase   │      │
│  │  (useState)  │    │    (Hook)    │    │    Client    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│         │                   │                   │               │
│         ▼                   ▼                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  FiltersBar  │    │     Data     │    │    REST      │      │
│  │  SearchBar   │    │   Response   │    │     API      │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                             │                   │               │
│                             ▼                   │               │
│                      ┌──────────────┐           │               │
│                      │  SalesTable  │           │               │
│                      │  Pagination  │           │               │
│                      └──────────────┘           │               │
│                                                 │               │
└─────────────────────────────────────────────────│───────────────┘
                                                  │
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Lovable Cloud (Supabase)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  PostgREST   │───▶│   Query      │───▶│  PostgreSQL  │      │
│  │    API       │    │  Optimizer   │    │   Database   │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management Flow

```
User Action (Filter/Search/Sort/Page)
            │
            ▼
┌───────────────────────┐
│  updateFilters()      │
│  updateSort()         │
│  goToPage()           │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  State Update         │
│  (useState hooks)     │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  useEffect Triggers   │
│  fetchData()          │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Supabase Query       │
│  with filters, sort,  │
│  pagination           │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Update Component     │
│  State (data, stats)  │
└───────────────────────┘
            │
            ▼
┌───────────────────────┐
│  Re-render UI         │
└───────────────────────┘
```

---

## API Endpoints

The application uses Supabase's auto-generated REST API:

### Main Endpoint
```
GET /rest/v1/sales_data
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| select | string | Columns to return |
| customer_name | ilike | Case-insensitive name search |
| phone_number | ilike | Case-insensitive phone search |
| customer_region | in | Multi-select region filter |
| gender | in | Multi-select gender filter |
| age | gte/lte | Age range filter |
| product_category | in | Multi-select category filter |
| tags | ov | Array overlap for tags |
| payment_method | in | Multi-select payment filter |
| date | gte/lte | Date range filter |
| order | string | Sort field and direction |
| offset | number | Pagination offset |
| limit | number | Page size (default: 10) |

### Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "transaction_id": "string",
      "date": "YYYY-MM-DD",
      "customer_id": "string",
      "customer_name": "string",
      ...
    }
  ],
  "count": 200
}
```

Pagination info is computed client-side from the count header.

---

## Module Responsibilities

### Core Modules

| Module | File | Responsibility |
|--------|------|----------------|
| Types | src/types/sales.ts | TypeScript interfaces for all data structures |
| Data Hook | src/hooks/useSalesData.ts | Data fetching, filtering, sorting, pagination logic |
| Utils | src/lib/utils.ts | Shared utility functions |

### UI Modules

| Module | File | Responsibility |
|--------|------|----------------|
| Design System | src/index.css | CSS custom properties, design tokens |
| Tailwind Config | tailwind.config.ts | Theme configuration, custom utilities |

---

## Filtering Implementation

### Search (Full-text, Case-insensitive)
- Fields: customer_name, phone_number
- Method: PostgreSQL ILIKE with wildcard patterns
- Combined with OR operator for multi-field search

### Multi-Select Filters
- Customer Region, Gender, Product Category, Payment Method, Tags
- Method: PostgreSQL IN clause for exact matches
- Tags use OVERLAPS for array containment

### Range Filters
- Age Range: GTE/LTE numeric comparison
- Date Range: GTE/LTE date comparison

---

## Sorting Implementation

| Option | Field | Default Direction |
|--------|-------|-------------------|
| Date | date | Descending (newest first) |
| Quantity | quantity | Descending |
| Customer Name | customer_name | Ascending (A-Z) |
| Amount | final_amount | Descending |

Toggle behavior: clicking the same sort option reverses direction.

---

## Pagination Implementation

- Page Size: 10 records per page
- Method: PostgreSQL LIMIT/OFFSET via Supabase range()
- Total count retrieved via count: 'exact' option
- Page numbers calculated client-side
- Smart page number display with ellipsis for large datasets

---

## Performance Optimizations

1. **Database Indexes**: All filterable columns indexed
2. **Debounced Search**: Prevents excessive API calls during typing
3. **Skeleton Loading**: Immediate feedback during data fetch
4. **Memoized Callbacks**: Prevent unnecessary re-renders
5. **Optimized Re-renders**: Granular state updates

---

## Error Handling

1. **Network Errors**: Caught and displayed with retry option
2. **Empty States**: Distinct messaging for no data vs. no matches
3. **Invalid Filters**: Graceful handling of edge cases
4. **Loading States**: Skeleton UI during data fetching

---

## Security Considerations

1. **RLS Enabled**: Row Level Security on all tables
2. **Public Read-Only**: No write operations exposed
3. **Input Validation**: Client-side validation for all inputs
4. **SQL Injection Prevention**: Supabase client handles parameterization
