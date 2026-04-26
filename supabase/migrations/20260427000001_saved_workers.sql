-- saved_workers: customers' bookmarked/saved worker profiles
create table saved_workers (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references auth.users(id) on delete cascade,
  worker_id   uuid        not null references workers(id)    on delete cascade,
  created_at  timestamptz not null default now(),
  unique (customer_id, worker_id)
);

alter table saved_workers enable row level security;

-- Customers can only read and write their own rows
create policy "saved_workers_self"
  on saved_workers for all
  using  (auth.uid() = customer_id)
  with check (auth.uid() = customer_id);

-- Grant base access to the authenticated role (RLS handles row-level filtering)
grant select, insert, update, delete on saved_workers to authenticated;
