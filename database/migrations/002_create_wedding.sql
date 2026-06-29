create table wedding_schedule_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  scheduled_date date,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  phone text,
  address text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table wedding_budget_items (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references vendors(id) on delete set null,
  category text not null,
  title text not null,
  estimated_amount integer not null default 0,
  contracted_amount integer,
  paid_amount integer not null default 0,
  payment_due_date date,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint wedding_budget_amount_check
    check (
      estimated_amount >= 0
      and paid_amount >= 0
      and (contracted_amount is null or contracted_amount >= 0)
    )
);

create index wedding_schedule_items_scheduled_date_idx
  on wedding_schedule_items (scheduled_date);

create index wedding_budget_items_payment_due_date_idx
  on wedding_budget_items (payment_due_date);

create index wedding_budget_items_vendor_id_idx
  on wedding_budget_items (vendor_id);
