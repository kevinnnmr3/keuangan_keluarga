/* =========================================================
   VIEWS — setiap halaman = fungsi yang mengembalikan HTML.
   ========================================================= */
const IP = {
  home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/>',
  grid:'<rect x="3" y="3" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18"/><path d="M10.6 5.1A10.4 10.4 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  mic:'<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/>',
  back:'<path d="M15 18l-6-6 6-6"/>', fwd:'<path d="M9 18l6-6-6-6"/>', down:'<path d="M6 9l6 6 6-6"/>', up:'<path d="M18 15l-6-6-6 6"/>',
  swap:'<path d="M7 4 3 8l4 4"/><path d="M3 8h14"/><path d="M17 20l4-4-4-4"/><path d="M21 16H7"/>',
  more:'<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>', x:'<path d="M18 6 6 18M6 6l12 12"/>', check:'<path d="M20 6 9 17l-5-5"/>',
  edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>', trash:'<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',
  trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>', target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  coins:'<circle cx="9" cy="9" r="6"/><path d="M18.1 10.4A6 6 0 1 1 10.4 18.1"/><path d="M7 7h2v4"/>',
  pie:'<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>', gauge:'<path d="M12 14l4-4"/><path d="M3.3 19a10 10 0 1 1 17.4 0"/>',
  send:'<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>', inbox:'<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1Z"/>',
  sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  arrin:'<path d="M17 7 7 17"/><path d="M17 17H7V7"/>', arrout:'<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  repeat:'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  archive:'<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  refresh:'<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8"/><path d="M21 3v5h-5"/>', play:'<path d="M7 4v16l13-8z"/>', pause:'<path d="M7 4h4v16H7zM14 4h4v16h-4z"/>',
  spark:'<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>', users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', alert:'<path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/>',
};
const I = (n,c='') => `<svg class="i ${c}" viewBox="0 0 24 24" aria-hidden="true">${IP[n]||''}</svg>`;
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const av = (o,c='sm') => `<span class="avatar ${c} av-c${MEMBERS[o]?.color??0}">${esc(MEMBERS[o]?.name?.[0]||'?')}</span>`;
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const hashStr = s => { let h=0; for(const c of String(s)) h=(h*31+c.charCodeAt(0))|0; return Math.abs(h); };
function invMonths(){ const ms=ledgerMonths(); return [prevMonth(ms[0]), ...ms].slice(-12); }
const memberOpts = (sel, withBoth) => (withBoth?[['both','Bersama']]:[]).concat(Object.values(MEMBERS).map(m=>[m.id,m.name])).map(o=>`<option value="${o[0]}" ${sel===o[0]?'selected':''}>${esc(o[1])}</option>`).join('');
const wDot = w => `<span class="wdot w-${W(w).brand}"></span>`;
const tile = (c,cls='') => `<span class="tile ${cls}" style="background:${c.tint||'var(--chip)'}">${c.icon}</span>`;
function txTile(t,cls=''){
  if(t.type==='expense'||t.type==='income') return tile(cat(t.cat,t.type),cls);
  const m = { transfer:'🔁', inv_buy:INV(t.inv)?.icon||'📈', inv_sell:INV(t.inv)?.icon||'📈', recv_out:'🤝', recv_pay:'🤝' };
  return `<span class="tile ${cls}">${m[t.type]||'•'}</span>`;
}
function amtChip(t){
  const cls = t.type==='income'||t.type==='inv_sell'||t.type==='recv_pay' ? 'in' : t.type==='transfer' ? 'tr' : 'out';
  const sign = cls==='in'?'+':cls==='out'?'−':'⇄';
  return `<span class="amt ${cls}"><span class="s">${sign}</span><span class="m">${rp(t.amount).replace('Rp ','Rp ')}</span></span>`;
}
function txSub(t){
  const parts=[];
  if(t.type==='transfer') parts.push(esc(W(t.wallet).short)+' → '+esc(W(t.to).short));
  else parts.push(esc(W(t.wallet).short));
  if(t.type==='expense'||t.type==='income') parts.push(esc(cat(t.cat,t.type).label));
  else parts.push(TYPE_LABEL[t.type]);
  return parts.join(' · ');
}
function txRow(t){
  return `<button class="row" data-act="tx" data-id="${t.id}">${txTile(t)}<div class="mid"><div class="t1">${esc(t.note||cat(t.cat,t.type).label)}</div><div class="t2">${av(t.owner)}<span>${txSub(t)}</span>${t.source==='telegram'?'<span class="tag tg">VN</span>':''}${t.fundedFrom?'<span class="tag warn">dari aset</span>':''}</div></div>${amtChip(t)}</button>`;
}
function dayGroups(list){
  const by={}; list.forEach(t=>{ (by[t.date]=by[t.date]||[]).push(t); });
  return Object.keys(by).sort().reverse().map(d=>{
    const items=by[d]; const net=items.reduce((s,t)=> s + (t.type==='expense'?-t.amount: t.type==='income'?t.amount:0),0);
    const closed = UI.collapsed[d];
    return `<div class="grp"><button class="dayh ${closed?'closed':''}" data-act="collapse" data-d="${d}">${I('up','xs')}<span>${fDay(d)}</span><span class="tot ${net<0?'':'pos'}">${net? M(net,{sign:true}) : '<span class="mut">—</span>'}</span></button>${items.slice().reverse().map(t=>closed?txRow(t).replace('<button class="row"','<button hidden class="row"'):txRow(t)).join('')}</div>`;
  }).join('');
}
const deltaTag = (cur, prev, goodUp=false) => {
  if(!prev && !cur) return '<span class="delta flat">—</span>';
  if(!prev) return `<span class="delta ${goodUp?'gup':'up'}">baru</span>`;
  const p=(cur-prev)/prev*100; if(Math.abs(p)<1) return '<span class="delta flat">±0%</span>';
  const up=p>0; const cls = goodUp ? (up?'gup':'gdn') : (up?'up':'dn');
  return `<span class="delta ${cls}">${up?'▲':'▼'} ${idn(Math.abs(p),Math.abs(p)<10?1:0)}%</span>`;
};
const trayH = (t, right='', sub='') => `<div class="tray-h"><div class="t">${t}${sub?`<small>${sub}</small>`:''}</div>${right}</div>`;

/* ================= BERANDA ================= */
function vHome(){
  const now = wealthAt(null), series = wealthSeries(), prev = series[series.length-2];
  const chg = now.total - prev.total, chgP = pct(chg,prev.total);
  const f = flows(CUR_MONTH), fPrevSame = flows(prevMonth(CUR_MONTH), TODAY_DAY);
  const bud = budgetFor(CUR_MONTH), port = portfolio(null);
  const remain = bud.total - f.expense, usedP = pct(f.expense,bud.total);
  const tot = now.wallets+now.invest+now.recv;
  const seg = [[now.wallets,'var(--s1)','Kas & bank'],[now.invest,'var(--s4)','Investasi'],[now.recv,'var(--s3)','Piutang']];
  const pend = S.pending.length;
  const onboard = !S.wallets.length ? `<section class="tray">${trayH('Mulai di sini','',`Tiga langkah supaya angka di aplikasi ini sesuai kenyataan`)}<div class="card list">
      <button class="row" data-act="walletForm"><span class="tile">💳</span><div class="mid"><div class="t1">1. Tambah dompet & saldo awal</div><div class="t2">Rekening, e-wallet, tunai — isi saldo per tanggal mulai</div></div>${I('fwd','sm')}</button>
      <button class="row" data-act="go" data-v="budget"><span class="tile">🎯</span><div class="mid"><div class="t1">2. Cek budget bulanan</div><div class="t2">Sudah terisi contoh, sesuaikan dengan kebutuhan</div></div>${I('fwd','sm')}</button>
      <button class="row" data-act="go" data-v="settings"><span class="tile">👥</span><div class="mid"><div class="t1">3. Undang pasangan</div><div class="t2">Tambahkan emailnya di Pengaturan, lalu ia daftar sendiri</div></div>${I('fwd','sm')}</button>
    </div></section>` : '';
  return `${onboard}
  <div class="cols"><div class="col">
    <section class="hero">
      <div class="lbl">Kekayaan bersih keluarga <span class="hpill" style="padding:2px 8px;font-size:11px">per ${fDate(TODAY)}</span></div>
      <div class="big">${M(now.total)}</div>
      <div class="chg"><span class="hpill ${chg>=0?'up':'dn'}">${chg>=0?'▲':'▼'} ${MC(chg,{sign:true})} (${pctS(chgP)})</span><span>vs ${prev.label.toLowerCase()}</span></div>
      <div class="comp">${seg.map(s=>`<span style="flex:${Math.max(s[0],0)};background:${s[1]}"></span>`).join('')}</div>
      <div class="comp-l">${seg.map(s=>`<div><i class="sw" style="background:${s[1]}"></i><span>${s[2]}<b>${MC(s[0])}</b></span></div>`).join('')}<div><i class="sw" style="background:var(--on-hero3)"></i><span>Liabilitas<b>${MC(now.liab)}</b></span></div></div>
    </section>
    ${pend?`<button class="vnb" data-act="go" data-v="inbox"><span class="ic">${I('mic','sm')}</span><div><b>${pend} catatan suara menunggu review</b><span>Dari Telegram — cek dulu, baru tercatat</span></div>${I('fwd','sm')}</button>`:''}
    <div class="shortcuts mobile-only">
      ${[['invest','trend','Investasi'],['budget','gauge','Budget'],['recv','coins','Piutang'],['goals','target','Tujuan'],['inbox','mic','Suara']].map(s=>`<button class="sc" data-act="go" data-v="${s[0]}"><span class="ic">${I(s[1],'sm')}</span>${s[2]}${s[0]==='inbox'&&pend?`<span class="dot-badge">${pend}</span>`:''}</button>`).join('')}
    </div>
    <div class="stats">
      <button class="stat" data-act="go" data-v="income"><span class="k"><span class="k-ico" style="background:var(--pos-s);color:var(--pos)">${I('arrin','xs')}</span>Pemasukan ${MON[TODAY_DAY?Number(CUR_MONTH.slice(5))-1:0]}</span><span class="v">${MC(f.income)}</span><span class="d">${deltaTag(f.income,fPrevSame.income,true)} <span class="mut">vs 1–${TODAY_DAY} ${fMon(prevMonth(CUR_MONTH))}</span></span></button>
      <button class="stat" data-act="go" data-v="expense"><span class="k"><span class="k-ico" style="background:var(--neg-s);color:var(--neg)">${I('arrout','xs')}</span>Pengeluaran</span><span class="v">${MC(f.expense)}</span><span class="d">${deltaTag(f.expense,fPrevSame.expense)} <span class="mut">vs 1–${TODAY_DAY} ${fMon(prevMonth(CUR_MONTH))}</span></span></button>
      <button class="stat" data-act="go" data-v="budget"><span class="k"><span class="k-ico" style="background:var(--chip)">${I('gauge','xs')}</span>Sisa budget</span>${bud.any?`<span class="v ${remain<0?'neg':''}">${MC(remain)}</span><span class="d mut">terpakai ${idn(usedP)}% · hari ${TODAY_DAY}/${daysIn(CUR_MONTH)}</span>`:`<span class="v mut" style="font-size:16px">Belum diatur</span><span class="d mut">opsional · ketuk untuk atur</span>`}</button>
      <button class="stat" data-act="go" data-v="invest"><span class="k"><span class="k-ico" style="background:var(--chip)">${I('trend','xs')}</span>P/L investasi</span><span class="v ${port.unreal>=0?'pos':'neg'}">${MC(port.unreal,{sign:true})}</span><span class="d mut">${pctS(port.unrealPct)} belum terealisasi</span></button>
    </div>
    ${trayCashflow()}
    ${trayCategories()}
  </div><div class="col">
    ${trayInsights()}
    ${trayWealth(series)}
    ${trayFunding()}
    <section class="tray">${trayH('Transaksi terbaru',`<button class="ibtn" data-act="go" data-v="history" aria-label="Lihat semua">${I('fwd','sm')}</button>`)}<div class="card list">${S.txns.slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:(a.created<b.created?1:-1)).slice(0,6).map(txRow).join('')||'<div class="empty">Belum ada transaksi. Tekan + untuk mencatat.</div>'}</div></section>
  </div></div>`;
}

function trayCashflow(){
  const all = ledgerMonths(); const n = UI.flowRange; const ms = all.slice(-n);
  const data = ms.map(m=>flows(m));
  CHARTS.cash = {
    draw: el => drawGroupedBars(el,{ labels: ms.map(m=>fMon(m)+(isPartial(m)?'*':'')), series:[{name:'Pemasukan',color:'var(--s1)',values:data.map(d=>d.income)},{name:'Pengeluaran',color:'var(--s2)',values:data.map(d=>d.expense)}], height:210 }),
    tip: i => `<div class="th">${monthLabel(ms[i])}</div>${tipRow('var(--s1)','Pemasukan',rp(data[i].income))}${tipRow('var(--s2)','Pengeluaran',rp(data[i].expense))}${tipRow('','Arus kas bersih',rp(data[i].net,{sign:true}))}`
  };
  const rows = ms.map((m,i)=>{ const d=data[i], p=i?data[i-1]:(all.indexOf(m)>0?flows(all[all.indexOf(m)-1]):null);
    const dn = p ? d.net-p.net : null;
    return `<tr><td>${monthLabel(m)}</td><td class="m">${rpc(d.income)}</td><td class="m">${rpc(d.expense)}</td><td class="m ${d.net>=0?'pos':'neg'}">${rpc(d.net,{sign:true})}</td><td class="m wide-only">${dn===null?'—':`<span class="${dn>=0?'pos':'neg'}">${rpc(dn,{sign:true})}</span>${p.net?` <span class="mut">(${pctS(dn/Math.abs(p.net)*100,0)})</span>`:''}`}</td></tr>`; }).reverse().join('');
  return `<section class="tray">${trayH('Arus kas',`<div class="seg">${[3,6,12].map(k=>`<button class="${UI.flowRange===k?'on':''}" data-act="flowRange" data-k="${k}">${k} bln</button>`).join('')}</div>`)}
    <div class="card pad" style="display:flex;flex-direction:column;gap:12px">
      <div class="legend"><span><i class="sw" style="background:var(--s1)"></i>Pemasukan</span><span><i class="sw" style="background:var(--s2)"></i>Pengeluaran</span></div>
      <div class="chart" data-chart="cash"></div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Bulan</th><th>Masuk</th><th>Keluar</th><th>Bersih</th><th class="wide-only">Δ bersih</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="note">* ${fMon(CUR_MONTH)} masih berjalan (1–${TODAY_DAY}), jadi belum setara dengan bulan penuh.${n>all.length?` Data tersedia sejak ${fMonth(all[0])} — ${n} bulan belum lengkap.`:''} Transfer, beli/jual investasi, dan piutang tidak dihitung.</p>
    </div></section>`;
}

function catCompare(m){
  const same = UI.catMode==='same';
  const cur = flows(m, isPartial(m)?TODAY_DAY:null), pm = prevMonth(m);
  const prev = flows(pm, same && isPartial(m) ? TODAY_DAY : null);
  const bud = budgetFor(m);
  const gs = groupCats('expense', true);
  const rows = gs.map(g=>({ c:g, cur:cur.byGroup[g.id]||0, prev:prev.byGroup[g.id]||0, budget:groupBudget(g,bud),
      subs: kidsOf(g.id,'expense',true).map(k=>({ c:k, cur:cur.byCat[k.id]||0, budget:bud.cats[k.id]||0 })).filter(x=>x.cur||x.budget).sort((a,b)=>b.cur-a.cur) }))
    .filter(r=>r.cur||r.prev||r.budget).sort((a,b)=>b.cur-a.cur);
  return { cur, prev, bud, pm, same, rows };
}
function trayCategories(){
  const m=CUR_MONTH, x=catCompare(m);
  const label = x.same ? `${fMon(m)} 1–${TODAY_DAY} vs ${fMon(x.pm)} 1–${TODAY_DAY} (periode setara)` : `${fMon(m)} 1–${TODAY_DAY} (berjalan) vs ${fMon(x.pm)} penuh — periode tidak setara`;
  return `<section class="tray">${trayH('Pengeluaran per kategori',`<div class="seg"><button class="${x.same?'on':''}" data-act="catMode" data-k="same">Setara</button><button class="${!x.same?'on':''}" data-act="catMode" data-k="full">Bln penuh</button></div>`,label)}
  <div class="card list">${x.rows.map(r=>{ const rem=r.budget-r.cur; const diff=r.cur-r.prev;
    const subs = r.subs.filter(x=>x.cur).slice(0,3).map(x=>esc(x.c.label)+' '+rpc(x.cur)).join(' · ');
    return `<button class="crow" data-act="drill" data-c="${r.c.id}">${tile(r.c,'sm')}<div style="min-width:0"><div class="t1"><span>${esc(r.c.label)}</span></div><div class="t2 ell">${r.budget?`Budget ${rpc(r.budget)} · ${rem>=0?'sisa '+rpc(rem):`<b class="neg">lewat ${rpc(-rem)}</b>`}`:'Tanpa budget'} · lalu <span class="m">${rpc(r.prev)}</span>${diff?` (<span class="m">${rpc(diff,{sign:true})}</span>)`:''}</div>${subs?`<div class="t2 ell">${subs}</div>`:''}</div><div class="r"><b class="m">${rpc(r.cur)}</b>${deltaTag(r.cur,r.prev)}</div></button>`; }).join('')||'<div class="empty">Belum ada pengeluaran bulan ini.</div>'}</div></section>`;
}

function insights(){
  const m=CUR_MONTH, x=catCompare(m); const out=[]; const dim=daysIn(m);
  const top = x.rows.filter(r=>r.cur>0).slice(0,3);
  if(top.length) out.push({e:'🏆', t:`Terbesar bulan ini: <b>${top.map(r=>esc(r.c.label)).join(', ')}</b>`, s:`Ketiganya ${idn(top.reduce((s,r)=>s+r.cur,0)/x.cur.expense*100)}% dari total pengeluaran ${rpc(x.cur.expense)}.`});
  const ch = x.rows.filter(r=>r.prev>0 && r.cur>0).map(r=>({...r, d:r.cur-r.prev, p:(r.cur-r.prev)/r.prev*100}));
  const inc = ch.slice().sort((a,b)=>b.d-a.d)[0], dec = ch.slice().sort((a,b)=>a.d-b.d)[0];
  if(inc && inc.d>0) out.push({e:'📈', t:`<b>${esc(inc.c.label)}</b> naik ${idn(inc.p)}% (${rpc(inc.d,{sign:true})})`, s:`Dibanding ${fMon(x.pm)} 1–${TODAY_DAY}. Kenaikan rupiah terbesar bulan ini.`});
  if(dec && dec.d<0) out.push({e:'📉', t:`<b>${esc(dec.c.label)}</b> turun ${idn(Math.abs(dec.p))}% (${rpc(dec.d)})`, s:`Penurunan rupiah terbesar — pertahankan.`});
  const over = x.rows.filter(r=>r.budget && r.cur>r.budget).sort((a,b)=>(b.cur-b.budget)-(a.cur-a.budget));
  if(over.length) out.splice(1,0,{e:'🚨', t:`<b>${over.length} kategori</b> sudah lewat budget`, s: over.map(r=>`${esc(r.c.label)} +${rpc(r.cur-r.budget)}`).join(' · ')+` — masih ${dim-TODAY_DAY} hari lagi.`, warn:true});
  const pace = x.rows.filter(r=>r.budget && r.cur<=r.budget && r.cur/TODAY_DAY*dim > r.budget*1.05 && !['g_tinggal','g_cicilan','g_nafkah'].includes(r.c.code));
  pace.slice(0,1).forEach(r=>{ const proj=r.cur/TODAY_DAY*dim; out.push({e:'⏱️', t:`<b>${esc(r.c.label)}</b> diproyeksikan lewat ${rpc(proj-r.budget)}`, s:`Laju ${rpc(r.cur/TODAY_DAY)}/hari. Hemat ${rpc((proj-r.budget)/(dim-TODAY_DAY))}/hari sisa bulan ini supaya pas budget.`}); });
  const save = x.rows.filter(r=>r.prev>0).map(r=>({...r, gap:r.cur - Math.min(r.prev,r.budget||r.prev)})).filter(r=>r.gap>100000).sort((a,b)=>b.gap-a.gap)[0];
  if(save) out.push({e:'💡', t:`Potensi hemat: <b>${esc(save.c.label)}</b> sekitar ${rpc(save.gap)}`, s:`Kalau kembali ke level ${fMon(x.pm)} atau budget, mana yang lebih rendah.`});
  return out;
}
function trayInsights(){
  const list=insights();
  return `<section class="tray">${trayH('Insight budget',`<span class="tag brand">${I('spark','xs')} rule-based</span>`)}<div class="card">${list.map(i=>`<div class="ins"><span class="e" style="${i.warn?'background:var(--neg-s)':''}">${i.e}</span><div><p>${i.t}</p><small>${i.s}</small></div></div>`).join('')||'<div class="empty">Belum ada insight.</div>'}</div></section>`;
}

function trayWealth(series){
  const vals=series.map(p=>p.total), last=series[series.length-1], prev=series[series.length-2], first=series[0];
  CHARTS.wealth={ draw: el=>drawLine(el,{values:vals,labels:series.map(p=>p.short),color:'var(--ink)',height:190}),
    tip: i=>{ const p=series[i]; return `<div class="th">${p.label} · ${fDate(p.date)}</div>${tipRow('var(--s1)','Kas & bank',rpc(p.wallets))}${tipRow('var(--s4)','Investasi',rpc(p.invest))}${tipRow('var(--s3)','Piutang',rpc(p.recv))}${tipRow('','Total',rp(p.total))}`; } };
  const cell=(k,v,d)=>`<div><div class="k">${k}</div><div class="v">${v}</div>${d?`<div style="font-size:12.5px;margin-top:2px">${d}</div>`:''}</div>`;
  return `<section class="tray">${trayH('Tren kekayaan','',`Direkonstruksi dari saldo awal + seluruh transaksi`)}<div class="card">
    <div class="pad" style="padding-bottom:6px"><div class="chart" data-chart="wealth"></div></div>
    <div class="sgrid">
      ${cell('Akhir bulan lalu',MC(prev.total),`<span class="${last.total-prev.total>=0?'pos':'neg'}">${rpc(last.total-prev.total,{sign:true})} (${pctS(pct(last.total-prev.total,prev.total))})</span>`)}
      ${cell('Sejak saldo awal ('+first.short+')',MC(first.total),`<span class="${last.total-first.total>=0?'pos':'neg'}">${rpc(last.total-first.total,{sign:true})} (${pctS(pct(last.total-first.total,first.total))})</span>`)}
      ${cell('Tahun lalu ('+fMon(CUR_MONTH.replace(/^\d{4}/,y=>y-1))+' '+(Number(CUR_MONTH.slice(0,4))-1)+')','<span class="mut" style="font-size:14px">Belum tersedia</span>','<span class="mut">Pencatatan baru mulai '+fDate(LEDGER_START)+' — tidak kami karang.</span>')}
      ${cell('Liabilitas','<span class="m">Rp 0</span>','<span class="mut">Belum ada yang dicatat</span>')}
    </div>
    <p class="note" style="padding:0 18px 16px">Nilai investasi historis memakai harga yang kamu catat per bulan. Kenaikan nilai pasar dipisahkan dari arus kas.</p>
  </div></section>`;
}

function trayFunding(){
  const f=flows(CUR_MONTH); const ent=Object.entries(f.byWallet).sort((a,b)=>b[1]-a[1]);
  const top=ent.slice(0,4), other=ent.slice(4).reduce((s,e)=>s+e[1],0); const cols=['var(--s1)','var(--s2)','var(--s3)','var(--s4)','var(--s5)'];
  const items=top.map((e,i)=>({label:W(e[0]).short,v:e[1],c:cols[i]})); if(other) items.push({label:'Lainnya',v:other,c:cols[4]});
  const funded = S.txns.filter(t=>t.type==='expense'&&t.fundedFrom);
  const groups={}; funded.forEach(t=>{ (groups[t.fundedFrom]=groups[t.fundedFrom]||[]).push(t); });
  const ex = Object.entries(groups).map(([sid,list])=>{ const s=S.txns.find(t=>t.id===sid); const used=list.reduce((a,t)=>a+t.amount,0); return s?`<div class="callout warn" style="flex-direction:column;gap:4px"><b style="color:var(--ink)">${fMon(monthOf(s.date))}: ${esc(s.note)} → ${rpc(s.amount)} masuk ${esc(W(s.wallet).short)}</b><span>Dipakai untuk ${list.map(t=>esc(t.note)+' ('+rpc(t.amount)+')').join(' dan ')}. Hanya <b>${rpc(used)}</b> yang dihitung pengeluaran; penjualan asetnya tidak, dan sisa ${rpc(s.amount-used)} tetap jadi kas.</span></div>`:''; }).join('');
  return `<section class="tray">${trayH('Sumber dana pengeluaran','',`${fMonth(CUR_MONTH)} · per dompet pembayar`)}<div class="card pad" style="display:flex;flex-direction:column;gap:14px">
    <div class="comp" style="margin:0;height:12px">${items.map(it=>`<span style="flex:${it.v};background:${it.c}"></span>`).join('')}</div>
    <div class="alloc">${items.map(it=>`<div><i class="sw" style="background:${it.c}"></i><span>${esc(it.label)}</span><b class="m">${rpc(it.v)}</b><span class="mut" style="flex:none;width:42px;text-align:right">${idn(it.v/f.expense*100)}%</span></div>`).join('')}</div>
    <div class="flbl">Pengeluaran yang didanai dari penjualan aset</div>
    ${f.fromAsset?'':`<p class="note">Bulan ini: <b>Rp 0</b>. Riwayat:</p>`}${ex||'<p class="note">Belum ada.</p>'}
  </div></section>`;
}

/* ================= RIWAYAT / PEMASUKAN / PENGELUARAN ================= */
function filterTx(F){
  const months = ledgerMonths();
  let from=null, to=null;
  if(F.period==='month'){ from=CUR_MONTH+'-01'; to=TODAY; }
  else if(F.period==='last'){ const pm=prevMonth(CUR_MONTH); from=pm+'-01'; to=monthEnd(pm); }
  else if(F.period==='3m'){ from=months[Math.max(0,months.length-3)]+'-01'; to=TODAY; }
  else if(F.period==='custom'){ from=F.from||null; to=F.to||null; }
  const q=(F.q||'').toLowerCase();
  return S.txns.filter(t=>{
    if(from && t.date<from) return false; if(to && t.date>to) return false;
    if(F.type==='expense' && t.type!=='expense') return false;
    if(F.type==='income' && t.type!=='income') return false;
    if(F.type==='transfer' && t.type!=='transfer') return false;
    if(F.type==='asset' && !['inv_buy','inv_sell','recv_out','recv_pay'].includes(t.type)) return false;
    if(F.cat!=='all'){ if(F.cat.startsWith('g:')){ const g=groupOf(t.cat); if(!g || g.id!==F.cat.slice(2)) return false; } else if(t.cat!==F.cat) return false; }
    if(F.wallet!=='all' && t.wallet!==F.wallet && t.to!==F.wallet) return false;
    if(F.owner!=='all' && t.owner!==F.owner) return false;
    if(q && !((t.note||'')+' '+(t.cat?catFull(t.cat,t.type):'')+' '+W(t.wallet).name).toLowerCase().includes(q)) return false;
    return true;
  });
}
function filterBar(F, fixedType){
  const sel=(k,opts)=>`<select class="chipsel ${F[k]!=='all'&&F[k]!=='month'?'on':''}" data-filter="${k}">${opts.map(o=>`<option value="${o[0]}" ${F[k]===o[0]?'selected':''}>${esc(o[1])}</option>`).join('')}</select>`;
  const kinds = fixedType==='income' ? ['income'] : fixedType==='expense' ? ['expense'] : ['expense','income'];
  const catSel = `<select class="chipsel ${F.cat!=='all'?'on':''}" data-filter="cat"><option value="all">${fixedType==='income'?'Semua sumber':'Semua kategori'}</option>${kinds.map(k=>groupCats(k,true).map(g=>{ const kids=kidsOf(g.id,k,true); return kids.length
      ? `<optgroup label="${esc(g.icon+' '+g.label)}"><option value="g:${g.id}" ${F.cat==='g:'+g.id?'selected':''}>Semua ${esc(g.label)}</option>${kids.map(c=>`<option value="${c.id}" ${F.cat===c.id?'selected':''}>${esc(c.label)}${c.archived?' (arsip)':''}</option>`).join('')}</optgroup>`
      : `<option value="${g.id}" ${F.cat===g.id?'selected':''}>${esc(g.icon+' '+g.label)}${g.archived?' (arsip)':''}</option>`; }).join('')).join('')}</select>`;
  return `<div class="chips">
    ${fixedType?'':sel('type',[['all','Semua jenis'],['expense','Pengeluaran'],['income','Pemasukan'],['transfer','Transfer'],['asset','Aset & piutang']])}
    ${sel('period',[['month','Bulan ini'],['last','Bulan lalu'],['3m','3 bulan'],['all','Semua'],['custom','Rentang…']])}
    ${catSel}
    ${sel('wallet',[['all','Semua dompet'],...S.wallets.map(w=>[w.id,w.short])])}
    ${sel('owner',[['all','Semua anggota'],...Object.values(MEMBERS).map(m=>[m.id,m.name])])}
  </div>${F.period==='custom'?`<div class="frow"><input class="inp" type="date" data-filter="from" value="${F.from||''}" min="${LEDGER_START}" max="${TODAY}"><input class="inp" type="date" data-filter="to" value="${F.to||''}" min="${LEDGER_START}" max="${TODAY}"></div>`:''}`;
}
function txBlock(F, fixedType){
  const list = filterTx(F);
  const tin = list.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0), tout = list.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const sorted = list.slice().sort((a,b)=>{ const k=UI.histSort.k, d=UI.histSort.dir; let va,vb;
    if(k==='amount'){va=a.amount;vb=b.amount;} else if(k==='note'){va=(a.note||'').toLowerCase();vb=(b.note||'').toLowerCase();} else if(k==='cat'){va=cat(a.cat,a.type).label;vb=cat(b.cat,b.type).label;} else if(k==='wallet'){va=W(a.wallet).short;vb=W(b.wallet).short;} else if(k==='owner'){va=a.owner;vb=b.owner;} else {va=a.date+(a.created||'');vb=b.date+(b.created||'');}
    return va<vb?-d:va>vb?d:0; });
  const th=(k,l,al)=>`<th class="sort ${UI.histSort.k===k?'on':''}" data-act="sort" data-k="${k}" ${al?`style="text-align:${al}"`:''}>${l} ${UI.histSort.k===k?(UI.histSort.dir>0?'↑':'↓'):''}</th>`;
  return `${filterBar(F,fixedType)}
  <div class="note" style="padding:0 6px">${list.length} transaksi${tout?` · keluar <b class="m">${rp(tout)}</b>`:''}${tin?` · masuk <b class="m">${rp(tin)}</b>`:''}</div>
  ${list.length?`<div class="card list mobile-only" style="overflow:hidden">${dayGroups(list)}</div>
  <div class="card desk-only tbl-wrap"><table class="tbl"><thead><tr>${th('date','Tanggal','left')}${th('note','Keterangan','left')}${th('cat','Kategori','left')}${th('wallet','Dompet','left')}${th('owner','Oleh','left')}${th('amount','Jumlah')}</tr></thead><tbody>
    ${sorted.slice(0,300).map(t=>`<tr class="click" data-act="tx" data-id="${t.id}"><td>${fDate(t.date)}</td><td style="text-align:left;max-width:280px;overflow:hidden;text-overflow:ellipsis">${esc(t.note)} ${t.source==='telegram'?'<span class="tag tg">VN</span>':''}${t.fundedFrom?' <span class="tag warn">dari aset</span>':''}</td><td style="text-align:left">${t.type==='expense'||t.type==='income'?cat(t.cat,t.type).icon+' '+esc(cat(t.cat,t.type).label):TYPE_LABEL[t.type]}</td><td style="text-align:left">${t.type==='transfer'?esc(W(t.wallet).short)+' → '+esc(W(t.to).short):esc(W(t.wallet).short)}</td><td style="text-align:left">${av(t.owner)} ${MEMBERS[t.owner].name}</td><td>${amtChip(t)}</td></tr>`).join('')}
  </tbody></table></div>`:'<div class="card empty">Tidak ada transaksi untuk filter ini.</div>'}`;
}
function vHistory(){
  const F=UI.hf;
  return `<div class="pillsearch">${I('search','sm')}<input class="inp" placeholder="Cari catatan, kategori, dompet…" data-filter="q" value="${esc(F.q)}"></div>${txBlock(F)}`;
}
function vFlow(kind){
  const isInc = kind==='income'; const F=UI.ff[kind];
  const ms = ledgerMonths().slice(-6); const vals = ms.map(m=>{ const f=flows(m); return isInc?f.income:f.expense; });
  const cur = flows(CUR_MONTH), same = flows(prevMonth(CUR_MONTH),TODAY_DAY), full = flows(prevMonth(CUR_MONTH));
  const v = isInc?cur.income:cur.expense, vs = isInc?same.income:same.expense, vf = isInc?full.income:full.expense;
  const d = v-vs, p = vs? d/vs*100 : 0;
  const good = isInc ? d>=0 : d<=0;
  CHARTS['flow-'+kind]={ draw: el=>drawGroupedBars(el,{labels:ms.map(m=>fMon(m)+(isPartial(m)?'*':'')),series:[{name:kind,color:isInc?'var(--s1)':'var(--s2)',values:vals}],height:190,refs: isInc?null:ms.map(m=>budgetFor(m).total)}),
    tip: i=>{ const prevV = i? vals[i-1] : null; return `<div class="th">${monthLabel(ms[i])}</div>${tipRow(isInc?'var(--s1)':'var(--s2)',isInc?'Pemasukan':'Pengeluaran',rp(vals[i]))}${!isInc?tipRow('','Budget',rp(budgetFor(ms[i]).total)):''}${prevV!==null?tipRow('','vs bulan sebelumnya',rpc(vals[i]-prevV,{sign:true})+(prevV?' ('+pctS((vals[i]-prevV)/prevV*100)+')':'')):''}`; } };
  const by = isInc?cur.byInc:cur.byGroup; const byPrev = isInc?same.byInc:same.byGroup;
  const ent = Object.entries(by).sort((a,b)=>b[1]-a[1]); const max = ent.length?ent[0][1]:1;
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH(isInc?'Pemasukan bulan ini':'Pengeluaran bulan ini','',`${fMonth(CUR_MONTH)} · 1–${TODAY_DAY} (berjalan)`)}<div class="card">
      <div class="wtotal">${M(v)}</div>
      <div class="sgrid" style="border-top:1px solid var(--line)">
        <div><div class="k">vs ${fMon(prevMonth(CUR_MONTH))} 1–${TODAY_DAY} (setara)</div><div class="v ${good?'pos':'neg'}">${rpc(d,{sign:true})} <span style="font-size:13px">(${pctS(p)})</span></div></div>
        <div><div class="k">${fMon(prevMonth(CUR_MONTH))} penuh</div><div class="v">${MC(vf)}</div></div>
      </div></div></section>
    <section class="tray">${trayH('6 bulan terakhir','',isInc?'Gaji, freelance, usaha, hasil investasi. Transfer & pencairan aset tidak dihitung.':'Garis hitam = budget bulanan. Beli investasi & transfer tidak dihitung.')}<div class="card pad"><div class="chart" data-chart="flow-${kind}"></div><p class="note" style="margin-top:8px">* ${fMon(CUR_MONTH)} masih berjalan.</p></div></section>
    <section class="tray">${trayH(isInc?'Per sumber':'Per kategori','',`${fMon(CUR_MONTH)} 1–${TODAY_DAY} vs periode setara bulan lalu`)}<div class="card list">${ent.map(([id,val])=>{ const c=cat(id,isInc?'income':'expense'); return `<button class="crow" data-act="${isInc?'flowcat':'drill'}" data-c="${id}" data-kind="${kind}">${tile(c,'sm')}<div style="min-width:0"><div class="t1"><span>${esc(c.label)}</span></div><div class="bar thin" style="margin-top:7px"><i style="width:${val/max*100}%;background:${isInc?'var(--s1)':'var(--s2)'}"></i></div></div><div class="r"><b class="m">${rpc(val)}</b>${deltaTag(val,byPrev[id]||0,isInc)}</div></button>`; }).join('')||'<div class="empty">Belum ada.</div>'}</div></section>
  </div><div class="col">
    <section class="tray">${trayH('Daftar transaksi',`<button class="ibtn" data-act="add" data-type="${kind}" aria-label="Tambah">${I('plus','sm')}</button>`)}<div style="display:flex;flex-direction:column;gap:10px;padding:0 4px 4px">${txBlock(F,kind)}</div></section>
  </div></div>`;
}

/* ================= DOMPET ================= */
function wCard(w,b,stack){
  const light = ['bri','jago'].includes(w.brand);
  const owners = w.owner==='both'?Object.keys(MEMBERS):[w.owner];
  const wm = w.brand==='bca' && /xpresi/i.test(w.name) ? `<small>Tahapan</small>Xpresi BCA` : w.brand==='cash' ? '💵 Tunai' : esc(w.short);
  return `<button class="wcard w-${w.brand} ${light?'light':''}" data-act="wallet" data-id="${w.id}"><span class="wm">${wm}</span><span class="bal m">${rp(b)}</span><span class="meta">${esc(w.name)} · ${({bank:'Rekening bank',ewallet:'E-wallet',cash:'Tunai',custom:'Lainnya'})[w.type]||w.type}</span><span class="own">${owners.map(o=>av(o)).join('')}</span></button>`;
}
function vWallets(){
  const b=balances(null); const act=S.wallets.filter(w=>!w.archived), arch=S.wallets.filter(w=>w.archived);
  const total=act.reduce((s,w)=>s+b[w.id],0);
  const f=flows(CUR_MONTH);
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Saldo dompet','',`${act.length} dompet aktif · per ${fDate(TODAY)}`)}<div class="card"><div class="wtotal">${M(total)}</div></div></section>
    <section class="tray">${trayH('Dompet',`<button class="ibtn" data-act="add" data-type="transfer" aria-label="Transfer">${I('swap','sm')}</button><button class="ibtn" data-act="walletForm" aria-label="Tambah dompet">${I('plus','sm')}</button>`)}
      <div class="wstack mobile-only">${act.map(w=>wCard(w,b[w.id],true)).join('')}</div>
      <div class="wgrid desk-only">${act.map(w=>wCard(w,b[w.id])).join('')}</div>
    </section>
  </div><div class="col">
    <section class="tray">${trayH('Ringkasan per dompet','',`${fMonth(CUR_MONTH)} · masuk/keluar termasuk transfer`)}<div class="card list">${act.map(w=>{ let i=0,o=0; S.txns.forEach(t=>{ if(monthOf(t.date)!==CUR_MONTH) return; effects(t).forEach(e=>{ if(e.w===w.id){ if(e.d>0)i+=e.d; else o-=e.d; } }); });
      return `<button class="row" data-act="wallet" data-id="${w.id}"><span class="tile sm w-${w.brand}" style="color:#fff;font-size:13px;font-weight:800">${esc(w.short.slice(0,3))}</span><div class="mid"><div class="t1">${esc(w.name)}</div><div class="t2"><span class="pos m">+${rpc(i)}</span> · <span class="neg m">−${rpc(o)}</span></div></div><b class="m num">${rp(b[w.id])}</b></button>`; }).join('')}</div></section>
    <div class="callout">${I('lock','sm')}<span>Saldo dihitung dari <b>saldo awal tiap dompet + semua transaksi</b>, bukan diketik manual. Transfer antar dompet tidak mengubah kekayaan.</span></div>
    ${arch.length?`<section class="tray">${trayH('Diarsipkan')}<div class="card list">${arch.map(w=>`<button class="row" data-act="wallet" data-id="${w.id}">${wDot(w.id)}<div class="mid"><div class="t1">${esc(w.name)}</div><div class="t2">Saldo ${rp(b[w.id])}</div></div>${I('fwd','sm')}</button>`).join('')}</div></section>`:''}
  </div></div>`;
}

/* ================= INVESTASI ================= */
function vInvest(){
  const p=portfolio(null); const ms=invMonths();
  const hist = ms.map(m=>portfolio(m===CUR_MONTH?null:monthEnd(m)));
  const ret = UI.invMode==='return';
  CHARTS.port={ draw: el=>drawLine(el,{values:hist.map(h=>ret?h.unreal:h.value),labels:ms.map(m=>m===CUR_MONTH?'Kini':fMon(m)),color: ret?(p.unreal>=0?'var(--pos)':'var(--neg)'):'var(--ink)',zero:ret,height:180}),
    tip: i=>`<div class="th">${ms[i]===CUR_MONTH?'Hari ini':'Akhir '+fMon(ms[i])}</div>${tipRow('','Nilai',rp(hist[i].value))}${tipRow('','Modal',rp(hist[i].cost))}${tipRow('','Unrealized',rp(hist[i].unreal,{sign:true}))}` };
  const types=Object.keys(INV_TYPES).filter(t=>p.byType[t]);
  CHARTS.alloc={ draw: el=>drawDonut(el,{values:types.map(t=>p.byType[t]),colors:types.map(t=>INV_TYPES[t].color),centerLabel:'Total',centerValue:rpc(p.value)}), tip:i=>`<div class="th">${INV_TYPES[types[i]].label}</div>${tipRow(INV_TYPES[types[i]].color,'Nilai',rp(p.byType[types[i]]))}${tipRow('','Porsi',idn(p.byType[types[i]]/p.value*100,1)+'%')}` };
  const list=S.investments.filter(i=>UI.invFilter==='all'||i.type===UI.invFilter);
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Portofolio',`<div class="seg"><button class="${!ret?'on':''}" data-act="invMode" data-k="value">Nilai</button><button class="${ret?'on':''}" data-act="invMode" data-k="return">Return</button></div>`)}<div class="card">
      <div class="ovw"><div class="v">${ret?`<span class="${p.unreal>=0?'pos':'neg'}">${M(p.unreal,{sign:true})}</span>`:M(p.value)}</div><div class="mut" style="font-size:13.5px;margin-top:2px">${ret?`${pctS(p.unrealPct)} dari modal ${rpc(p.cost)}`:`Modal ${rpc(p.cost)} · ${S.investments.length} aset`}</div>
      <div class="chart" data-chart="port" style="margin-top:12px"></div></div>
      <div class="sgrid">
        <div><div class="k">Total modal</div><div class="v m">${rp(p.cost)}</div></div>
        <div><div class="k">Nilai saat ini</div><div class="v m">${rp(p.value)}</div></div>
        <div><div class="k">Unrealized P/L</div><div class="v ${p.unreal>=0?'pos':'neg'}"><span class="m">${rp(p.unreal,{sign:true})}</span> <span style="font-size:13px">(${pctS(p.unrealPct)})</span></div></div>
        <div><div class="k">Realized P/L</div><div class="v ${p.realized>=0?'pos':'neg'}"><span class="m">${rp(p.realized,{sign:true})}</span></div></div>
      </div>
      <p class="note" style="padding:0 18px 16px">Harga pasar diisi manual lewat tombol ⟳ di tiap aset (belum otomatis). Struktur datanya sudah siap disambungkan ke penyedia data pasar.</p>
    </div></section>
    <section class="tray">${trayH('Alokasi aset')}<div class="card donut-wrap"><div class="chart" data-chart="alloc"></div><div class="alloc">${types.map(t=>`<div><i class="sw" style="background:${INV_TYPES[t].color}"></i><span>${INV_TYPES[t].label}</span><b class="m">${rpc(p.byType[t])}</b><span class="mut" style="flex:none;width:44px;text-align:right">${idn(p.byType[t]/p.value*100)}%</span></div>`).join('')}</div></div></section>
  </div><div class="col">
    <section class="tray">${trayH('Aset',`<button class="ibtn" data-act="invForm" aria-label="Tambah investasi">${I('plus','sm')}</button>`)}
      <div class="chips" style="padding:0 6px 10px">${[['all','Semua'],...Object.entries(INV_TYPES).map(([k,v])=>[k,v.label])].map(o=>`<button class="chip ${UI.invFilter===o[0]?'on':''}" data-act="invFilter" data-k="${o[0]}">${o[1]}</button>`).join('')}</div>
      <div class="card list">${list.map(i=>{ const h=holding(i); return `<button class="row" data-act="go" data-v="invDetail" data-p="${i.id}"><span class="tile">${i.icon}</span><div class="mid"><div class="t1">${esc(i.symbol||i.name)}</div><div class="t2">${i.type==='deposit'?esc(i.sub):`${idn(h.qty,h.qty%1?2:0)} ${esc(i.unit)} · @ ${rp(h.price)}`}</div></div><div style="text-align:right"><div class="m num" style="font-weight:700">${rpc(h.value)}</div><div class="delta ${h.unreal>0?'gup':h.unreal<0?'gdn':'flat'}">${i.type==='deposit'?'bunga → pemasukan':pctS(h.unrealPct)}</div></div></button>`; }).join('')||'<div class="empty">Belum ada aset di kategori ini.</div>'}</div>
    </section>
  </div></div>`;
}
function vInvDetail(id){
  const inv=INV(id); if(!inv) return '<div class="empty">Aset tidak ditemukan.</div>';
  const h=holding(inv); const ret=UI.invMode==='return'; const ms=invMonths();
  const hist=ms.map(m=>holding(inv, m===CUR_MONTH?null:monthEnd(m)));
  CHARTS.inv={ draw: el=>drawLine(el,{values:hist.map(x=>ret?x.unreal:x.value),labels:ms.map(m=>m===CUR_MONTH?'Kini':fMon(m)),color:ret?(h.unreal>=0?'var(--pos)':'var(--neg)'):(h.unreal>=0?'var(--pos)':'var(--neg)'),zero:ret,height:190}),
    tip: i=>`<div class="th">${ms[i]===CUR_MONTH?'Hari ini':'Akhir '+fMon(ms[i])}</div>${inv.type!=='deposit'?tipRow('','Harga',rp(hist[i].price)):''}${tipRow('','Nilai',rp(hist[i].value))}${tipRow('','P/L',rp(hist[i].unreal,{sign:true}))}` };
  const lots=inv.lots.slice().sort((a,b)=>a.date<b.date?1:-1);
  const isDep=inv.type==='deposit';
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Ringkasan',`<div class="seg"><button class="${!ret?'on':''}" data-act="invMode" data-k="value">Nilai</button><button class="${ret?'on':''}" data-act="invMode" data-k="return">Return</button></div>${isDep?'':`<button class="ibtn" data-act="priceForm" data-id="${id}" aria-label="Perbarui harga">${I('refresh','sm')}</button>`}`)}<div class="card">
      <div class="ovw"><div class="head"><span class="tile" style="width:60px;height:60px;border-radius:18px;font-size:28px">${inv.icon}</span><div style="min-width:0"><div class="v">${ret?`<span class="${h.unreal>=0?'pos':'neg'}">${M(h.unreal,{sign:true})}</span>`:M(h.value)}</div><div class="mut" style="font-size:14px">${INV_TYPES[inv.type].label} • ${inv.priceUpdated?'Harga per '+fDate(dISO(new Date(inv.priceUpdated))):'Harga = harga beli terakhir'}</div></div></div>
      <div class="chart" data-chart="inv" style="margin-top:14px"></div></div>
      <div class="sgrid">
        <div><div class="k">Profit/Loss</div><div class="v ${h.unreal>=0?'pos':'neg'}"><span class="m">${rp(h.unreal,{sign:true})}</span> (${pctS(h.unrealPct)})</div></div>
        <div><div class="k">${isDep?'Pokok':'Jumlah'}</div><div class="v">${isDep?M(h.cost):idn(h.qty, h.qty%1?4:0)+' '+esc(inv.unit)}</div></div>
        <div><div class="k">${isDep?'Keterangan':'Rata-rata beli'}</div><div class="v" style="${isDep?'font-size:14px':''}">${isDep?esc(inv.sub||'—'):M(h.avg)}</div></div>
        <div><div class="k">${isDep?'Bunga':'Harga pasar'}</div><div class="v" style="${isDep?'font-size:14px':''}">${isDep?'Catat sebagai pemasukan Hasil Investasi':M(h.price)}</div></div>
        ${h.realized?`<div><div class="k">Realized P/L</div><div class="v ${h.realized>=0?'pos':'neg'}"><span class="m">${rp(h.realized,{sign:true})}</span></div></div>`:''}
        ${h.fees?`<div><div class="k">Total biaya</div><div class="v m">${rp(h.fees)}</div></div>`:''}
      </div>
      <div class="btns" style="padding:0 14px 14px"><button class="btn" data-act="trade" data-id="${id}" data-side="buy">${I('plus','sm')} ${isDep?'Tambah':'Beli'}</button><button class="btn" data-act="trade" data-id="${id}" data-side="sell" ${h.qty<=0?'disabled':''}>${I('minus','sm')} ${isDep?'Cairkan':'Jual'}</button></div>
    </div></section>
  </div><div class="col">
    <section class="tray">${trayH('Aktivitas')}<div class="card list">${lots.map(l=>{ const lbl=l.side==='initial'?'Posisi awal':l.side==='buy'?'Beli':'Jual'; const tx=S.txns.find(t=>t.lot===l.id);
      return `<div class="row"><span class="tile sm" style="background:${l.side==='sell'?'var(--neg-s)':'var(--pos-s)'};color:${l.side==='sell'?'var(--neg)':'var(--pos)'}">${I(l.side==='sell'?'minus':'plus','sm')}</span><div class="mid"><div class="t1">${lbl}</div><div class="t2">${fDate(l.date)} · ${isDep?'':idn(l.qty,l.qty%1?4:0)+' '+esc(inv.unit)+' @ '+rp(l.price)}${tx?' · '+esc(W(tx.wallet).short):l.side==='initial'?' · sudah dimiliki':''}</div></div><span class="amt ${l.side==='sell'?'in':'out'}"><span class="s">${l.side==='sell'?'+':'−'}</span><span class="m">${rp(l.qty*l.price+(l.side==='sell'?-l.fee:l.fee))}</span></span></div>`; }).join('')}</div></section>
    <div class="callout">${I('lock','sm')}<span>Beli investasi = kas pindah ke aset, <b>bukan pengeluaran</b>. Jual = aset pindah ke kas; selisih dengan modal dicatat sebagai realized P/L, <b>bukan pemasukan</b>.</span></div>
  </div></div>`;
}

/* ================= PIUTANG ================= */
const recvTag = i => i.status==='lunas'?'<span class="tag ok">Lunas</span>': i.overdue?'<span class="tag bad">Terlambat</span>': i.status==='sebagian'?'<span class="tag warn">Sebagian</span>':'<span class="tag">Belum dibayar</span>';
function vRecv(){
  const infos=S.receivables.map(r=>({r,i:recvInfo(r)}));
  const out=infos.reduce((s,x)=>s+x.i.out,0), over=infos.filter(x=>x.i.overdue);
  const order={belum:1,sebagian:0,lunas:2};
  infos.sort((a,b)=> (b.i.overdue-a.i.overdue) || (order[a.i.status]-order[b.i.status]) || (a.r.due<b.r.due?-1:1));
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Total piutang berjalan')}<div class="card"><div class="wtotal">${M(out)}</div>
      <div class="sgrid"><div><div class="k">Aktif</div><div class="v">${infos.filter(x=>x.i.out>0).length} orang</div></div><div><div class="k">Terlambat</div><div class="v ${over.length?'neg':''}">${over.length?MC(over.reduce((s,x)=>s+x.i.out,0)):'—'}</div></div></div></div></section>
    <div class="callout">${I('lock','sm')}<span>Meminjamkan uang = kas berubah jadi piutang (aset), <b>bukan pengeluaran</b>. Pembayaran kembali = piutang berubah jadi kas, <b>bukan pemasukan</b>.</span></div>
  </div><div class="col">
    <section class="tray">${trayH('Daftar piutang',`<button class="ibtn" data-act="recvForm" aria-label="Tambah piutang">${I('plus','sm')}</button>`)}<div class="card list">${infos.map(({r,i})=>{ const late = i.overdue ? Math.round((dParse(TODAY)-dParse(r.due))/864e5) : 0;
      return `<button class="row" data-act="recv" data-id="${r.id}" style="align-items:flex-start"><span class="tile">🤝</span><div class="mid"><div class="t1" style="display:flex;gap:8px;align-items:center"><span style="overflow:hidden;text-overflow:ellipsis">${esc(r.person)}</span>${recvTag(i)}</div><div class="t2">${esc(r.note)}</div><div class="bar thin" style="margin-top:8px"><i class="${i.status==='lunas'?'ok':''}" style="width:${i.paid/r.amount*100}%"></i></div><div class="t2" style="margin-top:4px;display:block">Dibayar <span class="m">${rpc(i.paid)}</span> / <span class="m">${rpc(r.amount)}</span> · tempo ${fDate(r.due).replace(' 2026','')}${late?` <b class="neg">+${late} hari</b>`:''}</div></div><b class="m num" style="padding-top:2px">${rpc(i.out)}</b></button>`; }).join('')}</div></section>
  </div></div>`;
}

/* ================= BUDGET ================= */
function vBudget(){
  const m=UI.budgetMonth, bud=budgetFor(m), part=isPartial(m);
  const f=flows(m); const spent=f.expense, remain=bud.total-spent, used=pct(spent,bud.total);
  const ideal = part ? TODAY_DAY/daysIn(m)*100 : 100;
  const ms=ledgerMonths(); const i0=ms.indexOf(m);
  const groups=groupCats('expense',true).map(g=>{ const kids=kidsOf(g.id,'expense',true);
      const subs=(kids.length?kids:[g]).map(c=>({c,b:bud.cats[c.id]||0,s:f.byCat[c.id]||0})).filter(x=>x.b||x.s||!x.c.archived);
      return { g, kids:kids.length, b:groupBudget(g,bud), s:f.byGroup[g.id]||0, subs }; })
    .filter(x=>x.b||x.s).sort((a,b)=>(b.s/(b.b||1))-(a.s/(a.b||1)));
  const hist=ms.map(x=>({m:x,a:flows(x).expense,b:budgetFor(x).total}));
  const anyHist = hist.some(x=>x.b>0);
  CHARTS.bcmp={ draw: el=>drawGroupedBars(el,{labels:hist.map(x=>fMon(x.m)+(isPartial(x.m)?'*':'')),series:[{name:'Aktual',color:'var(--s1)',values:hist.map(x=>x.a)}],refs:hist.map(x=>x.b),flags:hist.map(x=>x.b&&x.a>x.b?'Lewat':''),height:190}),
    tip: i=>`<div class="th">${monthLabel(hist[i].m)}</div>${tipRow('var(--s1)','Aktual',rp(hist[i].a))}${tipRow('','Budget',hist[i].b?rp(hist[i].b):'tanpa budget')}${hist[i].b?tipRow('','Selisih',rp(hist[i].b-hist[i].a,{sign:true})):''}` };
  const bar=(s,b)=>{ const p=b?s/b*100:0; return `<div class="bar thin"><i class="${p>100?'over':p>85?'warn':'ok'}" style="width:${b?Math.min(p,100):0}%"></i></div>`; };
  const src = bud.overridden ? `khusus ${fMonth(m)}` : 'default berulang';
  const summary = bud.any ? `
      <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap"><span style="font-size:30px;font-weight:750;letter-spacing:-.03em" class="m num ${remain<0?'neg':''}">${rp(remain)}</span><span class="mut">${remain>=0?'tersisa':'lewat budget'}</span></div>
      <div class="bar" style="height:12px"><i class="${used>100?'over':used>ideal+5?'warn':''}" style="width:${Math.min(used,100)}%"></i>${part?`<span style="position:absolute;top:-3px;bottom:-3px;left:${ideal}%;width:2px;background:var(--ink2);border-radius:1px"></span>`:''}</div>
      <div style="display:flex;justify-content:space-between;font-size:13px" class="mut"><span>Terpakai <b class="m" style="color:var(--ink)">${rp(spent)}</b> (${idn(used)}%)</span><span>dari <span class="m">${rp(bud.total)}</span></span></div>
      ${part?`<p class="note">Garis = laju ideal hari ke-${TODAY_DAY} dari ${daysIn(m)} (${idn(ideal)}%). ${used>ideal?'Pengeluaran sedikit di atas laju ideal.':'Masih di bawah laju ideal.'}</p>`:''}
      <p class="note">Sumber: <b>${src}</b>. ${bud.auto?'Total = jumlah budget per sub-kategori.':`Teralokasi ke sub-kategori <b class="m">${rp(bud.sum)}</b> dari total ${rp(bud.total)}${bud.sum>bud.total?' — <b class="neg">melebihi total</b>':''}.`} Sub-kategori tanpa budget tetap tercatat, hanya tidak dibatasi.</p>`
    : `<div style="display:flex;flex-direction:column;gap:10px"><b style="font-size:17px">Belum ada budget untuk ${fMonth(m)}</b><p class="note">Budget itu opsional — semua pengeluaran tetap tercatat dan dianalisis. Kalau mau, isi budget default per sub-kategori (berlaku tiap bulan) atau khusus bulan ini saja.</p><p class="note">Terpakai bulan ini: <b class="m">${rp(spent)}</b></p><button class="btn pri" data-act="budgetForm">${I('edit','sm')} Atur budget</button></div>`;
  return `<div style="display:flex;align-items:center;gap:8px"><button class="ibtn" data-act="bMonth" data-d="-1" ${i0<=0?'disabled style="opacity:.4"':''} aria-label="Bulan sebelumnya">${I('back','sm')}</button><div class="pillhead" style="justify-content:center;color:var(--ink)">${fMonth(m)}${part?' · berjalan':''}</div><button class="ibtn" data-act="bMonth" data-d="1" ${i0>=ms.length-1?'disabled style="opacity:.4"':''} aria-label="Bulan berikutnya">${I('fwd','sm')}</button></div>
  <div class="cols"><div class="col">
    <section class="tray">${trayH('Budget bulanan',`<button class="ibtn" data-act="budgetForm" aria-label="Ubah budget">${I('edit','sm')}</button>`)}<div class="card pad" style="display:flex;flex-direction:column;gap:12px">${summary}</div></section>
    ${anyHist?`<section class="tray">${trayH('Budget vs aktual','',`Garis hitam = budget. Pengeluaran saja — tanpa transfer & beli investasi.`)}<div class="card pad"><div class="legend" style="margin-bottom:8px"><span><i class="sw" style="background:var(--s1)"></i>Aktual</span><span><i class="sw" style="background:var(--ink);height:3px"></i>Budget</span></div><div class="chart" data-chart="bcmp"></div></div></section>`:''}
  </div><div class="col">
    <section class="tray">${trayH('Per kategori','',`${groups.filter(x=>x.b&&x.s>x.b).length} kategori lewat budget · ketuk untuk lihat transaksi`)}<div class="card list">${groups.map(x=>{ const p=x.b?x.s/x.b*100:0;
      const head = `<button class="crow" data-act="drill" data-c="${x.g.id}" data-m="${m}">${tile(x.g,'sm')}<div style="min-width:0"><div class="t1"><span>${esc(x.g.label)}</span>${x.b&&p>100?'<span class="tag bad">lewat</span>':''}</div><div style="margin:7px 0 4px">${bar(x.s,x.b)}</div><div class="t2"><span class="m">${rpc(x.s)}</span> / <span class="m">${x.b?rpc(x.b):'tanpa budget'}</span></div></div><div class="r"><b class="m ${x.b&&x.b-x.s<0?'neg':''}">${x.b?rpc(x.b-x.s):'—'}</b><span class="delta flat">${x.b?(x.b-x.s<0?'lewat':'sisa')+' · '+idn(p)+'%':''}</span></div></button>`;
      const subs = x.kids>1 ? x.subs.filter(y=>y.s||y.b).map(y=>`<button class="crow sub" data-act="drill" data-c="${y.c.id}" data-m="${m}"><div style="min-width:0"><div class="t1" style="font-size:13.5px;font-weight:600"><span>${y.c.icon} ${esc(y.c.label)}</span></div>${y.b?`<div style="margin-top:5px">${bar(y.s,y.b)}</div>`:''}</div><div class="r"><b class="m" style="font-size:13.5px">${rpc(y.s)}</b><span class="delta flat">${y.b?'dari '+rpc(y.b):'tanpa budget'}</span></div></button>`).join('') : '';
      return head+subs; }).join('')||'<div class="empty">Belum ada pengeluaran atau budget di bulan ini.</div>'}</div></section>
  </div></div>`;
}

/* ================= TUJUAN ================= */
function vGoals(){
  const tot=S.goals.reduce((s,g)=>s+g.saved,0), wealth=wealthAt(null).total;
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Tujuan kamu',`<button class="ibtn" data-act="goalForm" aria-label="Tambah tujuan">${I('plus','sm')}</button>`)}<div class="card list">${S.goals.map(g=>{ const p=g.saved/g.target*100;
      return `<button class="row" data-act="goal" data-id="${g.id}" style="padding:18px 16px"><span class="tile" style="width:58px;height:58px;font-size:28px;border-radius:18px">${g.icon}</span><div class="mid"><div class="t1" style="font-size:16.5px">${esc(g.name)}</div><div class="bar" style="margin:9px 0 7px"><i style="width:${Math.min(p,100)}%"></i></div><div class="t2" style="display:block"><span class="m">${rpc(g.saved)}</span> / <span class="m">${rpc(g.target)}</span></div></div><span class="pct">${idn(Math.floor(p))}%</span></button>`; }).join('')||'<div class="empty">Belum ada tujuan.</div>'}</div></section>
  </div><div class="col">
    <section class="tray">${trayH('Alokasi vs kekayaan')}<div class="card pad" style="display:flex;flex-direction:column;gap:10px">
      <div style="font-size:24px;font-weight:720" class="m num">${rp(tot)}</div><div class="mut" style="font-size:13.5px">sudah dialokasikan dari kekayaan bersih <span class="m">${rp(wealth)}</span></div>
      <div class="bar"><i class="${tot>wealth?'over':''}" style="width:${Math.min(pct(tot,wealth),100)}%"></i></div>
      <p class="note">${tot>wealth?'<b class="neg">Alokasi melebihi kekayaan</b> — ada tujuan yang dihitung dobel.':`Belum dialokasikan: <b class="m">${rp(wealth-tot)}</b>.`} Tujuan adalah "amplop" virtual — menyetor tidak memindahkan uang, jadi tidak memengaruhi saldo dompet.</p>
    </div></section>
  </div></div>`;
}

/* ================= INBOX SUARA (Telegram) ================= */
const waveBars = (seed,n=34) => { const r=mulberry32(seed); return Array.from({length:n},()=>`<i style="height:${6+Math.round(r()*20)}px"></i>`).join(''); };
function parsedGrid(d){
  const p=d.parsed; const c=p.type==='transfer'?null:cat(p.cat,p.type);
  const cell=(k,v,low,wide)=>`<div class="${low?'lowc':''} ${wide?'wide':''}"><div class="k">${k}</div><div class="v">${v}</div></div>`;
  return `<div class="parsed">
    ${cell('Jenis',TYPE_LABEL[p.type])}${cell('Jumlah',p.amount?`<span class="m">${rp(p.amount)}</span>`:'—',p.amtConf==='low')}
    ${p.type==='transfer'?cell('Dari → ke',esc(W(p.wallet).short)+' → '+esc(W(p.to).short),p.wConf==='low'):cell('Kategori',c.icon+' '+esc(c.label),p.catConf==='low')}
    ${p.type==='transfer'?cell('Tanggal',fDate(p.date)):cell('Dompet',esc(W(p.wallet).short),p.wConf==='low')}
    ${p.type==='transfer'?'':cell('Tanggal',fDate(p.date),p.dConf==='low')}${cell('Catatan',esc(p.note),false,p.type==='transfer')}
  </div>`;
}
function vnCard(d){
  return `<div class="card vn" id="vn-${d.id}">
    <div class="vn-top">${av(d.owner,'md')}<div class="who"><b>${esc(MEMBERS[d.owner]?.name||'—')}</b>${d.at.slice(11,16)} · ${d.channel==='app'?'tes dari aplikasi':'via Telegram'}</div><span class="tag tg">${I('send','xs')} Bot</span></div>
    <div class="audio"><button class="play" data-act="play" data-id="${d.id}" aria-label="Putar">${I('play')}</button><div class="wave" id="wave-${d.id}">${waveBars(hashStr(d.id)+d.dur*13)}</div><span class="dur">0:${String(d.dur).padStart(2,'0')}</span></div>
    <p class="transcript">“${esc(d.transcript)}”</p>
    ${parsedGrid(d)}
    ${(d.parsed.amtConf==='low'||d.parsed.catConf==='low'||d.parsed.wConf==='low')?'<p class="note" style="color:var(--warn)">Kolom berlabel CEK ditebak sistem — pastikan dulu sebelum disimpan.</p>':''}
    <div class="btns"><button class="btn sm" data-act="vnReject" data-id="${d.id}">${I('x','sm')} Tolak</button><button class="btn sm" data-act="vnEdit" data-id="${d.id}">${I('edit','sm')} Ubah</button><button class="btn sm pri" data-act="vnApprove" data-id="${d.id}" ${d.parsed.amount?'':'disabled'}>${I('check','sm')} Simpan</button></div>
  </div>`;
}
function tgPhone(){
  const items=[...S.reviewed.slice(-4).map(r=>({...r,done:true})), ...S.pending.map(p=>({...p,done:false}))].sort((a,b)=>a.at<b.at?-1:1);
  const msg = d => { const p=d.parsed; const c=p.type==='transfer'?null:cat(p.cat,p.type);
    const line = p.type==='transfer' ? `🔁 Transfer ${rp(p.amount)}\n${W(p.wallet).short} → ${W(p.to).short}` : `${p.type==='income'?'💰 Pemasukan':'🧾 Pengeluaran'} ${rp(p.amount)}\n${c.icon} ${c.label} · ${W(p.wallet).short}`;
    return `<div class="bub me"><div class="aud"><span class="play">${I('play')}</span><div class="wave">${waveBars(hashStr(d.id)+d.dur*13,24)}</div></div><div class="tm">${d.at.slice(11,16)} ✓✓</div></div>
    <div class="bub bot"><b>📝 Draft — mohon dicek</b><br>${esc(line).replace(/\n/g,'<br>')}<br>📅 ${fDate(p.date)} · ✏️ ${esc(p.note)}<br><span style="color:#667">“${esc(d.transcript)}”</span><div class="tm">${d.at.slice(11,16)}</div></div>
    ${d.done?`<div class="tgsys">${d.result==='approved'?'✅ Disimpan':'❌ Dibatalkan'} oleh ${MEMBERS[d.by]?.name||'-'}</div>`:`<div class="tgkb"><button data-act="vnApprove" data-id="${d.id}" ${p.amount?'':'disabled'}>✅ Simpan</button><button data-act="vnEdit" data-id="${d.id}">✏️ Ubah</button><button data-act="vnReject" data-id="${d.id}">❌ Batal</button></div>`}`; };
  return `<div class="tgphone"><div class="tghead"><span class="ava">K</span><div><b>Keuangan Keluarga Bot</b><span>bot · grup Ayah & Bunda</span></div></div>
    <div class="tgbody" id="tgbody"><div class="tgsys">Kirim VN atau ketik transaksi. Semua masuk sebagai draft dulu.</div>${items.map(msg).join('')}</div>
    <form class="tginput" data-form="tgSend"><button type="button" class="mic" data-act="voice" data-t="tg" aria-label="Rekam suara">${I('mic','sm')}</button><input name="t" placeholder="Ketik atau tekan mic…" autocomplete="off"><button type="submit" aria-label="Kirim">${I('send','sm')}</button></form></div>`;
}
function vInbox(){
  const ex=['Makan siang nasi padang 35 ribu pakai gopay','Bayar listrik token dua ratus ribu dari BCA','Dapet bonus proyek freelance 1,5 juta masuk Jago','Top up GoPay 100rb pake BCA','Beli susu dan popok tiga ratus dua puluh ribu','Kemarin isi bensin 150rb cash'];
  const tab=UI.inboxTab;
  const list = `<section class="tray">${trayH('Menunggu review',S.pending.length?`<span class="tag bad">${S.pending.length}</span>`:'',`Draft hanya tercatat setelah disetujui`)}<div style="display:flex;flex-direction:column;gap:6px">${S.pending.map(vnCard).join('')||'<div class="card empty">Semua sudah direview 🎉</div>'}</div></section>`;
  const sim = `<section class="tray">${trayH('Catat lewat suara','',`Bicara langsung di sini, atau ketik kalimatnya — hasilnya jadi draft sungguhan`)}<form class="card pad form" data-form="simVN">
      <button type="button" class="btn brand block voicebtn" data-act="voice" data-t="sim">${I('mic','sm')}<span class="vl">Tekan lalu bicara</span></button>
      <p class="note" style="text-align:center">Contoh: “tadi isi bensin lima puluh ribu pakai cash”. Rekaman berhenti sendiri saat kamu diam.</p>
      <div class="seg full">${Object.values(MEMBERS).map(m=>`<button type="button" class="${UI.simAs===m.id?'on':''}" data-act="simAs" data-k="${m.id}">Sebagai ${esc(m.name)}</button>`).join('')}</div>
      <textarea class="inp" name="t" rows="2" placeholder="…atau ketik: makan siang 35rb pakai gopay">${esc(UI.simText||'')}</textarea>
      <div class="quick">${ex.map(e=>`<button type="button" data-act="simEx" data-t="${esc(e)}">${esc(e.length>30?e.slice(0,28)+'…':e)}</button>`).join('')}</div>
      <button class="btn block" type="submit">${I('send','sm')} Kirim teks sebagai draft</button>
    </form></section>`;
  const done = S.reviewed.length?`<section class="tray">${trayH('Baru direview')}<div class="card list">${S.reviewed.slice().reverse().slice(0,6).map(r=>`<div class="vn-done">${av(r.owner,'md')}<div class="mid" style="flex:1;min-width:0"><div class="t1" style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(r.parsed.note)}</div><div class="t2 mut" style="font-size:13px">${r.result==='approved'?'Disimpan':'Ditolak'} oleh ${MEMBERS[r.by]?.name||'—'}</div></div>${r.result==='approved'?`<span class="tag ok">${rpc(r.parsed.amount)}</span>`:'<span class="tag">ditolak</span>'}</div>`).join('')}</div></section>`:'';
  const how = `<div class="callout brand" style="flex-direction:column;gap:6px"><b style="color:var(--ink)">Alurnya</b><span>1) Ayah/Bunda kirim VN ke bot Telegram → 2) suara diubah jadi teks & dibaca jadi draft → 3) draft muncul di sini <i>dan</i> di Telegram dengan tombol Simpan/Ubah/Batal → 4) baru masuk ke transaksi setelah disetujui. Keputusan dari mana pun langsung sinkron.</span></div><div class="callout warn"><span><b>Status:</b> bot Telegram belum disambungkan (butuh token bot & API key suara-ke-teks). Sementara, pakai <b>Catat lewat suara</b> di bawah — bicara langsung dari HP, draft-nya masuk database yang sama dan disetujui seperti aslinya.</span></div>`;
  return `${how}
  <div class="seg full mobile-only"><button class="${tab==='queue'?'on':''}" data-act="inboxTab" data-k="queue">Antrean (${S.pending.length})</button><button class="${tab==='tg'?'on':''}" data-act="inboxTab" data-k="tg">Tampilan Telegram</button></div>
  <div class="cols even"><div class="col ${tab==='tg'?'desk-only':''}">${list}${sim}${done}</div><div class="col ${tab==='queue'?'desk-only':''}"><section class="tray">${trayH('Tampilan di Telegram','',`Tombol di sini berfungsi sama dengan di aplikasi`)}${tgPhone()}</section></div></div>`;
}

/* ================= PENGATURAN & MENU ================= */
function vSettings(){
  const u=MEMBERS[S.user]; const theme=UI.theme;
  const rcStatus = r => { const done=S.txns.some(t=>t.recurring===r.id && monthOf(t.date)===CUR_MONTH); if(done) return '<span class="tag ok">Tercatat bln ini</span>'; if(!r.active) return '<span class="tag">Nonaktif</span>'; if(r.day<=TODAY_DAY) return `<button class="btn sm pri" data-act="postRecurring" data-id="${r.id}">Catat sekarang</button>`; return `<span class="tag">Tgl ${r.day}</span>`; };
  const actW = S.wallets.filter(w=>!w.archived);
  return `<div class="cols"><div class="col">
    <section class="tray">${trayH('Akun')}<div class="card"><div class="row">${av(S.user,'')}<div class="mid"><div class="t1">${esc(u.name)}</div><div class="t2">${esc(S.email)}</div></div><button class="btn sm" data-act="logout">${I('logout','sm')} Keluar</button></div>
      ${actW.length?`<form class="row" data-form="defWallet" style="gap:10px"><div class="mid"><div class="t1" style="font-size:14.5px">Dompet default saya</div><div class="t2">Dipakai saat mencatat & saat VN tidak menyebut dompet</div></div><select class="inp" name="w" style="width:140px;height:42px" data-autosubmit>${actW.map(w=>`<option value="${w.id}" ${u.defWallet===w.id?'selected':''}>${esc(w.short)}</option>`).join('')}</select></form>`:''}
    </div></section>
    <section class="tray">${trayH('Tampilan')}<div class="card list">
      <div class="row"><div class="mid"><div class="t1">Tema</div><div class="t2">Ikuti sistem, terang, atau gelap</div></div><div class="seg">${[['system','Sistem'],['light','Terang'],['dark','Gelap']].map(o=>`<button class="${theme===o[0]?'on':''}" data-act="theme" data-k="${o[0]}">${o[1]}</button>`).join('')}</div></div>
      <button class="row" data-act="mask"><div class="mid"><div class="t1">Sembunyikan nominal</div><div class="t2">Blur semua angka rupiah di perangkat ini</div></div><span class="switch ${UI.masked?'on':''}"></span></button>
    </div></section>
    <section class="tray">${trayH('Anggota keluarga','',`Data dibagi bersama; tiap transaksi mencatat siapa yang input`)}<div class="card list">
      ${Object.values(MEMBERS).map(m=>{ const n=S.txns.filter(t=>t.owner===m.id && monthOf(t.date)===CUR_MONTH).length; return `<div class="row">${av(m.id,'md')}<div class="mid"><div class="t1">${esc(m.name)}${m.id===S.user?' <span class="tag">kamu</span>':''}</div><div class="t2">${esc(m.email)} · ${m.userId?n+' transaksi bulan ini':'menunggu daftar'}</div></div>${m.userId?'':`<button class="btn sm" data-act="removeInvite" data-id="${m.id}">Batalkan</button>`}</div>`; }).join('')}
      <form class="pad form" data-form="invite" style="border-top:1px solid var(--line)"><div class="flbl">Undang anggota</div><div class="frow"><input class="inp" name="name" placeholder="Nama tampilan, mis. Bunda" maxlength="20" required><input class="inp" name="email" type="email" placeholder="email@gmail.com" required></div><button class="btn block" type="submit">${I('users','sm')} Izinkan email ini</button><p class="note">Setelah diizinkan, ia buka website ini → <b>Daftar</b> dengan email tersebut dan buat kata sandi sendiri. Email lain tidak bisa mendaftar.</p></form>
    </div></section>
    <section class="tray">${trayH('Data')}<div class="card pad"><p class="note">Data tersimpan di database Supabase (region Singapura) dan hanya bisa dibaca anggota keluarga di atas. Pencatatan dimulai ${fDate(LEDGER_START)}. Pengaturan tema & sembunyikan nominal disimpan per perangkat.</p></div></section>
  </div><div class="col">
    <section class="tray">${trayH('Transaksi berulang',`<button class="ibtn" data-act="recurringForm" aria-label="Tambah transaksi berulang">${I('plus','sm')}</button>`,`Dicatat dengan satu tap saat jatuh tempo`)}<div class="card list">${S.recurring.map(r=>`<div class="row"><button class="switch ${r.active?'on':''}" data-act="toggleRecurring" data-id="${r.id}" aria-label="Aktif"></button><div class="mid"><div class="t1">${esc(r.name)}</div><div class="t2"><span class="m">${rp(r.amount)}</span> · ${r.type==='transfer'?esc(W(r.wallet).short)+' → '+esc(W(r.to).short):esc(W(r.wallet).short)} · tiap tgl ${r.day}</div></div>${rcStatus(r)}</div>`).join('')||'<div class="empty">Belum ada. Contoh: gaji tiap tgl 25, sewa tiap tgl 2, internet tiap tgl 8.</div>'}</div></section>
    ${catManager()}
  </div></div>`;
}
function catManager(){
  const kind=UI.catKind||'expense'; const gs=groupCats(kind); const arch=catList(kind).filter(c=>c.archived);
  const used = id => S.txns.filter(t=>t.cat===id).length;
  return `<section class="tray">${trayH('Kategori & sub-kategori',`<button class="ibtn" data-act="catForm" data-kind="${kind}" aria-label="Tambah kategori">${I('plus','sm')}</button>`,kind==='expense'?'Budget default opsional — kosong berarti tanpa budget':'Sumber pemasukan')}
    <div style="padding:0 6px 10px"><div class="seg full"><button class="${kind==='expense'?'on':''}" data-act="catKind" data-k="expense">Pengeluaran</button><button class="${kind==='income'?'on':''}" data-act="catKind" data-k="income">Pemasukan</button></div></div>
    <div class="card list">${gs.map(g=>{ const kids=kidsOf(g.id,kind);
      const gb = kind==='expense' ? (kids.length? kids.reduce((a,c)=>a+(c.budget||0),0) : (g.budget||0)) : 0;
      return `<div class="row">${tile(g,'sm')}<div class="mid"><div class="t1">${esc(g.label)}</div><div class="t2">${kids.length?kids.length+' sub':'tanpa sub'}${kind==='expense'?` · budget default ${gb?'<span class="m">'+rpc(gb)+'</span>':'—'}`:''}</div></div><button class="ibtn flat" style="width:36px;height:36px" data-act="catForm" data-kind="${kind}" data-parent="${g.id}" aria-label="Tambah sub-kategori di ${esc(g.label)}">${I('plus','xs')}</button><button class="ibtn flat" style="width:36px;height:36px" data-act="catEdit" data-id="${g.id}" aria-label="Ubah ${esc(g.label)}">${I('edit','xs')}</button></div>
        ${kids.map(c=>`<button class="row" data-act="catEdit" data-id="${c.id}" style="padding:9px 16px 9px 70px;border-top:0"><div class="mid"><div class="t1" style="font-size:14px">${c.icon} ${esc(c.label)}</div></div><span class="mut m" style="font-size:13px">${kind==='expense'?(c.budget?rpc(c.budget)+'/bln':'tanpa budget'):''}</span>${I('fwd','xs')}</button>`).join('')}`; }).join('')}
      ${arch.length?`<div class="row" style="background:var(--card2)"><div class="mid"><div class="t2">Diarsipkan: ${arch.map(c=>`<button class="lnk" data-act="catEdit" data-id="${c.id}">${esc(c.label)}</button>`).join(', ')}</div></div></div>`:''}
    </div></section>`;
}
function vMenu(){
  const p=portfolio(null), b=budgetFor(CUR_MONTH), f=flows(CUR_MONTH);
  const items=[['invest','trend','Investasi',rpc(p.value)],['recv','coins','Piutang',rpc(recvTotal(null))],['budget','gauge','Budget',b.any?'sisa '+rpc(b.total-f.expense):'belum diatur'],['goals','target','Tujuan',S.goals.length+' tujuan'],['income','arrin','Pemasukan',rpc(f.income)],['expense','arrout','Pengeluaran',rpc(f.expense)],['inbox','mic','Inbox suara',S.pending.length+' menunggu'],['settings','sliders','Pengaturan','Tema, kategori, rutin']];
  return `<div class="stats">${items.map(i=>`<button class="stat" data-act="go" data-v="${i[0]}" style="padding:16px"><span class="k-ico" style="width:40px;height:40px;border-radius:13px;background:var(--chip);color:var(--ink)">${I(i[1],'sm')}</span><span style="font-weight:700;font-size:15.5px;margin-top:10px">${i[2]}</span><span class="mut m" style="font-size:13px">${i[3]}</span></button>`).join('')}</div>`;
}
