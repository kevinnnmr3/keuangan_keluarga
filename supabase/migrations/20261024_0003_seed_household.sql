-- Data awal (dijalankan sekali): household, anggota pertama, kategori bawaan.
-- Catatan: 'code' dipakai parser suara untuk mencocokkan kategori.
with h as (
  insert into public.households (name, ledger_start, budget_total) values ('Keuangan Keluarga', '2026-10-01', 16000000) returning id
), m as (
  insert into public.household_members (household_id, email, display_name, color_idx)
  select id, 'kevinnnmr3@gmail.com', 'Ayah', 0 from h returning household_id
)
insert into public.categories (household_id, kind, code, label, icon, tint, budget, sort)
select (select household_id from m limit 1), c.kind, c.code, c.label, c.icon, c.tint, c.budget, c.sort from (values
 ('expense','makan','Makan & Minum','🍽️','#FDE8E4',3500000,1),
 ('expense','dapur','Belanja Dapur','🛒','#FBF0DC',2800000,2),
 ('expense','rumah','Sewa & Rumah','🏠','#E6EEF9',2600000,3),
 ('expense','transport','Transportasi','⛽','#E8F2EC',1200000,4),
 ('expense','tagihan','Tagihan','💡','#FFF6D6',1150000,5),
 ('expense','anak','Anak','🧸','#F7E6EF',1500000,6),
 ('expense','kesehatan','Kesehatan','💊','#E5F4F1',400000,7),
 ('expense','hiburan','Hiburan','🎬','#ECE8FB',500000,8),
 ('expense','pribadi','Belanja Pribadi','🛍️','#F5E6FA',800000,9),
 ('expense','sosial','Keluarga & Sosial','🤲','#EFEBE4',900000,10),
 ('expense','lainnya','Lainnya','✨','#EEF0F3',300000,11),
 ('income','gaji','Gaji','💼','#E6EEF9',0,1),
 ('income','freelance','Freelance','💻','#ECE8FB',0,2),
 ('income','usaha','Usaha','🏪','#FBF0DC',0,3),
 ('income','hasilinv','Hasil Investasi','📈','#E1F3E9',0,4),
 ('income','lainmasuk','Lainnya','🎁','#EEF0F3',0,5)
) as c(kind,code,label,icon,tint,budget,sort);
