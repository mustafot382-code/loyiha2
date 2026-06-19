-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)

create extension if not exists "pgcrypto";

create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references groups (id) on delete cascade,
  full_name text not null,
  age int,
  email text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists students_group_id_idx on students (group_id);

-- Keep "is_active" exclusive across groups: turning one group on turns the rest off.
-- This mirrors the single-selection toggle row in the UI.
create or replace function enforce_single_active_group()
returns trigger as $$
begin
  if new.is_active then
    update groups set is_active = false where id <> new.id and is_active = true;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_single_active_group on groups;
create trigger trg_single_active_group
  after insert or update of is_active on groups
  for each row
  when (new.is_active = true)
  execute function enforce_single_active_group();

-- Row Level Security
-- This demo ships with permissive policies so the anon key can read/write
-- directly from the browser. Tighten these (e.g. require auth.uid()) before
-- shipping anything with real student data.
alter table groups enable row level security;
alter table students enable row level security;

drop policy if exists "groups are publicly readable" on groups;
create policy "groups are publicly readable" on groups
  for select using (true);

drop policy if exists "groups are publicly writable" on groups;
create policy "groups are publicly writable" on groups
  for all using (true) with check (true);

drop policy if exists "students are publicly readable" on students;
create policy "students are publicly readable" on students
  for select using (true);

drop policy if exists "students are publicly writable" on students;
create policy "students are publicly writable" on students
  for all using (true) with check (true);

-- Optional: seed data matching the wireframe, safe to delete.
insert into groups (name, is_active)
values ('Group 1', true), ('Group 2', false)
on conflict do nothing;
