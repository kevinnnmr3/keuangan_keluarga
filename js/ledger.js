/* =========================================================
   LEDGER — semua angka diturunkan dari transaksi.
   Aturan akuntansi:
   - expense  : dompet −   (mengurangi kekayaan, masuk laporan pengeluaran)
   - income   : dompet +   (menambah kekayaan, masuk laporan pemasukan)
   - transfer : dompet A −, dompet B +  (kekayaan tetap, BUKAN pemasukan/pengeluaran)
   - inv_buy  : dompet −, investasi +   (kekayaan tetap, bukan pengeluaran)
   - inv_sell : investasi −, dompet +   (selisih vs modal = realized P/L, bukan pemasukan)
   - recv_out : dompet −, piutang +     (bukan pengeluaran)
   - recv_pay : piutang −, dompet +     (bukan pemasukan)
   ========================================================= */
function effects(t){
  switch(t.type){
    case 'expense': case 'inv_buy': case 'recv_out': return [{w:t.wallet,d:-t.amount}];
    case 'income':  case 'inv_sell': case 'recv_pay': return [{w:t.wallet,d:+t.amount}];
    case 'transfer': return [{w:t.wallet,d:-t.amount},{w:t.to,d:+t.amount}];
  }
  return [];
}
const TYPE_LABEL = { expense:'Pengeluaran', income:'Pemasukan', transfer:'Transfer', inv_buy:'Beli investasi', inv_sell:'Jual investasi', recv_out:'Piutang keluar', recv_pay:'Terima piutang' };

/* ---------- format Indonesia ---------- */
const MON = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
const MONL = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const DAYS = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
const idn = (n,d=0) => Number(n).toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
function rp(n,o={}){ const a=Math.abs(Math.round(n)); const s=n<0?'−':(o.sign&&n>0?'+':''); return s+'Rp '+idn(a); }
function rpc(n,o={}){ // ringkas: 12,8 jt
  const a=Math.abs(n), s=n<0?'−':(o.sign&&n>0?'+':'');
  if(a>=1e9) return s+'Rp '+idn(a/1e9, a>=1e10?1:2)+' M';
  if(a>=1e6) return s+'Rp '+idn(a/1e6, a>=1e8?0:1)+' jt';
  if(a>=1e3) return s+'Rp '+idn(a/1e3,0)+' rb';
  return s+'Rp '+idn(a);
}
const axisC = n => { const a=Math.abs(n); if(a>=1e9) return idn(n/1e9,1)+'M'; if(a>=1e6) return idn(n/1e6,a%1e6?1:0)+'jt'; if(a>=1e3) return idn(n/1e3)+'rb'; return idn(n); };
const pctS = (p,d=1) => (p>0?'+':p<0?'−':'')+idn(Math.abs(p),d)+'%';
const M = (n,o) => `<span class="m num">${rp(n,o)}</span>`;
const MC = (n,o) => `<span class="m num">${rpc(n,o)}</span>`;
function dParse(s){ const [y,m,d]=s.slice(0,10).split('-').map(Number); return new Date(y,m-1,d); }
function dISO(dt){ return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')+'-'+String(dt.getDate()).padStart(2,'0'); }
function dAdd(s,n){ const d=dParse(s); d.setDate(d.getDate()+n); return dISO(d); }
const fDate = s => { const d=dParse(s); return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear(); };
const fDay = s => { const d=dParse(s); const lbl = s===TODAY?'Hari ini':s===dAdd(TODAY,-1)?'Kemarin':DAYS[d.getDay()]; return lbl+', '+d.getDate()+' '+MON[d.getMonth()]; };
const fMonth = m => { const [y,mo]=m.split('-').map(Number); return MONL[mo-1]+' '+y; };
const fMon = m => { const [y,mo]=m.split('-').map(Number); return MON[mo-1]+(y!==2026?' '+String(y).slice(2):''); };
const monthOf = s => s.slice(0,7);
const prevMonth = m => { let [y,mo]=m.split('-').map(Number); mo--; if(!mo){mo=12;y--;} return y+'-'+String(mo).padStart(2,'0'); };
const nextMonth = m => { let [y,mo]=m.split('-').map(Number); mo++; if(mo>12){mo=1;y++;} return y+'-'+String(mo).padStart(2,'0'); };
const daysIn = m => { const [y,mo]=m.split('-').map(Number); return new Date(y,mo,0).getDate(); };
const monthEnd = m => m+'-'+String(daysIn(m)).padStart(2,'0');
let TODAY, CUR_MONTH, TODAY_DAY, LEDGER_START = '2026-10-01';
function setToday(){ const d=new Date(); TODAY=dISO(d); CUR_MONTH=TODAY.slice(0,7); TODAY_DAY=d.getDate(); }
const pct = (a,b) => b ? a/b*100 : 0;
function ledgerMonths(){ const out=[]; let m=monthOf(LEDGER_START); while(m<=CUR_MONTH){ out.push(m); m=nextMonth(m); } return out; }

/* ---------- lookup ---------- */
const W = id => S.wallets.find(w=>w.id===id) || {id, name:'(dompet dihapus)', short:'?', brand:'custom', type:'custom'};
const cat = (id,type) => (type==='income'?S.incCats:S.expCats).find(c=>c.id===id) || S.expCats.find(c=>c.id===id) || S.incCats.find(c=>c.id===id) || {id, label:'Lainnya', icon:'✨'};
/* kategori bertingkat: grup (parent null) → sub. Daun = kategori tanpa anak (dipakai transaksi). */
const catList = kind => kind==='income' ? S.incCats : S.expCats;
const bySort = (a,b) => (a.sort??0)-(b.sort??0) || a.label.localeCompare(b.label);
const kidsOf = (id, kind, all) => catList(kind).filter(c=>c.parent===id && (all || !c.archived)).sort(bySort);
const groupCats = (kind, all) => catList(kind).filter(c=>!c.parent && (all || !c.archived)).sort(bySort);
const isLeaf = c => !catList(c.kind||'expense').some(x=>x.parent===c.id && !x.archived);
function leafCats(kind, all){ const out=[]; groupCats(kind, all).forEach(g=>{ const k=kidsOf(g.id,kind,all); if(k.length) out.push(...k); else if(all || !catList(kind).some(x=>x.parent===g.id)) out.push(g); }); return out; }
function groupOf(id){ const c=cat(id); if(!c || !c.parent) return c; return S.expCats.find(x=>x.id===c.parent) || S.incCats.find(x=>x.id===c.parent) || c; }
function catFull(id,type){ const c=cat(id,type); const g=groupOf(id); return g && g.id!==c.id ? c.label+' · '+g.label : c.label; }
const INV = id => S.investments.find(i=>i.id===id);
const RECV = id => S.receivables.find(r=>r.id===id);

/* ---------- saldo dompet ---------- */
function balances(upto){ // upto = 'YYYY-MM-DD' inklusif, null = semua
  const b = {}; S.wallets.forEach(w=> b[w.id] = (!upto || w.openingDate<=dAdd(upto,1)) ? w.opening : 0); // saldo awal = posisi pada awal hari openingDate
  S.txns.forEach(t=>{ if(upto && t.date>upto) return; effects(t).forEach(e=>{ if(b[e.w]!==undefined) b[e.w]+=e.d; }); });
  return b;
}
function walletTotal(upto){ const b=balances(upto); return S.wallets.filter(w=>!w.archived || b[w.id]!==0).reduce((s,w)=>s+b[w.id],0); }

/* ---------- pemasukan & pengeluaran ---------- */
function inRange(t,m,uptoDay){ if(monthOf(t.date)!==m) return false; return !uptoDay || Number(t.date.slice(8))<=uptoDay; }
/* Sumber dana pengeluaran:
   - dari budget  : dibayar dari dompet berperan "budget" (default)
   - luar budget  : dibayar dari dompet "tabungan / dana darurat" (harta), atau ditandai didanai dari jual aset.
   Total pengeluaran = keduanya. Perbandingan dengan budget hanya memakai yang "dari budget". */
const fundSource = t => t.fundedFrom ? 'asset' : (W(t.wallet).role==='savings' ? 'savings' : 'budget');
const offBudget = t => t.type==='expense' && fundSource(t)!=='budget';
function flows(m,uptoDay){
  let income=0, expense=0, budgetExp=0, savingsExp=0, assetExp=0; const byCat={}, byInc={}, byWallet={}, byGroup={}, byCatB={}, byGroupB={};
  const add = (o,k,v) => o[k]=(o[k]||0)+v;
  S.txns.forEach(t=>{ if(!inRange(t,m,uptoDay)) return;
    if(t.type==='income'){ income+=t.amount; add(byInc,t.cat,t.amount); }
    if(t.type==='expense'){ expense+=t.amount; const g=groupOf(t.cat); const gid=g?g.id:'_';
      add(byCat,t.cat,t.amount); add(byGroup,gid,t.amount); add(byWallet,t.wallet,t.amount);
      const src=fundSource(t);
      if(src==='budget'){ budgetExp+=t.amount; add(byCatB,t.cat,t.amount); add(byGroupB,gid,t.amount); }
      else if(src==='savings') savingsExp+=t.amount; else assetExp+=t.amount; }
  });
  return { income, expense, net:income-expense, byCat, byInc, byWallet, byGroup, byCatB, byGroupB,
    budgetExp, offExp:savingsExp+assetExp, savingsExp, assetExp, fromAsset:assetExp };
}
const isPartial = m => m===CUR_MONTH;
const monthLabel = m => isPartial(m) ? fMon(m)+' (1–'+TODAY_DAY+')' : fMon(m);

/* ---------- budget ---------- */
/* Budget bulan m: override bulan itu (kalau pernah disimpan/dibekukan) atau default tiap sub-kategori.
   Default 0 = tanpa budget (opsional). Total kosong = jumlah semua sub. */
function budgetFor(m){
  const o = S.budgetOverride[m];
  const cats = {}; leafCats('expense', true).forEach(c=> cats[c.id] = o ? (o[c.id]||0) : (c.budget||0));
  const sum = Object.values(cats).reduce((a,b)=>a+b,0);
  let total = o ? (o.__total||0) : (S.budgetTotal||0); const auto = !total; if(auto) total = sum;
  return { total, cats, sum, auto, overridden:!!o, any: total>0 };
}
function groupBudget(g, bud){ const k=kidsOf(g.id,'expense',true); return k.length ? k.reduce((s,c)=>s+(bud.cats[c.id]||0),0) : (bud.cats[g.id]||0); }

/* ---------- investasi (metode biaya rata-rata) ---------- */
function priceAt(inv, m){
  if(inv.type==='deposit') return null;
  m = m || CUR_MONTH;
  if(m>=CUR_MONTH && inv.currentPrice!=null) return inv.currentPrice;
  let p=null; (inv.prices||[]).forEach(x=>{ if(x.month<=m) p=x.price; });
  if(p!=null) return p;
  let lp=null; inv.lots.slice().sort((a,b)=>a.date<b.date?-1:1).forEach(l=>{ if(monthOf(l.date)<=m) lp=l.price; });
  return lp ?? inv.currentPrice ?? 0;
}
function holding(inv, upto){
  let qty=0, cost=0, realized=0, fees=0;
  inv.lots.slice().sort((a,b)=>a.date<b.date?-1:1).forEach(l=>{
    if(upto && l.date>upto) return;
    if(l.side==='sell'){ const avg = qty?cost/qty:0; realized += l.qty*l.price - l.fee - avg*l.qty; cost -= avg*l.qty; qty -= l.qty; fees+=l.fee; }
    else { qty += l.qty; cost += l.qty*l.price + l.fee; fees+=l.fee; }
  });
  const m = upto ? monthOf(upto) : null;
  const price = inv.type==='deposit' ? null : priceAt(inv, m);
  const value = inv.type==='deposit' ? cost : qty*price;
  return { qty, cost, avg: qty? cost/qty : 0, price, value, unreal: value-cost, unrealPct: cost? (value-cost)/cost*100 : 0, realized, fees };
}
function portfolio(upto){
  let cost=0, value=0, realized=0; const byType={};
  S.investments.forEach(i=>{ const h=holding(i,upto); cost+=h.cost; value+=h.value; realized+=h.realized; byType[i.type]=(byType[i.type]||0)+h.value; });
  return { cost, value, unreal:value-cost, unrealPct: cost?(value-cost)/cost*100:0, realized, byType };
}

/* ---------- piutang ---------- */
function recvInfo(r, upto){
  let paid=0; const pays=[];
  S.txns.forEach(t=>{ if(t.recv===r.id && t.type==='recv_pay' && (!upto||t.date<=upto)){ paid+=t.amount; pays.push(t); } });
  const started = !upto || r.date<=upto;
  const out = started ? Math.max(0, r.amount-paid) : 0;
  let status = out===0 ? 'lunas' : paid>0 ? 'sebagian' : 'belum';
  const overdue = out>0 && r.due < TODAY;
  return { paid, out, status, overdue, pays };
}
const recvTotal = upto => S.receivables.reduce((s,r)=>s+recvInfo(r,upto).out,0);

/* ---------- utang & cicilan ----------
   Sisa utang = total − dibayar sebelum pencatatan − pembayaran yang ditautkan (transaksi pengeluaran dengan debt).
   Pembayaran tetap pengeluaran (masuk budget kategorinya) sekaligus mengurangi liabilitas. */
const addMonths = (m,n) => { let [y,mo]=m.split('-').map(Number); mo+=n; y+=Math.floor((mo-1)/12); mo=((mo-1)%12+12)%12+1; return y+'-'+String(mo).padStart(2,'0'); };
const monthsBetween = (a,b) => { const [y1,m1]=a.split('-').map(Number), [y2,m2]=b.split('-').map(Number); return (y2-y1)*12+(m2-m1); };
const DEBT = id => S.debts.find(d=>d.id===id);
function debtInfo(d, upto){
  let paidL=0; const pays=[];
  S.txns.forEach(t=>{ if(t.debt===d.id && (!upto||t.date<=upto)){ paidL+=t.amount; pays.push(t); } });
  const started = !upto || d.start<=monthOf(upto);
  const paid = d.paidBefore + paidL;
  const out = started ? Math.max(0, d.total-paid) : 0;
  const n = d.installment ? Math.floor(paid/d.installment+1e-9) : null;
  const left = d.installment ? Math.ceil(out/d.installment-1e-9) : null;
  const paidThisMonth = pays.some(t=>monthOf(t.date)===CUR_MONTH);
  const end = d.tenor ? addMonths(d.start, d.tenor-1) : (left ? addMonths(paidThisMonth?nextMonth(CUR_MONTH):CUR_MONTH, left-1) : null);
  const next = out>0 ? (paidThisMonth ? nextMonth(CUR_MONTH) : CUR_MONTH) : null;
  return { paid, paidL, out, n, left, end, next, pays, paidThisMonth, status: out===0?'lunas':'berjalan' };
}
const debtTotal = upto => (S.debts||[]).reduce((s,d)=>s+debtInfo(d,upto).out,0);

/* ---------- kekayaan ---------- */
function wealthAt(upto){
  const w = walletTotal(upto), p = portfolio(upto).value, r = recvTotal(upto), l = debtTotal(upto);
  return { wallets:w, invest:p, recv:r, liab:l, total:w+p+r-l };
}
function wealthSeries(){ // rekonstruksi dari ledger lengkap: akhir tiap bulan sejak saldo awal
  const pts = [{ label:'Saldo awal', short:fDate(dAdd(LEDGER_START,-1)).replace(/ \d{4}$/,''), date:dAdd(LEDGER_START,-1), ...wealthAt(dAdd(LEDGER_START,-1)) }];
  ledgerMonths().forEach(m=>{ const end = m===CUR_MONTH ? TODAY : monthEnd(m); pts.push({ label: m===CUR_MONTH?'Hari ini':'Akhir '+fMon(m), short: m===CUR_MONTH?'Kini':fMon(m), date:end, ...wealthAt(end) }); });
  return pts;
}
setToday();
