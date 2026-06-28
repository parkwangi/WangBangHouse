create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  created_at timestamptz not null default now()
);

create table public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create type public.couple_role as enum ('owner', 'member');

create table public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.couple_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (couple_id, user_id)
);

create table public.wedding_events (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  title text not null,
  memo text,
  date date not null,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index wedding_events_couple_date_idx
  on public.wedding_events (couple_id, date);

alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.wedding_events enable row level security;

create or replace function public.is_couple_member(target_couple_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.couple_members
    where couple_id = target_couple_id
      and user_id = auth.uid()
  );
$$;

create policy "Users can read own profile"
  on public.profiles for select
  using (id = auth.uid());

create policy "Users can update own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (id = auth.uid());

create policy "Members can read their couples"
  on public.couples for select
  using (public.is_couple_member(id));

create policy "Authenticated users can create couples"
  on public.couples for insert
  to authenticated
  with check (true);

create policy "Members can read couple members"
  on public.couple_members for select
  using (public.is_couple_member(couple_id));

create policy "Users can join as themselves"
  on public.couple_members for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Members can read wedding events"
  on public.wedding_events for select
  using (public.is_couple_member(couple_id));

create policy "Members can create wedding events"
  on public.wedding_events for insert
  to authenticated
  with check (
    public.is_couple_member(couple_id)
    and created_by = auth.uid()
  );

create policy "Members can update wedding events"
  on public.wedding_events for update
  using (public.is_couple_member(couple_id))
  with check (public.is_couple_member(couple_id));

create policy "Members can delete wedding events"
  on public.wedding_events for delete
  using (public.is_couple_member(couple_id));
