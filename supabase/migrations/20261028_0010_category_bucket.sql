-- Jenis pengeluaran per grup kategori untuk kartu "Progres bulan ini":
-- need = kebutuhan, want = keinginan, save = tabungan. Null = pakai tebakan bawaan dari code grup.
alter table public.categories add column if not exists bucket text;
alter table public.categories drop constraint if exists categories_bucket_check;
alter table public.categories add constraint categories_bucket_check check (bucket is null or bucket in ('need','want','save'));
