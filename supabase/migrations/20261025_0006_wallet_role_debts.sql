-- =========================================================
-- 1) Peran dompet: 'budget' (default) atau 'savings' (tabungan / dana darurat).
--    Pengeluaran dari dompet 'savings' tetap masuk total pengeluaran,
--    tapi dipisahkan sebagai "luar budget" dan tidak memotong budget bulanan.
-- 2) Utang & cicilan: sisa utang = liabilitas (mengurangi kekayaan bersih).
--    Pembayaran = transaksi pengeluaran biasa (masuk budget kategorinya)
--    yang ditautkan lewat transactions.debt_id.
-- =========================================================
alter table public.wallets add column if not exists role text not null default 'budget';
alter table public.wallets drop constraint if exists wallets_role_check;
alter table public.wallets add constraint wallets_role_check check (role in ('budget','savings'));

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default private.my_household() references public.households(id) on delete cascade,
  name text not null,
  lender text,
  total bigint not null check (total > 0),
  installment bigint not null default 0 check (installment >= 0),
  tenor smallint check (tenor is null or tenor > 0),
  start_month text not null check (start_month ~ '^\d{4}-\d{2}$'),
  paid_before bigint not null default 0 check (paid_before >= 0),  -- dibayar sebelum ledger_start
  category_id uuid references public.categories(id) on delete set null,
  note text,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists debts_household_idx on public.debts (household_id);
create index if not exists debts_category_idx on public.debts (category_id);
alter table public.debts enable row level security;
drop policy if exists "anggota kelola debts" on public.debts;
create policy "anggota kelola debts" on public.debts for all to authenticated
  using (private.is_member(household_id)) with check (private.is_member(household_id));

alter table public.transactions add column if not exists debt_id uuid references public.debts(id) on delete set null;
create index if not exists transactions_debt_idx on public.transactions (debt_id);
alter table public.transactions drop constraint if exists debt_only_expense;
alter table public.transactions add constraint debt_only_expense check (debt_id is null or type = 'expense');
