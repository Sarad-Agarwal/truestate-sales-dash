-- Create the sales_data table to store retail sales information
CREATE TABLE public.sales_data (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    transaction_id TEXT NOT NULL,
    date DATE NOT NULL,
    
    -- Customer Fields
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone_number TEXT,
    gender TEXT,
    age INTEGER,
    customer_region TEXT,
    customer_type TEXT,
    
    -- Product Fields
    product_id TEXT,
    product_name TEXT,
    brand TEXT,
    product_category TEXT,
    tags TEXT[],
    
    -- Sales Fields
    quantity INTEGER NOT NULL DEFAULT 1,
    price_per_unit NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    
    -- Operational Fields
    payment_method TEXT,
    order_status TEXT,
    delivery_type TEXT,
    store_id TEXT,
    store_location TEXT,
    salesperson_id TEXT,
    employee_name TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public read access for this dashboard
ALTER TABLE public.sales_data ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (this is a data visualization dashboard)
CREATE POLICY "Allow public read access to sales data"
ON public.sales_data
FOR SELECT
USING (true);

-- Create indexes for efficient filtering and searching
CREATE INDEX idx_sales_data_customer_name ON public.sales_data USING gin(to_tsvector('english', customer_name));
CREATE INDEX idx_sales_data_phone_number ON public.sales_data (phone_number);
CREATE INDEX idx_sales_data_customer_region ON public.sales_data (customer_region);
CREATE INDEX idx_sales_data_gender ON public.sales_data (gender);
CREATE INDEX idx_sales_data_age ON public.sales_data (age);
CREATE INDEX idx_sales_data_product_category ON public.sales_data (product_category);
CREATE INDEX idx_sales_data_payment_method ON public.sales_data (payment_method);
CREATE INDEX idx_sales_data_date ON public.sales_data (date);
CREATE INDEX idx_sales_data_tags ON public.sales_data USING gin(tags);