-- ─────────────────────────────────────────────────────────────────────────────
-- Friday Morning International — Complete Schema + RLS
-- Run this ONCE in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This replaces the original schema.sql. It fixes:
--   1. Deprecated auth.role() → uses `to anon` / `to authenticated` role syntax
--   2. Conflicting SELECT policies on products (public vs admin)
--   3. Adds DROP POLICY guards so it's safe to re-run
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─── TABLES ──────────────────────────────────────────────────────────────────

create table if not exists categories (
  id                   uuid primary key default gen_random_uuid(),
  name                 text not null,
  slug                 text not null unique,
  cover_image_url      text,
  cloudinary_public_id text,
  show_in_navbar       boolean default true,
  is_featured          boolean default false,
  sort_order           integer default 0,
  created_at           timestamptz default now()
);

create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  category_id    uuid references categories(id) on delete set null,
  description    text,
  price          numeric(10,2) not null default 0,
  discount_price numeric(10,2),
  is_trending    boolean default false,
  is_active      boolean default true,
  stock_status   text default 'in_stock'
                   check (stock_status in ('in_stock','low_stock','out_of_stock')),
  created_at     timestamptz default now()
);

create table if not exists product_images (
  id                   uuid primary key default gen_random_uuid(),
  product_id           uuid references products(id) on delete cascade,
  cloudinary_url       text not null,
  cloudinary_public_id text,
  sort_order           integer default 0,
  is_primary           boolean default false,
  created_at           timestamptz default now()
);

create table if not exists reviews (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating        integer check (rating between 1 and 5),
  review_text   text,
  product_id    uuid references products(id) on delete set null,
  photo_url     text,
  status        text default 'pending'
                  check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

create table if not exists contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  message    text,
  is_read    boolean default false,
  created_at timestamptz default now()
);

create table if not exists newsletter_signups (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz default now()
);

create table if not exists banners (
  id                   uuid primary key default gen_random_uuid(),
  cloudinary_url       text not null,
  cloudinary_public_id text,
  headline             text,
  subheadline          text,
  cta_text             text,
  cta_link             text,
  sort_order           integer default 0,
  is_active            boolean default true,
  created_at           timestamptz default now()
);

-- ─── ENABLE ROW LEVEL SECURITY ────────────────────────────────────────────────

alter table categories          enable row level security;
alter table products            enable row level security;
alter table product_images      enable row level security;
alter table reviews             enable row level security;
alter table contact_submissions enable row level security;
alter table newsletter_signups  enable row level security;
alter table banners             enable row level security;

-- ─── DROP OLD POLICIES (safe to re-run) ──────────────────────────────────────

do $$ declare
  pol record;
begin
  for pol in
    select policyname, tablename from pg_policies
    where schemaname = 'public'
  loop
    execute format('drop policy if exists %I on %I', pol.policyname, pol.tablename);
  end loop;
end $$;

-- ─── CATEGORIES ──────────────────────────────────────────────────────────────
-- Public: read all categories
-- Admin: full CRUD

create policy "anon_read_categories" on categories
  for select to anon using (true);

create policy "auth_all_categories" on categories
  for all to authenticated using (true) with check (true);

-- ─── PRODUCTS ────────────────────────────────────────────────────────────────
-- Public: read only active products
-- Admin: read ALL products (including inactive drafts) + full CRUD

create policy "anon_read_active_products" on products
  for select to anon using (is_active = true);

create policy "auth_all_products" on products
  for all to authenticated using (true) with check (true);

-- ─── PRODUCT IMAGES ──────────────────────────────────────────────────────────

create policy "anon_read_product_images" on product_images
  for select to anon using (true);

create policy "auth_all_product_images" on product_images
  for all to authenticated using (true) with check (true);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
-- Public: read approved reviews only; can insert (status defaults to 'pending')
-- Admin: read ALL statuses + full CRUD

create policy "anon_read_approved_reviews" on reviews
  for select to anon using (status = 'approved');

create policy "anon_insert_review" on reviews
  for insert to anon with check (status = 'pending');

create policy "auth_all_reviews" on reviews
  for all to authenticated using (true) with check (true);

-- ─── CONTACT SUBMISSIONS ─────────────────────────────────────────────────────
-- Public: insert only (no read)
-- Admin: full CRUD

create policy "anon_insert_contact" on contact_submissions
  for insert to anon with check (true);

create policy "auth_all_contact" on contact_submissions
  for all to authenticated using (true) with check (true);

-- ─── NEWSLETTER SIGNUPS ───────────────────────────────────────────────────────

create policy "anon_insert_newsletter" on newsletter_signups
  for insert to anon with check (true);

create policy "auth_all_newsletter" on newsletter_signups
  for all to authenticated using (true) with check (true);

-- ─── BANNERS ─────────────────────────────────────────────────────────────────
-- Public: read active banners only
-- Admin: full CRUD

create policy "anon_read_active_banners" on banners
  for select to anon using (is_active = true);

create policy "auth_all_banners" on banners
  for all to authenticated using (true) with check (true);

-- ─── INDEXES ─────────────────────────────────────────────────────────────────

create index if not exists idx_products_category_id     on products(category_id);
create index if not exists idx_products_slug            on products(slug);
create index if not exists idx_products_is_trending     on products(is_trending);
create index if not exists idx_products_is_active       on products(is_active);
create index if not exists idx_product_images_product   on product_images(product_id);
create index if not exists idx_reviews_status           on reviews(status);
create index if not exists idx_categories_slug          on categories(slug);
create index if not exists idx_categories_sort_order    on categories(sort_order);
create index if not exists idx_banners_is_active        on banners(is_active);
create index if not exists idx_contact_is_read          on contact_submissions(is_read);
