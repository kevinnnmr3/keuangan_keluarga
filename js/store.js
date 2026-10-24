/* =========================================================
   STORE — satu-satunya file yang bicara dengan Supabase.
   Semua view membaca objek S (bentuknya sama dengan prototipe),
   jadi kalau backend diganti, cukup file ini yang ditulis ulang.
   ========================================================= */
const sb = supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

let S = null;          // state aplikasi
let MEMBERS = {};      // id anggota -> {id, name, email, color, defWallet, userId}

const INV_TYPES = {
  gold:{label:'Emas', color:'var(--s4)'}, fund:{label:'Reksa Dana', color:'var(--s1)'},
  stock:{label:'Saham', color:'var(--s2)'}, deposit:{label:'Deposito', color:'var(--s3)'}, other:{label:'Lainnya', color:'var(--s5)'},
};

function localStamp(iso){ const d=new Date(iso); return dISO(d)+'T'+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); }
const num = v => v===null||v===undefined ? null : Number(v);

async function fetchAll(table, select='*', order='created_at'){
  const out=[]; const size=1000;
  for(let from=0;;from+=size){
    const { data, error } = await sb.from(table).select(select).order(order,{ascending:true}).range(from, from+size-1);
    if(error) throw error;
    out.push(...data); if(data.length<size) break;
  }
  return out;
}

async function loadAll(){
  const { data:{ user } } = await sb.auth.getUser();
  if(!user) { S=null; return null; }
  const [hh, mem, wal, cats, invs, lots, prices, recvs, rules, txns, bo, goals, pend, debts] = await Promise.all([
    fetchAll('households'), fetchAll('household_members'), fetchAll('wallets'), fetchAll('categories','*','sort'),
    fetchAll('investments'), fetchAll('investment_lots','*','date'), fetchAll('investment_prices','*','month'),
    fetchAll('receivables'), fetchAll('recurring_rules'), fetchAll('transactions','*','date'),
    fetchAll('budget_overrides','*','month'), fetchAll('goals','*','sort'), fetchAll('pending_transactions'), fetchAll('debts'),
  ]);
  const me = mem.find(m=>m.user_id===user.id);
  if(!me || !hh.length){ S={ user:null, noMember:true, email:user.email }; return S; }
  const household = hh[0];
  const firstWallet = wal.find(w=>!w.archived);
  MEMBERS = {};
  mem.sort((a,b)=>a.created_at<b.created_at?-1:1).forEach(m=>{
    MEMBERS[m.id] = { id:m.id, name:m.display_name, email:m.email, color:m.color_idx||0, userId:m.user_id,
      defWallet: m.default_wallet_id || firstWallet?.id || null, telegram:m.telegram_user_id };
  });
  const budgetOverride = {};
  bo.forEach(o=>{ (budgetOverride[o.month]=budgetOverride[o.month]||{})[o.category_id||'__total']=num(o.amount); });
  const mapPending = p => ({ id:p.id, owner:p.owner_member_id, dur:p.duration_sec||4, at:localStamp(p.created_at), transcript:p.transcript,
    parsed:p.parsed, status:p.status, result:p.status, by:p.reviewed_by, channel:p.channel });
  S = {
    user: me.id, email:user.email, household,
    wallets: wal.map(w=>({ id:w.id, name:w.name, short:w.short, type:w.type, brand:w.brand, owner:w.owner_member_id||'both',
      opening:num(w.opening_balance), openingDate:w.opening_date, archived:w.archived, acct:w.account_no||'', role:w.role||'budget' })),
    expCats: cats.filter(c=>c.kind==='expense').map(c=>({ id:c.id, kind:'expense', code:c.code, label:c.label, icon:c.icon, tint:c.tint, budget:num(c.budget)||0, parent:c.parent_id||null, archived:c.archived, sort:c.sort, custom:!c.code })),
    incCats: cats.filter(c=>c.kind==='income').map(c=>({ id:c.id, kind:'income', code:c.code, label:c.label, icon:c.icon, tint:c.tint, budget:0, parent:c.parent_id||null, archived:c.archived, sort:c.sort, custom:!c.code })),
    investments: invs.filter(i=>!i.archived).map(i=>({ id:i.id, type:i.type, name:i.name, symbol:i.symbol, unit:i.unit, icon:i.icon, sub:i.note||'',
      currentPrice:num(i.current_price), priceUpdated:i.price_updated_at,
      prices: prices.filter(p=>p.investment_id===i.id).map(p=>({month:p.month, price:num(p.price)})),
      lots: lots.filter(l=>l.investment_id===i.id).map(l=>({ id:l.id, date:l.date, side:l.side, qty:num(l.qty), price:num(l.price), fee:num(l.fee) })) })),
    receivables: recvs.map(r=>({ id:r.id, person:r.person, note:r.note||'', amount:num(r.amount), date:r.date, due:r.due })),
    recurring: rules.map(r=>({ id:r.id, name:r.name, type:r.type, amount:num(r.amount), wallet:r.wallet_id, to:r.to_wallet_id, cat:r.category_id, day:r.day, owner:r.owner_member_id, active:r.active })),
    txns: txns.map(t=>({ id:t.id, date:t.date, type:t.type, amount:num(t.amount), wallet:t.wallet_id, to:t.to_wallet_id, cat:t.category_id, note:t.note,
      owner:t.owner_member_id, source:t.source, inv:t.investment_id, lot:t.lot_id, recv:t.receivable_id, fundedFrom:t.funded_from, recurring:t.recurring_id, debt:t.debt_id||null, created:t.created_at })),
    debts: debts.map(d=>({ id:d.id, name:d.name, lender:d.lender||'', total:num(d.total), installment:num(d.installment)||0, tenor:d.tenor||null, start:d.start_month,
      paidBefore:num(d.paid_before)||0, cat:d.category_id||null, note:d.note||'', archived:d.archived })),
    budgetTotal: num(household.budget_total), budgetOverride,
    goals: goals.map(g=>({ id:g.id, icon:g.icon, name:g.name, target:num(g.target), saved:num(g.saved) })),
    pending: pend.filter(p=>p.status==='pending').map(mapPending),
    reviewed: pend.filter(p=>p.status!=='pending').sort((a,b)=>a.reviewed_at<b.reviewed_at?-1:1).slice(-10).map(mapPending),
  };
  S.txns.sort((a,b)=> a.date<b.date?-1:a.date>b.date?1:(a.created<b.created?-1:1));
  LEDGER_START = household.ledger_start;
  return S;
}

/* ---------- mutasi ---------- */
const must = ({ data, error }) => { if(error) throw error; return data; };
const toTxnRow = o => ({ date:o.date, type:o.type, amount:Math.round(o.amount), wallet_id:o.wallet, to_wallet_id:o.type==='transfer'?o.to:null,
  category_id:o.type==='transfer'?null:(o.cat||null), note:o.note||'', owner_member_id:o.owner||S.user, source:o.source||'app',
  funded_from:o.fundedFrom||null, recurring_id:o.recurring||null, investment_id:o.inv||null, receivable_id:o.recv||null,
  debt_id:o.type==='expense'?(o.debt||null):null });

const debtRow = d => ({ name:d.name, lender:d.lender||null, total:Math.round(d.total), installment:Math.round(d.installment||0), tenor:d.tenor||null,
  start_month:d.start, paid_before:Math.round(d.paidBefore||0), category_id:d.cat||null, note:d.note||null });

const DB = {
  addTxn: async o => must(await sb.from('transactions').insert(toTxnRow(o)).select('id').single()),
  updateTxn: async (id,o) => must(await sb.from('transactions').update({ ...toTxnRow(o), updated_at:new Date().toISOString() }).eq('id',id)),
  deleteTxn: async id => must(await sb.from('transactions').delete().eq('id',id)),
  addWallet: async w => must(await sb.from('wallets').insert({ name:w.name, short:w.short, type:w.type, brand:w.brand, owner_member_id:w.owner==='both'?null:w.owner,
    account_no:w.acct||null, opening_balance:w.opening||0, opening_date:w.openingDate, role:w.role||'budget', sort:S.wallets.length })),
  updateWallet: async (id,w) => must(await sb.from('wallets').update({ name:w.name, short:w.short, type:w.type, brand:w.brand, owner_member_id:w.owner==='both'?null:w.owner,
    account_no:w.acct||null, opening_balance:w.opening||0, opening_date:w.openingDate, role:w.role||'budget' }).eq('id',id)),
  archiveWallet: async (id,flag) => must(await sb.from('wallets').update({ archived:flag }).eq('id',id)),
  trade: async (p) => must(await sb.rpc('record_trade', { p_investment:p.inv, p_side:p.side, p_date:p.date, p_qty:p.qty, p_price:p.price, p_fee:p.fee||0, p_wallet:p.wallet, p_note:p.note })),
  createInvestment: async (p) => must(await sb.rpc('create_investment', { p_type:p.type, p_name:p.name, p_symbol:p.symbol||'', p_unit:p.unit||'unit', p_icon:p.icon,
    p_note:p.note||null, p_qty:p.qty, p_price:p.price, p_fee:p.fee||0, p_date:p.date, p_current:p.current, p_wallet:p.wallet||null })),
  setPrice: async (inv, price) => {
    must(await sb.from('investments').update({ current_price:price, price_updated_at:new Date().toISOString() }).eq('id',inv));
    must(await sb.from('investment_prices').upsert({ investment_id:inv, month:CUR_MONTH, price }, { onConflict:'investment_id,month' }));
  },
  createReceivable: async p => must(await sb.rpc('create_receivable', { p_person:p.person, p_note:p.note, p_amount:p.amount, p_date:p.date, p_due:p.due, p_wallet:p.wallet })),
  setBudgetDefault: async (total, cats) => {
    // Bekukan bulan-bulan lalu yang masih memakai default, supaya riwayat budget tidak ikut berubah.
    const past = ledgerMonths().filter(m=>m<CUR_MONTH && !S.budgetOverride[m]);
    const rows = [];
    past.forEach(m=>{ const b=budgetFor(m); if(!b.total && !Object.values(b.cats).some(v=>v>0)) return;
      rows.push({ month:m, category_id:null, amount:b.auto?0:b.total }); Object.entries(b.cats).forEach(([id,amt])=>{ if(amt>0) rows.push({ month:m, category_id:id, amount:amt }); }); });
    if(rows.length) must(await sb.from('budget_overrides').insert(rows));
    must(await sb.from('households').update({ budget_total:total }).eq('id',S.household.id));
    await Promise.all(Object.entries(cats).map(async ([id,amt])=> must(await sb.from('categories').update({ budget:amt }).eq('id',id))));
  },
  setBudgetMonth: async (month, total, cats) => {
    const rows=[{ month, category_id:null, amount:total||0 }, ...Object.entries(cats).filter(([,amt])=>amt>0).map(([id,amt])=>({ month, category_id:id, amount:amt }))];
    must(await sb.from('budget_overrides').delete().eq('month',month));
    must(await sb.from('budget_overrides').insert(rows));
  },
  clearBudgetMonth: async month => must(await sb.from('budget_overrides').delete().eq('month',month)),
  addGoal: async g => must(await sb.from('goals').insert({ icon:g.icon, name:g.name, target:g.target, saved:g.saved||0, sort:S.goals.length })),
  setGoalSaved: async (id,saved) => must(await sb.from('goals').update({ saved }).eq('id',id)),
  deleteGoal: async id => must(await sb.from('goals').delete().eq('id',id)),
  addCategory: async c => must(await sb.from('categories').insert({ kind:c.kind, label:c.label, icon:c.icon, budget:c.budget||0, tint:c.tint||'#EEF0F3', parent_id:c.parent||null, sort:c.sort??99 }).select('id').single()),
  updateCategory: async (id,c) => must(await sb.from('categories').update({ label:c.label, icon:c.icon, budget:c.budget||0, parent_id:c.parent||null, ...(c.tint?{tint:c.tint}:{}) }).eq('id',id)),
  archiveCategory: async (id,flag) => must(await sb.from('categories').update({ archived:flag }).eq('id',id)),
  deleteCategory: async id => must(await sb.from('categories').delete().eq('id',id)),
  toggleRecurring: async (id,active) => must(await sb.from('recurring_rules').update({ active }).eq('id',id)),
  addRecurring: async r => must(await sb.from('recurring_rules').insert({ name:r.name, type:r.type, amount:r.amount, wallet_id:r.wallet, to_wallet_id:r.type==='transfer'?r.to:null,
    category_id:r.type==='transfer'?null:r.cat, day:r.day, owner_member_id:r.owner })),
  deleteRecurring: async id => must(await sb.from('recurring_rules').delete().eq('id',id)),
  addPending: async (text, owner, parsed, dur) => must(await sb.from('pending_transactions').insert({ owner_member_id:owner, channel:'app', transcript:text, parsed, duration_sec:dur })),
  approvePending: async (id, x) => must(await sb.rpc('approve_pending', { p_pending:id, p_type:x.type, p_amount:Math.round(x.amount), p_wallet:x.wallet, p_to:x.to||null,
    p_category:x.cat||null, p_date:x.date, p_note:x.note||'', p_owner:x.owner||null, p_funded:x.fundedFrom||null })),
  rejectPending: async id => must(await sb.from('pending_transactions').update({ status:'rejected', reviewed_by:S.user, reviewed_at:new Date().toISOString() }).eq('id',id).eq('status','pending')),
  addDebt: async d => must(await sb.from('debts').insert(debtRow(d)).select('id').single()),
  updateDebt: async (id,d) => must(await sb.from('debts').update(debtRow(d)).eq('id',id)),
  archiveDebt: async (id,flag) => must(await sb.from('debts').update({ archived:flag }).eq('id',id)),
  deleteDebt: async id => must(await sb.from('debts').delete().eq('id',id)),
  linkDebtTxns: async (id, ids) => { if(ids.length) must(await sb.from('transactions').update({ debt_id:id }).in('id',ids)); },
  inviteMember: async (email,name) => must(await sb.from('household_members').insert({ household_id:S.household.id, email:email.trim().toLowerCase(), display_name:name, color_idx:Object.keys(MEMBERS).length })),
  removeInvite: async id => must(await sb.from('household_members').delete().eq('id',id)),
  updateMember: async (id, patch) => must(await sb.from('household_members').update(patch).eq('id',id)),
};
