-- Peran dompet ketiga: 'transit' (mis. rekening penampung gaji) — pengeluaran di luar budget,
-- saldo tidak dihitung sebagai harta (tetap masuk kas & kekayaan bersih).
alter table public.wallets drop constraint if exists wallets_role_check;
alter table public.wallets add constraint wallets_role_check check (role in ('budget','savings','transit'));
