-- Nomor rekening / nomor HP e-wallet (opsional), ditampilkan tersamar di kartu dompet.
alter table public.wallets add column if not exists account_no text check (account_no is null or length(account_no) <= 40);
-- Catatan: data dompet keluarga (Cash, Seabank, BCA, BSI, Jago, ShopeePay, CIMB Payroll, Mandiri)
-- diisi langsung lewat SQL pada 2026-10-25 dan tidak disimpan di repo karena berisi nomor rekening.
