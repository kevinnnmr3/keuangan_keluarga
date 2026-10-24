-- =========================================================
-- Sub-kategori (seperti "pos" di versi Apps Script) + budget opsional.
-- - categories.parent_id: grup (parent null) → sub-kategori.
-- - Transaksi menunjuk ke sub-kategori (atau ke kategori tanpa sub).
-- - budget = budget default bulanan (0 = tanpa budget / insidental).
-- Aman dijalankan pada data yang sudah berisi transaksi: baris kategori
-- lama TIDAK dihapus, hanya dipindah ke bawah grup baru, jadi riwayat utuh.
-- =========================================================
alter table public.categories add column if not exists parent_id uuid references public.categories(id) on delete cascade;
create index if not exists categories_parent_idx on public.categories (parent_id);
alter table public.categories drop constraint if exists categories_no_self_parent;
alter table public.categories add constraint categories_no_self_parent check (parent_id is null or parent_id <> id);

do $$
declare hid uuid;
begin
  for hid in select id from public.households loop
    create temp table if not exists _g(code text, label text, icon text, tint text, sort int) on commit drop;
    create temp table if not exists _s(code text, label text, icon text, grp text, sort int) on commit drop;
    truncate _g; truncate _s;
    insert into _g values
     ('g_tinggal','Tempat Tinggal & Tagihan','🏠','#E6EEF9',1),
     ('g_rt','Kebutuhan Rumah Tangga','🛒','#FBF0DC',2),
     ('g_makan','Makan di Luar','🍽️','#FDE8E4',3),
     ('g_anak','Keluarga & Anak','🧸','#F7E6EF',4),
     ('g_nafkah','Nafkah Orang Tua/Keluarga','🤲','#EFEBE4',5),
     ('g_transport','Transportasi & Kendaraan','🚗','#E8F2EC',6),
     ('g_personal','Pakaian & Personal','🛍️','#F5E6FA',7),
     ('g_rawat','Perawatan Diri','💆','#ECE8FB',8),
     ('g_sehat','Kesehatan','🩺','#E5F4F1',9),
     ('g_cicilan','Cicilan & Kewajiban','💳','#FFF6D6',10),
     ('g_darurat','Darurat','🚨','#FBE7E7',11),
     ('g_lain','Lain-lain','✨','#EEF0F3',12);
    insert into _s values
     ('rumah','Kontrakan / Kos / KPR','🏠','g_tinggal',1),('listrik','Listrik','💡','g_tinggal',2),('internet','WiFi / Internet','📶','g_tinggal',3),
     ('air','Air','🚰','g_tinggal',4),('gas','Gas','🔥','g_tinggal',5),('pulsa','Pulsa & paket data','📱','g_tinggal',6),('tagihan','Tagihan lain','🧾','g_tinggal',7),
     ('dapur','Belanja dapur','🥬','g_rt',1),('groceries','Groceries','🧴','g_rt',2),('jajan','Jajan','🍡','g_rt',3),
     ('makan','Makan di luar','🍽️','g_makan',1),
     ('anak','Anak','🧸','g_anak',1),('suplemen','Suplemen','💊','g_anak',2),
     ('ortu','Orang tua','👵','g_nafkah',1),('keluarga','Keluarga','👨‍👩‍👧','g_nafkah',2),
     ('transport','Transportasi','🚌','g_transport',1),('bensin','Bensin','⛽','g_transport',2),('servis','Servis kendaraan','🔧','g_transport',3),
     ('baju','Baju','👕','g_personal',1),('pribadi','Perlengkapan pribadi','🧺','g_personal',2),
     ('skincare','Skincare / Perawatan','🧖','g_rawat',1),
     ('kesehatan','Kesehatan','🩺','g_sehat',1),('obat','Obat','💊','g_sehat',2),
     ('cicilan','Hutang / Cicilan','💳','g_cicilan',1),
     ('darurat','Darurat','🚨','g_darurat',1),
     ('hiburan','Hiburan','🎬','g_lain',1),('lainnya','Lain-lain','✨','g_lain',2);

    -- grup
    insert into public.categories (household_id, kind, code, label, icon, tint, sort)
    select hid, 'expense', g.code, g.label, g.icon, g.tint, g.sort from _g g
    where not exists (select 1 from public.categories c where c.household_id = hid and c.code = g.code);

    -- kategori lama "Keluarga & Sosial" (code sosial) menjadi sub "Keluarga"
    update public.categories set code = 'keluarga'
     where household_id = hid and kind = 'expense' and code = 'sosial'
       and not exists (select 1 from public.categories x where x.household_id = hid and x.code = 'keluarga');

    -- kategori bawaan yang sudah ada → pindah ke bawah grupnya (id tetap, transaksi tetap terhubung)
    update public.categories c
       set label = s.label, icon = s.icon, sort = s.sort,
           tint = (select g.tint from _g g where g.code = s.grp),
           parent_id = (select p.id from public.categories p where p.household_id = hid and p.code = s.grp)
      from _s s
     where c.household_id = hid and c.kind = 'expense' and c.code = s.code and c.parent_id is null;

    -- sub yang belum ada
    insert into public.categories (household_id, kind, code, label, icon, tint, parent_id, sort)
    select hid, 'expense', s.code, s.label, s.icon, g.tint,
           (select p.id from public.categories p where p.household_id = hid and p.code = s.grp), s.sort
      from _s s join _g g on g.code = s.grp
     where not exists (select 1 from public.categories c where c.household_id = hid and c.code = s.code);

    -- budget contoh dari seed awal dikosongkan (budget sekarang opsional); nilai yang sudah diubah pengguna tidak disentuh
    update public.categories set budget = 0
     where household_id = hid and (code, budget) in (('makan',3500000),('dapur',2800000),('rumah',2600000),('transport',1200000),
       ('tagihan',1150000),('anak',1500000),('kesehatan',400000),('hiburan',500000),('pribadi',800000),('keluarga',900000),('lainnya',300000));
    update public.households set budget_total = 0 where id = hid and budget_total = 16000000;
  end loop;
end $$;
