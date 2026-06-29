create table wedding_projects (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
  wedding_date date,
  venue_name text,
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table wedding_tasks (
  id uuid primary key default gen_random_uuid(),
  wedding_project_id uuid not null references wedding_projects(id) on delete cascade,
  title text not null,
  category text not null,
  due_date date,
  status text not null default 'todo',
  memo text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint wedding_tasks_status_check
    check (status in ('todo', 'in_progress', 'done'))
);

create table vendors (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references households(id) on delete cascade,
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
  wedding_project_id uuid not null references wedding_projects(id) on delete cascade,
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

create index wedding_projects_household_id_idx
  on wedding_projects (household_id);

create index wedding_tasks_project_due_date_idx
  on wedding_tasks (wedding_project_id, due_date);

create index vendors_household_id_idx
  on vendors (household_id);

create index wedding_budget_items_project_id_idx
  on wedding_budget_items (wedding_project_id);

create index wedding_budget_items_vendor_id_idx
  on wedding_budget_items (vendor_id);
