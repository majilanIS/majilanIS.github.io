-- Feedback table for portfolio ratings and comments.
-- Run this in the Supabase SQL editor.

create table if not exists public.feedback (
  id bigint generated always as identity primary key,
  name varchar,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

drop policy if exists "allow public feedback insert" on public.feedback;
create policy "allow public feedback insert"
on public.feedback
for insert
to anon, authenticated
with check (true);

drop policy if exists "allow public feedback read" on public.feedback;
create policy "allow public feedback read"
on public.feedback
for select
to anon, authenticated
using (true);
