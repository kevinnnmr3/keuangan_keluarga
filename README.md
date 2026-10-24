# Keuangan Keluarga

Website pencatatan keuangan keluarga: dompet, investasi, piutang, budget, tujuan, dan inbox catatan suara (Telegram).

## Arsitektur

| Bagian | Teknologi |
|---|---|
| Tampilan | HTML + CSS + JavaScript biasa (tanpa build), di-host Vercel |
| Data & login | Supabase (Postgres + Auth), region Singapura |
| Keamanan data | Row Level Security — hanya anggota `household_members` yang bisa baca/tulis |
| Pendaftaran | Hanya email yang sudah diizinkan (trigger `enforce_signup_allowlist`) |

Prinsip akuntansi: **saldo tidak disimpan**. Saldo dompet = saldo awal + semua transaksi.
Transfer, beli/jual investasi, dan piutang tidak dihitung sebagai pemasukan/pengeluaran.

## Struktur

```
index.html            halaman utama
assets/styles.css     desain (token warna terang/gelap)
js/config.js          URL & anon key Supabase (aman untuk publik; jangan taruh service_role key)
js/store.js           satu-satunya file yang bicara dengan Supabase
js/ledger.js          perhitungan saldo, arus kas, budget, investasi, kekayaan
js/parser.js          pembaca kalimat VN → draft transaksi
js/charts.js          grafik SVG
js/views.js           tampilan tiap halaman
js/app.js             routing, form, aksi
supabase/migrations/  skema database
```

## Menambah anggota keluarga

Pengaturan → Anggota keluarga → isi nama & email → anggota tersebut membuka website → **Daftar pertama kali**.

## Menjalankan lokal

Cukup sajikan folder ini dengan server statis apa pun, mis. `npx serve .`
