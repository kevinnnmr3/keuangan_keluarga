-- =========================================================
-- Keuangan Keluarga — skema awal
-- Prinsip: saldo TIDAK disimpan, selalu dihitung dari
-- saldo awal dompet + transaksi (ledger).
-- Semua tabel dibatasi per household lewat RLS.
-- =========================================================

-- ---------- household & anggota ----------
create table public.households (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ledger_start date not null default current_date,
  budget_total bigint not null default 0 check (budget_total >= 0),
  created_at timestamptz not null default now()
);

create table public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  email text not null,
  user_id uuid unique references auth.users(id) on delete set null,
  display_name text not null,
  color_idx smallint not null default 0,
  default_wallet_id uuid,
  telegram_user_id bigint unique,
  created_at timestamptz not null default now()
);
create unique index household_members_email_key on public.household_members (lower(email));
create index household_members_household_idx on public.household_members (household_id);

-- ---------- helper (security definer, tanpa rekursi RLS) ----------
create or replace function public.is_member(hid uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.household_members m
                 where m.household_id = hid and m.user_id = (select auth.uid()));
$$;
create or replace function public.my_household()
returns uuid language sql stable security definer set search_path = '' as $$
  select m.household_id from public.household_members m where m.user_id = (select auth.uid()) limit 1;
$$;
create or replace function public.my_member()
returns uuid language sql stable security definer set search_path = '' as $$
  select m.id from public.household_members m where m.user_id = (select auth.uid()) limit 1;
$$;
revoke execute on function public.is_member(uuid), public.my_household(), public.my_member() from public, anon;
grant execute on function public.is_member(uuid), public.my_household(), public.my_member() to authenticated;

-- ---------- dompet & kategori ----------
create table public.wallets (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  name text not null,
  short text not null,
  type text not null check (type in ('bank','ewallet','cash','custom')),
  brand text not null default 'custom',
  owner_member_id uuid references public.household_members(id) on delete set null, -- null = bersama
  opening_balance bigint not null default 0,
  opening_date date not null default current_date,
  archived boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index wallets_household_idx on public.wallets (household_id);
create index wallets_owner_idx on public.wallets (owner_member_id);
alter table public.household_members
  add constraint household_members_default_wallet_fk foreign key (default_wallet_id) references public.wallets(id) on delete set null;
create index household_members_default_wallet_idx on public.household_members (default_wallet_id);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  kind text not null check (kind in ('expense','income')),
  code text,            -- kunci untuk parser suara (mis. 'dapur', 'makan')
  label text not null,
  icon text not null default '🏷️',
  tint text,
  budget bigint not null default 0 check (budget >= 0),
  sort int not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index categories_household_idx on public.categories (household_id);

-- ---------- investasi ----------
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  type text not null check (type in ('gold','fund','stock','deposit','other')),
  name text not null,
  symbol text,
  unit text not null default 'unit',
  icon text not null default '📈',
  note text,
  current_price numeric(20,4),
  price_updated_at timestamptz,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);
create index investments_household_idx on public.investments (household_id);

create table public.investment_lots (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  investment_id uuid not null references public.investments(id) on delete cascade,
  date date not null,
  side text not null check (side in ('initial','buy','sell')),
  qty numeric(24,6) not null check (qty > 0),
  price numeric(20,4) not null check (price >= 0),
  fee bigint not null default 0 check (fee >= 0),
  created_at timestamptz not null default now()
);
create index investment_lots_inv_idx on public.investment_lots (investment_id);
create index investment_lots_household_idx on public.investment_lots (household_id);

create table public.investment_prices (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  investment_id uuid not null references public.investments(id) on delete cascade,
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  price numeric(20,4) not null check (price >= 0),
  unique (investment_id, month)
);
create index investment_prices_household_idx on public.investment_prices (household_id);

-- ---------- piutang ----------
create table public.receivables (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  person text not null,
  note text,
  amount bigint not null check (amount > 0),
  date date not null,
  due date not null,
  created_at timestamptz not null default now(),
  check (due >= date)
);
create index receivables_household_idx on public.receivables (household_id);

-- ---------- aturan berulang ----------
create table public.recurring_rules (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  name text not null,
  type text not null check (type in ('expense','income','transfer')),
  amount bigint not null check (amount > 0),
  wallet_id uuid not null references public.wallets(id) on delete cascade,
  to_wallet_id uuid references public.wallets(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  day smallint not null check (day between 1 and 31),
  owner_member_id uuid references public.household_members(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index recurring_rules_household_idx on public.recurring_rules (household_id);
create index recurring_rules_wallet_idx on public.recurring_rules (wallet_id);
create index recurring_rules_to_wallet_idx on public.recurring_rules (to_wallet_id);
create index recurring_rules_category_idx on public.recurring_rules (category_id);
create index recurring_rules_owner_idx on public.recurring_rules (owner_member_id);

-- ---------- transaksi (ledger) ----------
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  date date not null,
  type text not null check (type in ('expense','income','transfer','inv_buy','inv_sell','recv_out','recv_pay')),
  amount bigint not null check (amount > 0),
  wallet_id uuid not null references public.wallets(id) on delete restrict,
  to_wallet_id uuid references public.wallets(id) on delete restrict,
  category_id uuid references public.categories(id) on delete set null,
  note text not null default '',
  owner_member_id uuid default public.my_member() references public.household_members(id) on delete set null,
  source text not null default 'app' check (source in ('app','telegram')),
  investment_id uuid references public.investments(id) on delete cascade,
  lot_id uuid references public.investment_lots(id) on delete cascade,
  receivable_id uuid references public.receivables(id) on delete cascade,
  funded_from uuid references public.transactions(id) on delete set null,
  recurring_id uuid references public.recurring_rules(id) on delete set null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transfer_needs_target check (type <> 'transfer' or (to_wallet_id is not null and to_wallet_id <> wallet_id)),
  constraint inv_needs_link check (type not in ('inv_buy','inv_sell') or investment_id is not null),
  constraint recv_needs_link check (type not in ('recv_out','recv_pay') or receivable_id is not null)
);
create index transactions_household_date_idx on public.transactions (household_id, date);
create index transactions_wallet_idx on public.transactions (wallet_id);
create index transactions_to_wallet_idx on public.transactions (to_wallet_id);
create index transactions_category_idx on public.transactions (category_id);
create index transactions_investment_idx on public.transactions (investment_id);
create index transactions_lot_idx on public.transactions (lot_id);
create index transactions_receivable_idx on public.transactions (receivable_id);
create index transactions_funded_idx on public.transactions (funded_from);
create index transactions_recurring_idx on public.transactions (recurring_id);
create index transactions_owner_idx on public.transactions (owner_member_id);

-- ---------- budget per bulan (opsional, menimpa default) ----------
create table public.budget_overrides (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  category_id uuid references public.categories(id) on delete cascade, -- null = budget total
  amount bigint not null check (amount >= 0),
  unique nulls not distinct (household_id, month, category_id)
);
create index budget_overrides_category_idx on public.budget_overrides (category_id);

-- ---------- tujuan ----------
create table public.goals (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  icon text not null default '🎯',
  name text not null,
  target bigint not null check (target > 0),
  saved bigint not null default 0 check (saved >= 0),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create index goals_household_idx on public.goals (household_id);

-- ---------- draft dari Telegram / suara ----------
create table public.pending_transactions (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null default public.my_household() references public.households(id) on delete cascade,
  owner_member_id uuid references public.household_members(id) on delete set null,
  channel text not null default 'telegram' check (channel in ('telegram','app')),
  telegram_chat_id bigint,
  telegram_message_id bigint,
  telegram_update_id bigint unique,           -- cegah draft dobel bila webhook dikirim ulang
  duration_sec int,
  transcript text not null,
  parsed jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reviewed_by uuid references public.household_members(id) on delete set null,
  reviewed_at timestamptz,
  transaction_id uuid references public.transactions(id) on delete set null,
  created_at timestamptz not null default now()
);
create index pending_household_status_idx on public.pending_transactions (household_id, status);
create index pending_owner_idx on public.pending_transactions (owner_member_id);
create index pending_reviewed_by_idx on public.pending_transactions (reviewed_by);
create index pending_txn_idx on public.pending_transactions (transaction_id);

-- ---------- RLS ----------
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.investments enable row level security;
alter table public.investment_lots enable row level security;
alter table public.investment_prices enable row level security;
alter table public.receivables enable row level security;
alter table public.recurring_rules enable row level security;
alter table public.transactions enable row level security;
alter table public.budget_overrides enable row level security;
alter table public.goals enable row level security;
alter table public.pending_transactions enable row level security;

create policy "anggota lihat household" on public.households for select to authenticated using (public.is_member(id));
create policy "anggota ubah household" on public.households for update to authenticated using (public.is_member(id)) with check (public.is_member(id));

create policy "anggota lihat anggota" on public.household_members for select to authenticated using (public.is_member(household_id));
create policy "anggota undang anggota" on public.household_members for insert to authenticated with check (public.is_member(household_id) and user_id is null);
create policy "anggota ubah anggota" on public.household_members for update to authenticated using (public.is_member(household_id)) with check (public.is_member(household_id));
create policy "anggota hapus undangan" on public.household_members for delete to authenticated using (public.is_member(household_id) and user_id is null);

do $$
declare t text;
begin
  foreach t in array array['wallets','categories','investments','investment_lots','investment_prices','receivables',
                           'recurring_rules','transactions','budget_overrides','goals','pending_transactions']
  loop
    execute format('create policy "anggota kelola %1$s" on public.%1$I for all to authenticated
                    using (public.is_member(household_id)) with check (public.is_member(household_id))', t);
  end loop;
end $$;

-- ---------- daftar hanya untuk email yang diizinkan ----------
create or replace function public.enforce_signup_allowlist()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not exists (select 1 from public.household_members m where lower(m.email) = lower(new.email)) then
    raise exception 'Email ini belum diizinkan untuk aplikasi Keuangan Keluarga.';
  end if;
  -- email sudah diverifikasi lewat allowlist; tak perlu link konfirmasi
  new.email_confirmed_at := coalesce(new.email_confirmed_at, now());
  return new;
end $$;
create trigger enforce_signup_allowlist before insert on auth.users
  for each row execute function public.enforce_signup_allowlist();

create or replace function public.link_member_on_signup()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.household_members set user_id = new.id
   where lower(email) = lower(new.email) and user_id is null;
  return new;
end $$;
create trigger link_member_on_signup after insert on auth.users
  for each row execute function public.link_member_on_signup();
revoke execute on function public.enforce_signup_allowlist(), public.link_member_on_signup() from public, anon, authenticated;

-- ---------- RPC atomik (security invoker → RLS tetap berlaku) ----------
create or replace function public.record_trade(p_investment uuid, p_side text, p_date date, p_qty numeric,
  p_price numeric, p_fee bigint, p_wallet uuid, p_note text)
returns uuid language plpgsql set search_path = '' as $$
declare v_lot uuid; v_amount bigint; v_txn uuid;
begin
  if p_side not in ('buy','sell') then raise exception 'side tidak valid'; end if;
  insert into public.investment_lots (investment_id, date, side, qty, price, fee)
    values (p_investment, p_date, p_side, p_qty, p_price, coalesce(p_fee,0)) returning id into v_lot;
  v_amount := round(case when p_side = 'buy' then p_qty*p_price + coalesce(p_fee,0) else p_qty*p_price - coalesce(p_fee,0) end);
  insert into public.transactions (date, type, amount, wallet_id, investment_id, lot_id, note)
    values (p_date, case when p_side='buy' then 'inv_buy' else 'inv_sell' end, v_amount, p_wallet, p_investment, v_lot, coalesce(p_note,''))
    returning id into v_txn;
  return v_txn;
end $$;

create or replace function public.create_investment(p_type text, p_name text, p_symbol text, p_unit text, p_icon text,
  p_note text, p_qty numeric, p_price numeric, p_fee bigint, p_date date, p_current numeric, p_wallet uuid)
returns uuid language plpgsql set search_path = '' as $$
declare v_inv uuid; v_lot uuid;
begin
  insert into public.investments (type, name, symbol, unit, icon, note, current_price, price_updated_at)
    values (p_type, p_name, nullif(p_symbol,''), coalesce(nullif(p_unit,''),'unit'), coalesce(p_icon,'📈'), p_note, p_current, now())
    returning id into v_inv;
  insert into public.investment_lots (investment_id, date, side, qty, price, fee)
    values (v_inv, p_date, case when p_wallet is null then 'initial' else 'buy' end, p_qty, p_price, coalesce(p_fee,0))
    returning id into v_lot;
  if p_wallet is not null then
    insert into public.transactions (date, type, amount, wallet_id, investment_id, lot_id, note)
      values (p_date, 'inv_buy', round(p_qty*p_price + coalesce(p_fee,0)), p_wallet, v_inv, v_lot, 'Beli ' || coalesce(nullif(p_symbol,''), p_name));
  end if;
  return v_inv;
end $$;

create or replace function public.create_receivable(p_person text, p_note text, p_amount bigint, p_date date, p_due date, p_wallet uuid)
returns uuid language plpgsql set search_path = '' as $$
declare v_id uuid;
begin
  insert into public.receivables (person, note, amount, date, due) values (p_person, p_note, p_amount, p_date, p_due) returning id into v_id;
  insert into public.transactions (date, type, amount, wallet_id, receivable_id, note)
    values (p_date, 'recv_out', p_amount, p_wallet, v_id, 'Pinjaman ke ' || p_person);
  return v_id;
end $$;

create or replace function public.approve_pending(p_pending uuid, p_type text, p_amount bigint, p_wallet uuid, p_to uuid,
  p_category uuid, p_date date, p_note text, p_owner uuid, p_funded uuid)
returns uuid language plpgsql set search_path = '' as $$
declare v_txn uuid; v_status text;
begin
  select status into v_status from public.pending_transactions where id = p_pending for update;
  if v_status is null then raise exception 'Draft tidak ditemukan'; end if;
  if v_status <> 'pending' then raise exception 'Draft sudah direview'; end if;
  insert into public.transactions (date, type, amount, wallet_id, to_wallet_id, category_id, note, owner_member_id, source, funded_from)
    values (p_date, p_type, p_amount, p_wallet, case when p_type='transfer' then p_to end,
            case when p_type<>'transfer' then p_category end, coalesce(p_note,''), p_owner, 'telegram', p_funded)
    returning id into v_txn;
  update public.pending_transactions set status='approved', reviewed_by=public.my_member(), reviewed_at=now(), transaction_id=v_txn
   where id = p_pending;
  return v_txn;
end $$;

revoke execute on function public.record_trade(uuid,text,date,numeric,numeric,bigint,uuid,text),
  public.create_investment(text,text,text,text,text,text,numeric,numeric,bigint,date,numeric,uuid),
  public.create_receivable(text,text,bigint,date,date,uuid),
  public.approve_pending(uuid,text,bigint,uuid,uuid,uuid,date,text,uuid,uuid) from public, anon;
grant execute on function public.record_trade(uuid,text,date,numeric,numeric,bigint,uuid,text),
  public.create_investment(text,text,text,text,text,text,numeric,numeric,bigint,date,numeric,uuid),
  public.create_receivable(text,text,bigint,date,date,uuid),
  public.approve_pending(uuid,text,bigint,uuid,uuid,uuid,date,text,uuid,uuid) to authenticated;
