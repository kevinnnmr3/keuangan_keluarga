-- Pengeluaran bisa ditandai "luar budget" per transaksi, walau dibayar dari dompet budget
-- (mis. uang dana darurat dipindah dulu ke rekening harian lalu dibelanjakan).
alter table public.transactions add column if not exists off_budget boolean not null default false;
