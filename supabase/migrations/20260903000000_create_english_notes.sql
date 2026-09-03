create table public.english_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  korean_text text not null,
  english_text text not null,
  notes text,
  situation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index english_notes_user_id_idx
  on public.english_notes (user_id);

create index english_notes_user_created_at_idx
  on public.english_notes (user_id, created_at desc);

create or replace function public.update_english_notes_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger english_notes_set_updated_at
before update on public.english_notes
for each row
execute function public.update_english_notes_updated_at();

alter table public.english_notes enable row level security;

create policy "Users can select their own English notes"
  on public.english_notes
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own English notes"
  on public.english_notes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own English notes"
  on public.english_notes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own English notes"
  on public.english_notes
  for delete
  to authenticated
  using (auth.uid() = user_id);