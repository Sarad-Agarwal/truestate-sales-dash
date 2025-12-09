# Retail Sales Management System

A comprehensive full-stack retail sales management dashboard with advanced search, filtering, sorting, and pagination capabilities.

## Overview

This application provides a clean, professional interface for managing and analyzing retail sales data. Built as part of the TruEstate SDE Intern Assignment, it demonstrates modern web development practices with a focus on user experience and code quality.

![Dashboard Preview](https://truestate-sales-dash.lovable.app)

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design tokens
- **Radix UI** primitives via shadcn/ui
- **date-fns** for date formatting
- **TanStack Query** for data fetching optimization

### Backend
- **Lovable Cloud** (powered by Supabase)
- **PostgreSQL** database with optimized indexes
- **REST API** with PostgREST
- **Row Level Security** for data protection

## Features

### Search Implementation

The search functionality provides:
- **Full-text search** across customer name and phone number
- **Case-insensitive** matching using PostgreSQL ILIKE
- **Real-time filtering** as the user types
- **Combined OR logic** to match either field

```typescript
// Example: Searching for "John" matches:
// - Customer names containing "john", "John", "JOHN"
// - Phone numbers containing "john"
```

### Filter Implementation

Multi-select and range-based filters:

| Filter | Type | Description |
|--------|------|-------------|
| Customer Region | Multi-select | Filter by geographic region |
| Gender | Multi-select | Filter by customer gender |
| Age Range | Range | Numeric min/max filter |
| Product Category | Multi-select | Filter by product type |
| Tags | Multi-select | Filter by product tags (array) |
| Payment Method | Multi-select | Filter by payment type |
| Date Range | Range | Date start/end filter |

**Key Features:**
- All filters work together (AND logic between filters)
- Active filter count displayed on each dropdown
- One-click clear for individual filters
- Clear all filters button in empty state

### Sorting Implementation

Available sort options:
- **Date** (Newest First / Oldest First)
- **Quantity** (High to Low / Low to High)
- **Customer Name** (A-Z / Z-A)
- **Amount** (High to Low / Low to High)

**Behavior:**
- Click to select a sort field
- Click again to reverse direction
- Visual indicator shows current sort direction

### Pagination Implementation

- **Page size**: 10 records per page
- **Smart page numbers**: Ellipsis for large datasets
- **Record count display**: "Showing X to Y of Z results"
- **Maintains state**: Search, filters, and sort preserved across pages

```typescript
// Pagination response format
{
  page: 1,
  limit: 10,
  totalPages: 20,
  totalRecords: 200
}
```

## Project Structure

```
root/
├── docs/
│   └── architecture.md      # Detailed architecture documentation
├── public/
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── dashboard/       # Dashboard components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   ├── lib/                 # Utility functions
│   ├── pages/               # Route pages
│   ├── types/               # TypeScript interfaces
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css            # Design system tokens
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd retail-sales-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

### Environment Variables

The application uses Lovable Cloud, which automatically configures:
- `VITE_SUPABASE_URL` - Database API endpoint
- `VITE_SUPABASE_PUBLISHABLE_KEY` - API key

No manual configuration required for the hosted version.

## Database Schema

The `sales_data` table stores all retail transaction data:

### Customer Fields
- CustomerID, CustomerName, PhoneNumber, Gender, Age, CustomerRegion, CustomerType

### Product Fields
- ProductID, ProductName, Brand, ProductCategory, Tags

### Sales Fields
- Quantity, PricePerUnit, DiscountPercentage, TotalAmount, FinalAmount

### Operational Fields
- Date, PaymentMethod, OrderStatus, DeliveryType, StoreID, StoreLocation, SalespersonID, EmployeeName

## API Response Format

```json
{
  "data": [
    {
      "id": "uuid",
      "transaction_id": "TXN123456",
      "date": "2023-09-26",
      "customer_id": "CUST12016",
      "customer_name": "Neha Yadav",
      "phone_number": "+91 9123456789",
      "gender": "Female",
      "age": 25,
      "product_category": "Clothing",
      "quantity": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 20,
    "totalRecords": 200
  }
}
```

## Deployment

### Frontend
The application is deployed on Lovable's hosting platform and automatically updates on code changes.

### Backend
Lovable Cloud handles all backend infrastructure:
- Database hosting and management
- API endpoints
- Security and authentication

## Edge Cases Handled

- ✅ No results found (with helpful messaging)
- ✅ Conflicting filters (all applied with AND logic)
- ✅ Invalid numeric ranges (graceful handling)
- ✅ Large filter combinations (optimized queries)
- ✅ Missing optional fields (null-safe rendering)
- ✅ Network errors (retry functionality)
- ✅ Loading states (skeleton UI)

## Design Decisions

1. **Component Architecture**: Small, focused components for maintainability
2. **Custom Hooks**: Data logic separated from UI components
3. **Design Tokens**: Centralized styling via CSS custom properties
4. **TypeScript**: Full type safety for reliability
5. **Optimistic UI**: Skeleton loading for better perceived performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - See LICENSE file for details
