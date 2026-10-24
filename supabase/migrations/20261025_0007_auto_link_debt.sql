-- Pengeluaran baru di kategori yang ditautkan ke utang aktif otomatis dicatat sebagai
-- pembayaran cicilannya — dari jalur mana pun (aplikasi, VN, bot Telegram, transaksi berulang).
create or replace function public.auto_link_debt()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.type = 'expense' and new.debt_id is null and new.category_id is not null then
    select d.id into new.debt_id
      from public.debts d
     where d.household_id = new.household_id and d.category_id = new.category_id and not d.archived
       and d.total - d.paid_before - coalesce((select sum(t.amount) from public.transactions t where t.debt_id = d.id), 0) > 0
     order by d.created_at
     limit 1;
  end if;
  return new;
end $$;
revoke execute on function public.auto_link_debt() from public, anon, authenticated;
drop trigger if exists auto_link_debt on public.transactions;
create trigger auto_link_debt before insert on public.transactions
  for each row execute function public.auto_link_debt();
