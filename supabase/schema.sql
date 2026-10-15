-- ============================================================================
-- Kape Muna - Customer-Facing Ordering System Database Schema
-- Supabase PostgreSQL with Realtime & Row Level Security (RLS)
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 2. Categories Table
create table if not exists public.categories (
  id text primary key,
  name text not null,
  icon text not null,
  display_order int default 0,
  created_at timestamptz default now()
);

-- 3. Menu Items Table
create table if not exists public.menu_items (
  id text primary key,
  name text not null,
  category_id text references public.categories(id) on delete set null,
  description text,
  base_price numeric(10, 2) not null check (base_price >= 0),
  image_url text not null,
  badge text, -- 'BESTSELLER', 'CHEF''S PICK', 'POPULAR', etc.
  rating numeric(2, 1) default 4.8,
  review_count text default '1.2k+',
  is_available boolean default true,
  has_customization boolean default true,
  created_at timestamptz default now()
);

-- 4. Customization Options Table
create table if not exists public.customization_options (
  id text primary key,
  group_type text not null check (group_type in ('size', 'sweetness', 'milk', 'shots')),
  name text not null,
  price_modifier numeric(10, 2) default 0.00,
  is_default boolean default false,
  display_order int default 0
);

-- 5. Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique,
  customer_name text not null,
  customer_phone text,
  branch_name text default 'Kape Muna — Main Branch',
  order_type text not null check (order_type in ('Remote Pre-Order', 'In-Store Walk-in')),
  payment_method text not null check (payment_method in ('Online Payment', 'Pay at Counter')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid')),
  payment_reference text,
  pickup_time text default 'ASAP (10-15 mins)',
  status text not null default 'Pending Payment' check (
    status in ('Pending Payment', 'Queued', 'Preparing', 'Ready for Pickup', 'Completed', 'Cancelled')
  ),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  service_fee numeric(10, 2) default 0.00 check (service_fee >= 0),
  discount numeric(10, 2) default 0.00 check (discount >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Order Items Table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id),
  item_name text not null,
  item_price numeric(10, 2) not null,
  quantity int not null default 1 check (quantity > 0),
  selected_size text default '12oz',
  selected_sweetness text default '100%',
  selected_milk text default 'Whole Milk',
  selected_shots text default 'Single',
  customization_total numeric(10, 2) default 0.00,
  line_total numeric(10, 2) not null,
  special_notes text,
  created_at timestamptz default now()
);

-- Auto-update updated_at timestamp on orders
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Setup
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.customization_options enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Public can read menu, categories, and options
create policy "Allow public read access to categories"
  on public.categories for select using (true);

create policy "Allow public read access to menu items"
  on public.menu_items for select using (true);

create policy "Allow public read access to customization options"
  on public.customization_options for select using (true);

-- Anyone can insert orders and view order status by order code
create policy "Allow public order insertion"
  on public.orders for insert with check (true);

create policy "Allow public order read"
  on public.orders for select using (true);

create policy "Allow public order update"
  on public.orders for update using (true);

create policy "Allow public order items insertion"
  on public.order_items for insert with check (true);

create policy "Allow public order items read"
  on public.order_items for select using (true);

-- ============================================================================
-- Enable Realtime for Live Order Tracker
-- ============================================================================
begin;
  -- Add table to publication if not already present
  do $$
  begin
    if not exists (
      select 1 from pg_publication_tables 
      where pubname = 'supabase_realtime' and tablename = 'orders'
    ) then
      alter publication supabase_realtime add table public.orders;
    end if;
  end;
  $$;
commit;
