-- 001_initial_schema.sql

create table categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          jsonb not null,
  display_order integer default 0
);

create table products (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  category_id      uuid references categories(id) on delete set null,
  name             jsonb not null,
  description      jsonb,
  price_xof        integer not null,
  images           text[] not null default '{}',
  is_available     boolean default true,
  is_featured      boolean default false,
  stock_note       text,
  meta_title       jsonb,
  meta_description jsonb,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create table orders (
  id               uuid primary key default gen_random_uuid(),
  product_id       uuid references products(id) on delete set null,
  product_snapshot jsonb not null,
  customer_name    text,
  customer_phone   text,
  note             text,
  status           text default 'pending'
    check (status in ('pending','confirmed','in_progress','delivered','cancelled')),
  created_at       timestamptz default now()
);

create table shop_config (
  key        text primary key,
  value      text not null,
  updated_at timestamptz default now()
);

insert into shop_config (key, value) values
  ('whatsapp_number',       '+22890000000'),
  ('availability_note',     'Je prends actuellement des commandes. Délai moyen : 7 jours.'),
  ('shop_name',             'Adodi Studio'),
  ('max_concurrent_orders', '5');

-- RLS
alter table products    enable row level security;
alter table categories  enable row level security;
alter table orders      enable row level security;
alter table shop_config enable row level security;

create policy "Public read products"   on products    for select using (true);
create policy "Public read categories" on categories  for select using (true);
create policy "Public read config"     on shop_config for select using (true);

create policy "Admin all products"     on products    for all using (auth.role() = 'authenticated');
create policy "Admin all categories"   on categories  for all using (auth.role() = 'authenticated');
create policy "Admin all orders"       on orders      for all using (auth.role() = 'authenticated');
create policy "Admin all config"       on shop_config for all using (auth.role() = 'authenticated');

create policy "Public insert orders"   on orders      for insert with check (true);
