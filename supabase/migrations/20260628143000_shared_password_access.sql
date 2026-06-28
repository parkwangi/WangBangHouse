drop policy if exists "Members can read their couples" on public.couples;
drop policy if exists "Authenticated users can create couples" on public.couples;
drop policy if exists "Members can read wedding events" on public.wedding_events;
drop policy if exists "Members can create wedding events" on public.wedding_events;
drop policy if exists "Members can update wedding events" on public.wedding_events;
drop policy if exists "Members can delete wedding events" on public.wedding_events;

create policy "Shared app can read couples"
  on public.couples for select
  to anon, authenticated
  using (true);

create policy "Shared app can create couples"
  on public.couples for insert
  to anon, authenticated
  with check (true);

create policy "Shared app can read wedding events"
  on public.wedding_events for select
  to anon, authenticated
  using (true);

create policy "Shared app can create wedding events"
  on public.wedding_events for insert
  to anon, authenticated
  with check (true);

create policy "Shared app can update wedding events"
  on public.wedding_events for update
  to anon, authenticated
  using (true)
  with check (true);

create policy "Shared app can delete wedding events"
  on public.wedding_events for delete
  to anon, authenticated
  using (true);
