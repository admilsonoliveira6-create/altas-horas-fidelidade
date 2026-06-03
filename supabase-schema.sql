-- Tabela de clientes
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text not null,
  points integer not null default 0,
  created_at timestamptz not null default now()
);

-- Tabela de transações
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  points integer not null,
  description text not null,
  created_at timestamptz not null default now()
);

-- Index para busca por telefone
create index if not exists customers_phone_idx on customers(phone);

-- Index para histórico por cliente
create index if not exists transactions_customer_idx on transactions(customer_id, created_at desc);

-- RLS: habilitar Row Level Security
alter table customers enable row level security;
alter table transactions enable row level security;

-- Policy: anon pode ler e escrever (app client-side)
-- Em produção, mude para service_role no servidor
create policy "allow_anon_all_customers" on customers
  for all using (true) with check (true);

create policy "allow_anon_all_transactions" on transactions
  for all using (true) with check (true);
