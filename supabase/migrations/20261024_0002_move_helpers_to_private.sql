-- Helper RLS dipindah ke skema private agar tidak bisa dipanggil lewat REST API.
create schema if not exists private;
grant usage on schema private to authenticated;
alter function public.is_member(uuid) set schema private;
alter function public.my_household() set schema private;
alter function public.my_member() set schema private;

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
  update public.pending_transactions set status='approved', reviewed_by=private.my_member(), reviewed_at=now(), transaction_id=v_txn
   where id = p_pending;
  return v_txn;
end $$;
