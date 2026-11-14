-- Kantong pembayar per grup kategori: 'main' = budget rutin (dompet harian), 'reserve' = budget dari dana darurat.
-- Tetap dihitung di total budget bulanan; hanya dipisah di rincian dan membatasi pilihan dompet saat mencatat.
alter table public.categories add column if not exists pocket text;
alter table public.categories drop constraint if exists categories_pocket_check;
alter table public.categories add constraint categories_pocket_check check (pocket is null or pocket in ('main','reserve'));
