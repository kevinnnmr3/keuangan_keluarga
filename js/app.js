/* =========================================================
   APP — routing, sheet (modal), aksi & form.
   Semua perubahan data lewat DB.* (store.js), lalu data dimuat ulang.
   ========================================================= */
const pref = (k,d) => { try{ const v=localStorage.getItem('kk-'+k); return v===null?d:v; }catch(e){ return d; } };
const setPref = (k,v) => { try{ localStorage.setItem('kk-'+k,v); }catch(e){} };
const UI = {
  view:'home', param:null, flowRange:3, catMode:'same', invFilter:'all', invMode:'value', budgetMonth:CUR_MONTH,
  collapsed:{}, histSort:{k:'date',dir:-1}, inboxTab:'queue', simAs:null, simText:'', authMode:'login', busy:false,
  theme: pref('theme','system'), masked: pref('masked','0')==='1',
  hf:{type:'all',period:'month',cat:'all',wallet:'all',owner:'all',q:''},
  ff:{ income:{type:'income',period:'month',cat:'all',wallet:'all',owner:'all',q:''}, expense:{type:'expense',period:'month',cat:'all',wallet:'all',owner:'all',q:''} },
};
const VIEWS = {
  home:{t:'Beranda', f:vHome, nav:'home'}, history:{t:'Riwayat', f:vHistory, nav:'history'}, wallets:{t:'Dompet', f:vWallets, nav:'wallets'},
  invest:{t:'Investasi', f:vInvest, nav:'invest'}, invDetail:{t:'', f:()=>vInvDetail(UI.param), back:'invest', nav:'invest'},
  recv:{t:'Piutang', f:vRecv, nav:'recv'}, budget:{t:'Budget', f:vBudget, nav:'budget'}, goals:{t:'Tujuan', f:vGoals, nav:'goals'},
  income:{t:'Pemasukan', f:()=>vFlow('income'), nav:'income'}, expense:{t:'Pengeluaran', f:()=>vFlow('expense'), nav:'expense'},
  inbox:{t:'Inbox suara', f:vInbox, nav:'inbox'}, settings:{t:'Pengaturan', f:vSettings, nav:'settings'}, menu:{t:'Menu', f:vMenu, nav:'menu'},
};
const MOBILE_NAV = { home:'home', history:'history', wallets:'wallets' };

function applyTheme(){ const r=document.documentElement; if(UI.theme==='system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme',UI.theme); document.body.classList.toggle('masked',UI.masked); }
const errMsg = e => { const m=(e&&(e.message||e.error_description||e.msg))||String(e); if(/Invalid login credentials/i.test(m)) return 'Email atau kata sandi salah.'; if(/belum diizinkan|Database error saving new user/i.test(m)) return 'Email ini belum diizinkan. Minta anggota keluarga menambahkan email kamu di Pengaturan.'; if(/already registered/i.test(m)) return 'Email ini sudah terdaftar — pilih Masuk.'; if(/Password should be/i.test(m)) return 'Kata sandi minimal 6 karakter.'; if(/Failed to fetch|NetworkError/i.test(m)) return 'Tidak ada koneksi internet.'; return m; };

/* ---------- layar login ---------- */
function renderLogin(msg){
  const reg = UI.authMode==='signup';
  document.getElementById('root').innerHTML = `<div class="login"><div class="login-card">
    <section class="hero"><span class="proto">${I('lock','xs')} Khusus keluarga</span><h1>Keuangan keluarga, satu tempat.</h1><p>Dompet, investasi, piutang, budget, dan catatan suara dari Telegram.</p></section>
    <form class="tray" data-form="auth" style="padding:6px"><div class="card pad form">
      <div class="seg full"><button type="button" class="${!reg?'on':''}" data-act="authMode" data-k="login">Masuk</button><button type="button" class="${reg?'on':''}" data-act="authMode" data-k="signup">Daftar pertama kali</button></div>
      <div class="fld"><label for="lg-e">Email</label><input class="inp" id="lg-e" name="email" type="email" placeholder="nama@gmail.com" autocomplete="username" required></div>
      <div class="fld"><label for="lg-p">Kata sandi${reg?' (buat baru, min. 6 karakter)':''}</label><input class="inp" id="lg-p" name="pass" type="password" placeholder="••••••••" autocomplete="${reg?'new-password':'current-password'}" minlength="6" required></div>
      <p class="note" id="lg-err" style="color:var(--neg)">${esc(msg||'')}</p>
      <button class="btn pri block" type="submit">${reg?'Daftar & masuk':'Masuk'}</button>
      <p class="note">${reg?'Hanya email yang sudah diizinkan anggota keluarga yang bisa mendaftar.':'Belum punya kata sandi? Pilih <b>Daftar pertama kali</b> dengan email yang sudah diizinkan.'}</p>
    </div></form></div></div>`;
}
function renderLoading(text='Memuat data…'){ document.getElementById('root').innerHTML = `<div class="login"><div class="login-card" style="align-items:center;text-align:center;gap:10px"><div class="brandmark" style="justify-content:center;padding:0"><span class="lg">KK</span></div><p class="mut">${esc(text)}</p></div></div>`; }
function renderNoMember(){ document.getElementById('root').innerHTML = `<div class="login"><div class="login-card"><section class="tray" style="padding:6px"><div class="card pad form"><b style="font-size:17px">Akun belum terhubung</b><p class="note">Kamu masuk sebagai <b>${esc(S.email)}</b>, tapi email ini belum terdaftar sebagai anggota keluarga.</p><button class="btn pri block" data-act="logout">Keluar</button></div></section></div></div>`; }

/* ---------- shell ---------- */
function renderShell(){
  const sideItem=(v,ic,l)=>`<button class="nv" data-act="go" data-v="${v}" data-nav="${v}">${I(ic,'sm')}${l}${v==='inbox'?'<span class="dot-badge" data-badge></span>':''}</button>`;
  document.getElementById('root').innerHTML = `<div class="app">
    <aside class="side">
      <div class="brandmark"><span class="lg">KK</span><div><b>${esc(S.household.name)}</b><span>${fDate(TODAY)}</span></div></div>
      <button class="btn pri addbtn" data-act="add">${I('plus','sm')} Catat transaksi</button>
      ${sideItem('home','home','Beranda')}${sideItem('history','history','Riwayat')}${sideItem('inbox','mic','Inbox suara')}
      <div class="sec">Uang & aset</div>${sideItem('wallets','card','Dompet')}${sideItem('invest','trend','Investasi')}${sideItem('recv','coins','Piutang')}
      <div class="sec">Arus & rencana</div>${sideItem('income','arrin','Pemasukan')}${sideItem('expense','arrout','Pengeluaran')}${sideItem('budget','gauge','Budget')}${sideItem('goals','target','Tujuan')}
      <div class="sec">Lainnya</div>${sideItem('settings','sliders','Pengaturan')}
      <div class="me">${av(S.user,'md')}<div><b>${esc(MEMBERS[S.user].name)}</b>${esc(S.email)}</div></div>
    </aside>
    <main class="main"><header class="top" id="top"></header><div id="view"></div></main>
  </div>
  <div class="bnav"><nav>
    <button data-act="go" data-v="home" data-mnav="home" aria-label="Beranda">${I('home')}</button>
    <button data-act="go" data-v="history" data-mnav="history" aria-label="Riwayat">${I('history')}</button>
    <button class="add" data-act="add" aria-label="Catat transaksi">${I('plus')}</button>
    <button data-act="go" data-v="wallets" data-mnav="wallets" aria-label="Dompet">${I('card')}</button>
    <button data-act="go" data-v="menu" data-mnav="menu" aria-label="Menu">${I('grid')}<span class="dot-badge" data-badge></span></button>
  </nav></div>`;
}
function renderTop(){
  const v=VIEWS[UI.view]; const el=document.getElementById('top'); const pend=S.pending.length;
  const right = `<button class="ibtn" data-act="mask" aria-label="Sembunyikan nominal">${I(UI.masked?'eyeoff':'eye','sm')}</button><button class="ibtn" data-act="go" data-v="inbox" aria-label="Inbox suara">${I('mic','sm')}${pend?`<span class="dot-badge">${pend}</span>`:''}</button>`;
  if(v.back){ const title = UI.view==='invDetail' ? (INV(UI.param)?.name||'') : v.t;
    el.innerHTML = `<button class="ibtn lg" data-act="go" data-v="${v.back}" aria-label="Kembali">${I('back')}</button><div class="pillhead">${esc(title)}</div>`; return; }
  const hr = new Date().getHours(); const greet = hr<11?'Selamat pagi':hr<15?'Selamat siang':hr<18?'Selamat sore':'Selamat malam';
  el.innerHTML = UI.view==='home'
    ? `<span class="avatar av-c${MEMBERS[S.user].color} mob" data-act="go" data-v="settings">${esc(MEMBERS[S.user].name[0])}</span><div class="ttl"><div class="hi">${greet} · ${DAYS[dParse(TODAY).getDay()]}, ${fDate(TODAY)}</div><h1>Halo, ${esc(MEMBERS[S.user].name)}</h1></div>${right}<button class="btn pri sm desk-only" data-act="add">${I('plus','sm')} Catat</button>`
    : `<div class="ttl"><h1>${v.t}</h1></div>${right}${['history','income','expense','wallets'].includes(UI.view)?`<button class="btn pri sm desk-only" data-act="add" ${UI.view==='income'?'data-type="income"':''}>${I('plus','sm')} Catat</button>`:''}`;
}
function renderView(keepScroll){
  const y=scrollY;
  renderTop();
  const v=VIEWS[UI.view];
  try { document.getElementById('view').innerHTML = `<div class="view">${v.f()}</div>`; }
  catch(e){ console.error(e); document.getElementById('view').innerHTML = `<div class="view"><div class="card empty">Halaman ini gagal ditampilkan: ${esc(e.message)}</div></div>`; }
  document.querySelectorAll('[data-nav]').forEach(b=>b.classList.toggle('on', b.dataset.nav===v.nav));
  const mn = MOBILE_NAV[v.nav] || 'menu';
  document.querySelectorAll('[data-mnav]').forEach(b=>b.classList.toggle('on', b.dataset.mnav===mn));
  document.querySelectorAll('[data-badge]').forEach(b=>{ b.textContent=S.pending.length; b.hidden=!S.pending.length; });
  mountCharts(document.getElementById('view'));
  if(keepScroll) scrollTo(0,y);
  const tg=document.getElementById('tgbody'); if(tg) tg.scrollTop=tg.scrollHeight;
}
function go(v,param){ UI.view=v; UI.param=param||null; closeSheet(); renderView(); scrollTo(0,0); }

/* Jalankan mutasi → muat ulang → render. */
async function run(fn, okMsg, opts={}){
  if(UI.busy) return; UI.busy=true; document.body.classList.add('busy');
  const btn = document.activeElement && document.activeElement.closest('button'); if(btn) btn.disabled=true;
  try{
    await fn(); setToday(); await loadAll();
    if(opts.keepSheet!==true) closeSheet();
    renderView(true); if(okMsg) toast(okMsg);
    return true;
  }catch(e){ console.error(e); toast('Gagal: '+errMsg(e), true); if(btn) btn.disabled=false; return false; }
  finally{ UI.busy=false; document.body.classList.remove('busy'); }
}
async function reload(){ try{ setToday(); await loadAll(); if(S && S.user) renderView(true); }catch(e){ console.error(e); } }

/* ---------- sheet ---------- */
function openSheet(title, body, opts={}){
  const sh=document.getElementById('sheet'), sc=document.getElementById('scrim');
  sh.innerHTML = `<div class="grab"></div><div class="sh-h"><div class="pillhead">${title}</div><button class="ibtn lg" data-act="closeSheet" aria-label="Tutup">${I('x')}</button></div><div class="sh-b">${body}</div>`;
  sc.hidden=false; requestAnimationFrame(()=>{ sc.classList.add('on'); sh.classList.add('on'); });
  mountCharts(sh);
  const f=sh.querySelector('[autofocus]'); if(f && innerWidth>979) setTimeout(()=>f.focus(),250);
}
function closeSheet(){ const sh=document.getElementById('sheet'), sc=document.getElementById('scrim'); if(!sh) return; sh.classList.remove('on'); sc.classList.remove('on'); setTimeout(()=>{ if(!sh.classList.contains('on')){ sc.hidden=true; sh.innerHTML=''; } },300); }
const CONFIRM={yes:null,no:null};
function confirmIn(msg, yes, onYes, back){
  openSheet('Konfirmasi', `<div class="card pad" style="display:flex;flex-direction:column;gap:14px"><p style="font-size:15.5px;line-height:1.5">${msg}</p><div class="btns"><button class="btn" data-act="confirmNo">Batal</button><button class="btn danger" data-act="confirmYes">${yes}</button></div></div>`);
  CONFIRM.yes=onYes; CONFIRM.no=back;
}
function toast(msg, bad){ const t=document.getElementById('toast'); t.innerHTML=I(bad?'alert':'check','sm')+'<span>'+esc(msg)+'</span>'; t.style.background=bad?'var(--neg)':''; t.classList.add('on'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),bad?4200:2400); }

/* ---------- helpers form ---------- */
const parseAmt = v => Number(String(v||'').replace(/[^\d]/g,''))||0;
const fmtInput = el => { const n=parseAmt(el.value); el.value = n? idn(n):''; };
const walletChips = (name, sel, exclude) => { const b=balances(null); return `<div class="wsel" data-radio="${name}">${S.wallets.filter(w=>!w.archived && w.id!==exclude).map(w=>`<button type="button" class="${sel===w.id?'on':''}" data-val="${w.id}">${wDot(w.id)}<span>${esc(w.short)}<br><small class="mut m num" style="font-weight:550">${rpc(b[w.id])}</small></span></button>`).join('')}</div><input type="hidden" name="${name}" value="${sel||''}">`; };
const amountField = (v,af=true) => `<div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" placeholder="0" value="${v?idn(v):''}" data-money ${af?'autofocus':''} aria-label="Jumlah"></div><div class="quick">${[10000,25000,50000,100000,500000].map(q=>`<button type="button" data-act="qamt" data-v="${q}">+${rpc(q).replace('Rp ','')}</button>`).join('')}</div>`;
function formData(form){ const o={}; new FormData(form).forEach((v,k)=>o[k]=v); return o; }
function formErr(form,msg){ let e=form.querySelector('.ferr'); if(!e){ e=document.createElement('p'); e.className='note ferr'; e.style.color='var(--neg)'; const sb=form.querySelector('[type=submit]'); if(sb) sb.before(e); else form.appendChild(e); } e.textContent=msg; return false; }
const defWallet = () => { const d=MEMBERS[S.user]?.defWallet; return (d && S.wallets.find(w=>w.id===d && !w.archived)) ? d : (S.wallets.find(w=>!w.archived)||{}).id; };
function needWallet(){ if(S.wallets.some(w=>!w.archived)) return false; toast('Tambah dompet dulu supaya transaksi punya sumber dana.', true); sheetWalletForm(); return true; }

/* ---------- sheet: catat / ubah transaksi ---------- */
function sheetAdd(pre={}){
  if(needWallet()) return;
  const t = pre.id ? S.txns.find(x=>x.id===pre.id) : null;
  const d = Object.assign({ type:'expense', amount:0, cat:null, wallet:defWallet(), to:null, date:TODAY, note:'', owner:S.user, fundedFrom:'' }, t||{}, pre);
  if(!['expense','income','transfer'].includes(d.type)) d.type='expense';
  if(!d.wallet || !S.wallets.find(w=>w.id===d.wallet)) d.wallet=defWallet();
  if(d.type==='transfer' && (!d.to || d.to===d.wallet)) d.to = (S.wallets.find(w=>!w.archived && w.id!==d.wallet)||{}).id||'';
  const cats = d.type==='income'?S.incCats:S.expCats;
  if(d.type!=='transfer' && !cats.find(c=>c.id===d.cat)) d.cat = cats[0]?.id;
  const sells = S.txns.filter(x=>x.type==='inv_sell').slice(-6);
  const body = `<form class="form" data-form="tx">
    <input type="hidden" name="id" value="${t?t.id:''}"><input type="hidden" name="draft" value="${pre.draft||''}"><input type="hidden" name="type" value="${d.type}">
    ${t?'':`<div class="seg full">${[['expense','Pengeluaran'],['income','Pemasukan'],['transfer','Transfer']].map(o=>`<button type="button" class="${d.type===o[0]?'on':''}" data-act="txType" data-k="${o[0]}">${o[1]}</button>`).join('')}</div>`}
    ${amountField(d.amount, !pre.draft)}
    ${d.type==='transfer' ? `<div class="fld"><span class="flbl">Dari dompet</span>${walletChips('wallet',d.wallet)}</div><div class="fld"><span class="flbl">Ke dompet</span>${walletChips('to',d.to)}</div><p class="note">Transfer antar dompet tidak dihitung sebagai pemasukan atau pengeluaran.</p>`
      : `<div class="fld"><span class="flbl">${d.type==='income'?'Sumber':'Kategori'}</span><div class="catgrid" data-radio="cat">${cats.map(c=>`<button type="button" class="${d.cat===c.id?'on':''}" data-val="${c.id}"><span class="e">${c.icon}</span>${esc(c.label)}</button>`).join('')}</div><input type="hidden" name="cat" value="${d.cat||''}"></div>
         <div class="fld"><span class="flbl">${d.type==='income'?'Masuk ke':'Dibayar dari'}</span>${walletChips('wallet',d.wallet)}</div>`}
    <div class="frow"><div class="fld"><label for="tx-d">Tanggal</label><input class="inp" id="tx-d" type="date" name="date" value="${d.date}" min="${LEDGER_START}" max="${TODAY}"></div>
      <div class="fld"><label for="tx-o">Dicatat untuk</label><select class="inp" id="tx-o" name="owner">${memberOpts(d.owner||S.user)}</select></div></div>
    <div class="fld"><label for="tx-n">Catatan</label><input class="inp" id="tx-n" name="note" value="${esc(d.note)}" placeholder="mis. Superindo, bensin, gaji…" maxlength="80"></div>
    ${d.type==='expense'?`<div class="fld"><label for="tx-f">Didanai dari penjualan aset? (opsional)</label><select class="inp" id="tx-f" name="fundedFrom"><option value="">Tidak — dari kas biasa</option>${sells.map(s=>`<option value="${s.id}" ${d.fundedFrom===s.id?'selected':''}>${esc(s.note)} · ${fDate(s.date)}</option>`).join('')}</select><span class="note">Hanya penanda analisis. Penjualan asetnya sendiri tidak dihitung sebagai pengeluaran atau pemasukan.</span></div>`:''}
    <button class="btn pri block" type="submit">${pre.draft?'Simpan & setujui draft':t?'Simpan perubahan':'Simpan transaksi'}</button>
    ${t?`<button type="button" class="btn danger block" data-act="txDelete" data-id="${t.id}">${I('trash','sm')} Hapus transaksi</button>`:''}
    ${t||pre.draft?'':`<button type="button" class="btn block" data-act="go" data-v="inbox">${I('mic','sm')} Catat lewat suara</button>`}
  </form>`;
  openSheet(pre.draft?'Ubah draft suara':t?'Ubah transaksi':'Catat transaksi', body);
}
function sheetTx(id){
  const t=S.txns.find(x=>x.id===id); if(!t) return;
  const editable=['expense','income','transfer'].includes(t.type);
  const link = t.inv ? `<button class="row" data-act="go" data-v="invDetail" data-p="${t.inv}"><span class="tile sm">${INV(t.inv)?.icon||'📈'}</span><div class="mid"><div class="t1">${esc(INV(t.inv)?.name||'Investasi')}</div><div class="t2">Dikelola dari halaman Investasi</div></div>${I('fwd','sm')}</button>`
    : t.recv ? `<button class="row" data-act="recv" data-id="${t.recv}"><span class="tile sm">🤝</span><div class="mid"><div class="t1">Piutang ${esc(RECV(t.recv)?.person||'')}</div><div class="t2">Dikelola dari halaman Piutang</div></div>${I('fwd','sm')}</button>`
    : t.fundedFrom ? (()=>{ const s=S.txns.find(x=>x.id===t.fundedFrom); return s?`<div class="row"><span class="tile sm">${INV(s.inv)?.icon||'📈'}</span><div class="mid"><div class="t1">Didanai: ${esc(s.note)}</div><div class="t2">${fDate(s.date)} · ${rp(s.amount)}</div></div></div>`:''; })() : '';
  const kv=(k,v)=>`<div><div class="k">${k}</div><div class="v" style="font-size:15px">${v}</div></div>`;
  openSheet(TYPE_LABEL[t.type], `<div class="card"><div class="ovw"><div class="head">${txTile(t)}<div style="min-width:0"><div class="v ${['income','inv_sell','recv_pay'].includes(t.type)?'pos':''}">${M(['expense','inv_buy','recv_out'].includes(t.type)?-t.amount:t.amount, {sign:t.type!=='transfer'})}</div><div class="mut">${esc(t.note)}</div></div></div></div>
    <div class="sgrid">${kv('Tanggal',fDate(t.date))}${kv('Dompet',t.type==='transfer'?esc(W(t.wallet).short)+' → '+esc(W(t.to).short):esc(W(t.wallet).name))}${t.cat?kv('Kategori',cat(t.cat,t.type).icon+' '+esc(cat(t.cat,t.type).label)):''}${kv('Oleh',av(t.owner)+' '+esc(MEMBERS[t.owner]?.name||'—'))}${kv('Sumber input',t.source==='telegram'?'<span class="tag tg">VN</span> disetujui':'Aplikasi')}${t.recurring?kv('Rutin','Ya — '+esc(S.recurring.find(r=>r.id===t.recurring)?.name||'')):''}</div></div>
    ${link?`<div class="card list">${link}</div>`:''}
    ${editable?`<div class="btns"><button class="btn" data-act="txEdit" data-id="${t.id}">${I('edit','sm')} Ubah</button><button class="btn danger" data-act="txDelete" data-id="${t.id}">${I('trash','sm')} Hapus</button></div>`:'<p class="note">Transaksi aset & piutang diubah dari halamannya masing-masing agar saldo tetap konsisten.</p>'}`);
}

/* ---------- sheet: dompet ---------- */
function sheetWallet(id){
  const w=W(id), b=balances(null)[id];
  let i=0,o=0; S.txns.forEach(t=>{ if(monthOf(t.date)!==CUR_MONTH) return; effects(t).forEach(e=>{ if(e.w===id){ if(e.d>0) i+=e.d; else o-=e.d; } }); });
  const list=S.txns.filter(t=>t.wallet===id||t.to===id).slice(-60);
  openSheet(esc(w.name), `<div style="pointer-events:none">${wCard(w,b)}</div>
    <div class="stats"><div class="stat"><span class="k">Masuk ${fMon(CUR_MONTH)}</span><span class="v pos">${MC(i)}</span></div><div class="stat"><span class="k">Keluar ${fMon(CUR_MONTH)}</span><span class="v neg">${MC(o)}</span></div></div>
    ${w.archived?'':`<div class="btns"><button class="btn sm" data-act="add" data-type="expense" data-wallet="${id}">${I('arrout','sm')} Keluar</button><button class="btn sm" data-act="add" data-type="income" data-wallet="${id}">${I('arrin','sm')} Masuk</button><button class="btn sm" data-act="add" data-type="transfer" data-wallet="${id}">${I('swap','sm')} Transfer</button></div>`}
    <div class="callout"><span>Saldo awal <b class="m">${rp(w.opening)}</b> per ${fDate(w.openingDate)} + ${S.txns.filter(t=>t.wallet===id||t.to===id).length} transaksi = <b class="m">${rp(b)}</b></span></div>
    <div class="card list" style="overflow:hidden">${dayGroups(list)||'<div class="empty">Belum ada transaksi.</div>'}</div>
    <div class="btns"><button class="btn" data-act="walletForm" data-id="${id}">${I('edit','sm')} Ubah</button><button class="btn" data-act="walletArchive" data-id="${id}">${I('archive','sm')} ${w.archived?'Aktifkan lagi':'Arsipkan'}</button></div>`);
}
function sheetWalletForm(id){
  const w=id?W(id):{name:'',short:'',type:'bank',brand:'custom',owner:'both',opening:0};
  const brands=[['bca','BCA'],['mandiri','Mandiri'],['bri','BRI'],['bni','BNI'],['bsi','BSI'],['jago','Jago'],['gopay','GoPay'],['ewallet','E-wallet lain'],['cash','Tunai'],['custom','Lainnya']];
  openSheet(id?'Ubah dompet':'Dompet baru', `<form class="form" data-form="wallet"><input type="hidden" name="id" value="${id||''}">
    <div class="fld"><label for="w-n">Nama dompet</label><input class="inp" id="w-n" name="name" value="${esc(w.name)}" placeholder="mis. BCA Tahapan, GoPay, Dompet Tunai" required maxlength="40" autofocus></div>
    <div class="frow"><div class="fld"><label for="w-s">Nama pendek</label><input class="inp" id="w-s" name="short" value="${esc(w.short)}" placeholder="BCA" maxlength="10"></div>
    <div class="fld"><label for="w-t">Jenis</label><select class="inp" id="w-t" name="type">${[['bank','Rekening bank'],['ewallet','E-wallet'],['cash','Tunai'],['custom','Lainnya']].map(o=>`<option value="${o[0]}" ${w.type===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></div></div>
    <div class="fld"><span class="flbl">Tampilan kartu</span><div class="wsel" data-radio="brand">${brands.map(b=>`<button type="button" class="${w.brand===b[0]?'on':''}" data-val="${b[0]}"><span class="wdot w-${b[0]}"></span>${b[1]}</button>`).join('')}</div><input type="hidden" name="brand" value="${w.brand}"></div>
    <div class="fld"><label for="w-o">Pemilik</label><select class="inp" id="w-o" name="owner">${memberOpts(w.owner,true)}</select></div>
    ${id?`<p class="note">Saldo tidak bisa diketik ulang — catat transaksi atau transfer agar riwayat tetap konsisten.</p>`:`<div class="fld"><span class="flbl">Saldo awal</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" placeholder="0" data-money></div></div>
      <div class="fld"><label for="w-d">Saldo di atas per tanggal (awal hari)</label><input class="inp" id="w-d" type="date" name="openingDate" value="${LEDGER_START<=TODAY?LEDGER_START:TODAY}" min="${LEDGER_START}" max="${TODAY}"><span class="note">Pilih tanggal mulai pencatatan (mis. 1 ${MON[Number(CUR_MONTH.slice(5))-1]}), lalu catat transaksi sejak tanggal itu. Transaksi sebelum tanggal ini tidak bisa dicatat ke dompet ini.</span></div>`}
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}

/* ---------- sheet: investasi ---------- */
function sheetTrade(id, side){
  const inv=INV(id), h=holding(inv), dep=inv.type==='deposit';
  if(needWallet()) return;
  openSheet(`${side==='buy'?(dep?'Tambah':'Beli'):(dep?'Cairkan':'Jual')} · ${esc(inv.symbol||inv.name)}`, `<form class="form" data-form="trade"><input type="hidden" name="id" value="${id}"><input type="hidden" name="side" value="${side}">
    ${dep?`<div class="fld"><span class="flbl">Jumlah</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money value="${side==='sell'?idn(h.cost):''}" autofocus></div></div><div class="fld"><label for="tr-d">Tanggal</label><input class="inp" id="tr-d" type="date" name="date" value="${TODAY}" min="${LEDGER_START}" max="${TODAY}"></div>`
      :`<div class="frow"><div class="fld"><label for="tr-q">Jumlah (${esc(inv.unit)})</label><input class="inp" id="tr-q" name="qty" inputmode="decimal" placeholder="0" autofocus data-calc></div><div class="fld"><label for="tr-p">Harga per ${esc(inv.unit)}</label><input class="inp" id="tr-p" name="price" inputmode="numeric" value="${idn(h.price)}" data-money data-calc></div></div>
       <div class="frow"><div class="fld"><label for="tr-f">Biaya / fee</label><input class="inp" id="tr-f" name="fee" inputmode="numeric" placeholder="0" data-money data-calc></div><div class="fld"><label for="tr-d">Tanggal</label><input class="inp" id="tr-d" type="date" name="date" value="${TODAY}" min="${LEDGER_START}" max="${TODAY}"></div></div>`}
    <div class="fld"><span class="flbl">${side==='buy'?'Dibayar dari':'Uang masuk ke'}</span>${walletChips('wallet',defWallet())}</div>
    <div class="callout"><span id="trade-sum">${side==='sell'&&!dep?`Kamu punya ${idn(h.qty,h.qty%1?4:0)} ${esc(inv.unit)} · rata-rata beli ${rp(h.avg)}`:'Isi jumlah untuk melihat total.'}</span></div>
    <p class="note">${side==='buy'?'Kas berkurang, aset bertambah — tidak masuk laporan pengeluaran.':'Aset berkurang, kas bertambah — selisih dengan modal dicatat sebagai realized P/L, bukan pemasukan.'}</p>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetInvForm(){
  openSheet('Investasi baru', `<form class="form" data-form="inv">
    <div class="frow"><div class="fld"><label for="i-t">Jenis</label><select class="inp" id="i-t" name="type">${Object.entries(INV_TYPES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></div><div class="fld"><label for="i-s">Kode (saham)</label><input class="inp" id="i-s" name="symbol" placeholder="mis. BBCA" maxlength="8"></div></div>
    <div class="fld"><label for="i-n">Nama</label><input class="inp" id="i-n" name="name" required placeholder="mis. Emas Antam / Reksa Dana X / Deposito BRI" maxlength="40" autofocus></div>
    <div class="frow"><div class="fld"><label for="i-q">Jumlah</label><input class="inp" id="i-q" name="qty" inputmode="decimal" placeholder="gram / unit / lembar"></div><div class="fld"><label for="i-u">Satuan</label><input class="inp" id="i-u" name="unit" placeholder="gram, unit, lembar" maxlength="10"></div></div>
    <div class="frow"><div class="fld"><label for="i-p">Harga beli rata-rata per satuan</label><input class="inp" id="i-p" name="price" inputmode="numeric" data-money></div><div class="fld"><label for="i-c">Harga pasar saat ini</label><input class="inp" id="i-c" name="cur" inputmode="numeric" data-money placeholder="sama dgn beli"></div></div>
    <div class="frow"><div class="fld"><label for="i-f">Biaya / fee</label><input class="inp" id="i-f" name="fee" inputmode="numeric" data-money placeholder="0"></div><div class="fld"><label for="i-d">Tanggal beli</label><input class="inp" id="i-d" type="date" name="date" value="${TODAY}" max="${TODAY}"></div></div>
    <div class="fld"><label for="i-src">Sumber dana</label><select class="inp" id="i-src" name="src"><option value="initial">Sudah dimiliki sebelumnya (posisi awal, tidak memotong dompet)</option>${S.wallets.filter(w=>!w.archived).map(w=>`<option value="${w.id}">Dibayar dari ${esc(w.name)}</option>`).join('')}</select></div>
    <div class="fld"><label for="i-note">Keterangan (opsional)</label><input class="inp" id="i-note" name="note" maxlength="80" placeholder="mis. tenor 12 bln, 4,75% p.a."></div>
    <p class="note">Deposito: isi jumlah 1 dan harga = pokok. Bunganya dicatat sebagai pemasukan "Hasil Investasi".</p>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetPrice(id){
  const inv=INV(id), h=holding(inv);
  openSheet('Perbarui harga', `<form class="form" data-form="price"><input type="hidden" name="id" value="${id}">
    <div class="fld"><span class="flbl">Harga per ${esc(inv.unit)} — ${esc(inv.name)}</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money value="${idn(h.price)}" autofocus></div></div>
    <p class="note">Hanya mengubah nilai pasar (unrealized P/L) — tidak menyentuh kas, pemasukan, atau pengeluaran. Harga ini juga disimpan sebagai harga bulan ${fMonth(CUR_MONTH)} untuk grafik.</p>
    <button class="btn pri block" type="submit">Simpan harga</button></form>`);
}

/* ---------- sheet: piutang ---------- */
function sheetRecv(id){
  const r=RECV(id); if(!r) return; const i=recvInfo(r);
  const hist=S.txns.filter(t=>t.recv===id);
  openSheet('Piutang · '+esc(r.person), `<div class="card"><div class="ovw"><div class="mut" style="font-size:13px">Sisa piutang</div><div class="v">${M(i.out)}</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">${recvTag(i)}<span class="tag">jatuh tempo ${fDate(r.due)}</span></div><div class="bar" style="margin-top:12px"><i class="${i.status==='lunas'?'ok':''}" style="width:${i.paid/r.amount*100}%"></i></div></div>
    <div class="sgrid"><div><div class="k">Dipinjamkan</div><div class="v m">${rp(r.amount)}</div></div><div><div class="k">Sudah dibayar</div><div class="v m">${rp(i.paid)}</div></div><div style="grid-column:1/-1"><div class="k">Keterangan</div><div class="v" style="font-size:15px">${esc(r.note)||'—'}</div></div></div></div>
    <div class="flbl" style="padding:0 6px">Riwayat</div><div class="card list">${hist.map(txRow).join('')}</div>
    ${i.out>0?`<button class="btn pri block" data-act="recvPay" data-id="${id}">${I('arrin','sm')} Catat pembayaran</button>`:''}`);
}
function sheetRecvForm(){
  if(needWallet()) return;
  openSheet('Piutang baru', `<form class="form" data-form="recv">
    <div class="fld"><label for="r-p">Nama peminjam</label><input class="inp" id="r-p" name="person" required maxlength="40" autofocus></div>
    <div class="fld"><span class="flbl">Jumlah dipinjamkan</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money></div></div>
    <div class="frow"><div class="fld"><label for="r-d">Tanggal</label><input class="inp" id="r-d" type="date" name="date" value="${TODAY}" min="${LEDGER_START}" max="${TODAY}"></div><div class="fld"><label for="r-due">Jatuh tempo</label><input class="inp" id="r-due" type="date" name="due" value="${dAdd(TODAY,30)}"></div></div>
    <div class="fld"><span class="flbl">Uang keluar dari</span>${walletChips('wallet',defWallet())}</div>
    <div class="fld"><label for="r-n">Keterangan</label><input class="inp" id="r-n" name="note" maxlength="60"></div>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetRecvPay(id){
  const r=RECV(id), i=recvInfo(r);
  openSheet('Pembayaran · '+esc(r.person), `<form class="form" data-form="recvPay"><input type="hidden" name="id" value="${id}">
    <div class="fld"><span class="flbl">Jumlah diterima (maks ${rp(i.out)})</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money value="${idn(i.out)}" autofocus></div></div>
    <div class="frow"><div class="fld"><label for="rp-d">Tanggal</label><input class="inp" id="rp-d" type="date" name="date" value="${TODAY}" min="${r.date}" max="${TODAY}"></div></div>
    <div class="fld"><span class="flbl">Masuk ke dompet</span>${walletChips('wallet',S.txns.find(t=>t.recv===id)?.wallet||defWallet())}</div>
    <p class="note">Piutang berkurang dan saldo dompet bertambah dengan jumlah yang sama — bukan pemasukan.</p>
    <button class="btn pri block" type="submit">Simpan pembayaran</button></form>`);
}

/* ---------- sheet: budget, tujuan, kategori, berulang, drilldown ---------- */
function sheetBudget(){
  const m=UI.budgetMonth, bud=budgetFor(m), has=!!S.budgetOverride[m];
  openSheet('Budget '+fMonth(m), `<form class="form" data-form="budget">
    <div class="fld"><span class="flbl">Budget total bulanan</span><div class="amount-in"><span>Rp</span><input name="__total" inputmode="numeric" data-money value="${idn(bud.total)}"></div></div>
    <div class="card list">${S.expCats.map(c=>`<div class="row" style="padding:10px 14px">${tile(c,'sm')}<div class="mid"><div class="t1" style="font-size:14.5px">${esc(c.label)}</div></div><input class="inp" style="width:150px;height:42px;text-align:right" name="c_${c.id}" inputmode="numeric" data-money value="${idn(bud.cats[c.id]||0)}" aria-label="Budget ${esc(c.label)}"></div>`).join('')}</div>
    <div class="fld"><label for="b-scope">Berlaku untuk</label><select class="inp" id="b-scope" name="scope"><option value="default">Setiap bulan (budget berulang)</option><option value="month" ${has?'selected':''}>Hanya ${fMonth(m)}</option></select></div>
    <button class="btn pri block" type="submit">Simpan budget</button>
    ${has?`<button type="button" class="btn block" data-act="budgetClear">Kembalikan ${fMonth(m)} ke budget berulang</button>`:''}</form>`);
}
function sheetGoal(id){
  const g=S.goals.find(x=>x.id===id);
  openSheet(esc(g.name), `<div class="card pad" style="display:flex;flex-direction:column;gap:10px"><div style="display:flex;gap:14px;align-items:center"><span class="tile" style="width:58px;height:58px;font-size:28px;border-radius:18px">${g.icon}</span><div><div style="font-size:24px;font-weight:720" class="m num">${rp(g.saved)}</div><div class="mut">dari ${rp(g.target)} · ${idn(pct(g.saved,g.target))}%</div></div></div><div class="bar"><i style="width:${Math.min(pct(g.saved,g.target),100)}%"></i></div><p class="note">Kurang <b class="m">${rp(Math.max(0,g.target-g.saved))}</b>. Dengan setoran Rp 3 jt/bln ≈ ${Math.ceil(Math.max(0,g.target-g.saved)/3e6)} bulan lagi.</p></div>
    <form class="form" data-form="goalDep"><input type="hidden" name="id" value="${id}"><div class="fld"><span class="flbl">Tambah / kurangi alokasi</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money autofocus></div></div>
    <div class="btns"><button class="btn" type="submit" name="dir" value="-1">${I('minus','sm')} Kurangi</button><button class="btn pri" type="submit" name="dir" value="1">${I('plus','sm')} Tambah</button></div></form>
    <button class="btn danger block" data-act="goalDelete" data-id="${id}">${I('trash','sm')} Hapus tujuan</button>`);
}
function sheetGoalForm(){
  openSheet('Tujuan baru', `<form class="form" data-form="goal"><div class="frow" style="grid-template-columns:90px 1fr"><div class="fld"><label for="g-i">Ikon</label><input class="inp" id="g-i" name="icon" value="🎯" maxlength="4" style="text-align:center;font-size:22px"></div><div class="fld"><label for="g-n">Nama tujuan</label><input class="inp" id="g-n" name="name" required maxlength="50" autofocus></div></div>
    <div class="fld"><span class="flbl">Target</span><div class="amount-in"><span>Rp</span><input name="amount" inputmode="numeric" data-money></div></div>
    <div class="fld"><label for="g-s">Sudah terkumpul</label><input class="inp" id="g-s" name="saved" inputmode="numeric" data-money placeholder="0"></div>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetCatForm(){
  openSheet('Kategori baru', `<form class="form" data-form="cat"><div class="seg full" data-radio-seg="ctype"><button type="button" class="on" data-act="segPick" data-k="expense">Pengeluaran</button><button type="button" data-act="segPick" data-k="income">Pemasukan</button></div><input type="hidden" name="ctype" value="expense">
    <div class="frow" style="grid-template-columns:90px 1fr"><div class="fld"><label for="c-i">Ikon</label><input class="inp" id="c-i" name="icon" value="🏷️" maxlength="4" style="text-align:center;font-size:22px"></div><div class="fld"><label for="c-n">Nama</label><input class="inp" id="c-n" name="label" required maxlength="24" autofocus></div></div>
    <div class="fld"><label for="c-b">Budget bulanan (pengeluaran)</label><input class="inp" id="c-b" name="budget" inputmode="numeric" data-money placeholder="0"></div>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetRecurringForm(type='expense'){
  if(needWallet()) return;
  const cats = type==='income'?S.incCats:S.expCats;
  openSheet('Transaksi berulang', `<form class="form" data-form="recurring"><input type="hidden" name="type" value="${type}">
    <div class="seg full">${[['expense','Pengeluaran'],['income','Pemasukan'],['transfer','Transfer']].map(o=>`<button type="button" class="${type===o[0]?'on':''}" data-act="recType" data-k="${o[0]}">${o[1]}</button>`).join('')}</div>
    <div class="fld"><label for="rc-n">Nama</label><input class="inp" id="rc-n" name="name" required maxlength="40" placeholder="mis. Gaji, Sewa kontrakan, Internet" autofocus></div>
    <div class="frow"><div class="fld"><span class="flbl">Jumlah</span><input class="inp" name="amount" inputmode="numeric" data-money placeholder="0"></div><div class="fld"><label for="rc-d">Tiap tanggal</label><input class="inp" id="rc-d" name="day" type="number" min="1" max="31" value="1"></div></div>
    ${type==='transfer'?`<div class="fld"><span class="flbl">Dari</span>${walletChips('wallet',defWallet())}</div><div class="fld"><span class="flbl">Ke</span>${walletChips('to',(S.wallets.find(w=>!w.archived&&w.id!==defWallet())||{}).id)}</div>`
      :`<div class="fld"><label for="rc-c">${type==='income'?'Sumber':'Kategori'}</label><select class="inp" id="rc-c" name="cat">${cats.map(c=>`<option value="${c.id}">${c.icon} ${esc(c.label)}</option>`).join('')}</select></div><div class="fld"><span class="flbl">Dompet</span>${walletChips('wallet',defWallet())}</div>`}
    <div class="fld"><label for="rc-o">Atas nama</label><select class="inp" id="rc-o" name="owner">${memberOpts(S.user)}</select></div>
    <button class="btn pri block" type="submit">Simpan</button></form>`);
}
function sheetDrill(cid, m, kind){
  m=m||CUR_MONTH; const isInc=kind==='income'; const c=cat(cid,isInc?'income':'expense');
  const list=S.txns.filter(t=>t.cat===cid && monthOf(t.date)===m && t.type===(isInc?'income':'expense'));
  const tot=list.reduce((s,t)=>s+t.amount,0), b=isInc?0:budgetFor(m).cats[cid]||0;
  openSheet(c.icon+' '+esc(c.label), `<div class="stats"><div class="stat"><span class="k">${fMonth(m)}${isPartial(m)?' (1–'+TODAY_DAY+')':''}</span><span class="v">${MC(tot)}</span></div>${isInc?`<div class="stat"><span class="k">Transaksi</span><span class="v">${list.length}</span></div>`:`<div class="stat"><span class="k">Budget</span><span class="v ${tot>b?'neg':''}">${MC(b)}</span><span class="d mut">${tot>b?'lewat '+rpc(tot-b):'sisa '+rpc(b-tot)}</span></div>`}</div>
    <div class="card list" style="overflow:hidden">${dayGroups(list)||'<div class="empty">Tidak ada transaksi.</div>'}</div>`);
}

/* ---------- aksi klik ---------- */
const ACT = {
  go: d => go(d.v, d.p),
  add: d => sheetAdd({type:d.type||'expense', wallet:d.wallet||defWallet()}),
  tx: d => sheetTx(d.id), txEdit: d => sheetAdd({id:d.id}),
  txDelete: d => { const t=S.txns.find(x=>x.id===d.id); confirmIn(`Hapus <b>${esc(t.note)}</b> (${rp(t.amount)})? Saldo ${esc(W(t.wallet).short)} akan dihitung ulang.`,'Hapus',()=>run(()=>DB.deleteTxn(d.id),'Transaksi dihapus'),()=>sheetTx(d.id)); },
  txType: d => { const f=document.querySelector('[data-form=tx]'); const fd=formData(f); sheetAdd({type:d.k, amount:parseAmt(fd.amount), date:fd.date, note:fd.note, owner:fd.owner, wallet:fd.wallet, draft:fd.draft}); },
  recType: d => sheetRecurringForm(d.k),
  qamt: d => { const i=document.querySelector('.sheet [data-money][name=amount]'); i.value=idn(parseAmt(i.value)+Number(d.v)); },
  closeSheet: ()=>closeSheet(),
  confirmYes: ()=>CONFIRM.yes&&CONFIRM.yes(), confirmNo: ()=>{ if(CONFIRM.no) CONFIRM.no(); else closeSheet(); },
  collapse: (d,el) => { UI.collapsed[d.d]=!UI.collapsed[d.d]; if(el.closest('.sheet')){ el.classList.toggle('closed',UI.collapsed[d.d]); el.parentElement.querySelectorAll('.row').forEach(r=>r.hidden=UI.collapsed[d.d]); return; } renderView(true); },
  mask: ()=>{ UI.masked=!UI.masked; setPref('masked',UI.masked?'1':'0'); applyTheme(); renderTop(); if(UI.view==='settings') renderView(true); },
  theme: d => { UI.theme=d.k; setPref('theme',d.k); applyTheme(); renderView(true); },
  flowRange: d => { UI.flowRange=+d.k; renderView(true); }, catMode: d => { UI.catMode=d.k; renderView(true); },
  drill: d => sheetDrill(d.c, d.m, d.kind), flowcat: d => sheetDrill(d.c, CUR_MONTH, 'income'),
  sort: d => { if(UI.histSort.k===d.k) UI.histSort.dir*=-1; else UI.histSort={k:d.k,dir:d.k==='amount'||d.k==='date'?-1:1}; renderView(true); },
  wallet: d => sheetWallet(d.id), walletForm: d => sheetWalletForm(d.id),
  walletArchive: d => { const w=W(d.id); const b=balances(null)[d.id];
    if(!w.archived && Math.abs(b)>0){ confirmIn(`Arsipkan <b>${esc(w.name)}</b>? Saldonya masih <b>${rp(b)}</b> dan tetap dihitung di kekayaan. Sebaiknya transfer dulu ke dompet lain.`,'Tetap arsipkan',()=>run(()=>DB.archiveWallet(d.id,true),'Dompet diarsipkan'),()=>sheetWallet(d.id)); return; }
    run(()=>DB.archiveWallet(d.id,!w.archived), w.archived?'Dompet aktif lagi':'Dompet diarsipkan'); },
  invMode: d => { UI.invMode=d.k; renderView(true); }, invFilter: d => { UI.invFilter=d.k; renderView(true); },
  trade: d => sheetTrade(d.id,d.side), invForm: ()=>sheetInvForm(), priceForm: d => sheetPrice(d.id),
  recv: d => sheetRecv(d.id), recvForm: ()=>sheetRecvForm(), recvPay: d => sheetRecvPay(d.id),
  bMonth: d => { const ms=ledgerMonths(); const i=ms.indexOf(UI.budgetMonth)+Number(d.d); if(ms[i]){ UI.budgetMonth=ms[i]; renderView(true); } },
  budgetForm: ()=>sheetBudget(), budgetClear: ()=>run(()=>DB.clearBudgetMonth(UI.budgetMonth),'Kembali ke budget berulang'),
  goal: d => sheetGoal(d.id), goalForm: ()=>sheetGoalForm(),
  goalDelete: d => { const g=S.goals.find(x=>x.id===d.id); confirmIn(`Hapus tujuan <b>${esc(g.name)}</b>? Uangnya tidak ke mana-mana — hanya alokasinya yang hilang.`,'Hapus',()=>run(()=>DB.deleteGoal(d.id),'Tujuan dihapus'),()=>sheetGoal(d.id)); },
  catForm: ()=>sheetCatForm(), recurringForm: ()=>sheetRecurringForm(),
  segPick: (d,el) => { const seg=el.parentElement; seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===el)); el.closest('form').querySelector(`[name=${seg.dataset.radioSeg}]`).value=d.k; },
  toggleRecurring: d => { const r=S.recurring.find(x=>x.id===d.id); run(()=>DB.toggleRecurring(d.id,!r.active)); },
  postRecurring: d => { const r=S.recurring.find(x=>x.id===d.id); const date=CUR_MONTH+'-'+String(Math.min(r.day,TODAY_DAY)).padStart(2,'0');
    run(()=>DB.addTxn({ date, type:r.type, amount:r.amount, wallet:r.wallet, to:r.to, cat:r.cat, note:r.name, owner:r.owner||S.user, recurring:r.id }), r.name+' tercatat'); },
  removeInvite: d => { const m=MEMBERS[d.id]; confirmIn(`Batalkan izin untuk <b>${esc(m.email)}</b>?`,'Batalkan',()=>run(()=>DB.removeInvite(d.id),'Izin dibatalkan')); },
  logout: async ()=>{ await sb.auth.signOut(); S=null; UI.view='home'; renderLogin(); },
  authMode: d => { UI.authMode=d.k; renderLogin(); },
  // voice note
  play: d => { const wv=document.getElementById('wave-'+d.id); if(!wv) return; const p=S.pending.find(x=>x.id===d.id); wv.classList.add('playing'); wv.querySelectorAll('i').forEach((b,i)=>b.style.animationDelay=(i%7)*0.08+'s'); clearTimeout(wv._t); wv._t=setTimeout(()=>wv.classList.remove('playing'),(p?.dur||4)*1000); },
  vnApprove: d => approveDraft(d.id), vnReject: d => run(()=>DB.rejectPending(d.id),'Draft ditolak — tidak dicatat'),
  vnEdit: d => { const p=S.pending.find(x=>x.id===d.id); if(!p) return; sheetAdd({...p.parsed, draft:p.id}); },
  inboxTab: d => { UI.inboxTab=d.k; renderView(true); }, simAs: d => { UI.simAs=d.k; const ta=document.querySelector('[data-form=simVN] textarea'); UI.simText=ta?ta.value:''; renderView(true); },
  simEx: d => { const ta=document.querySelector('[data-form=simVN] textarea'); ta.value=d.t; UI.simText=d.t; ta.focus(); },
};

function validDraft(x){
  if(!x.amount) return 'Jumlah belum terbaca — tekan Ubah dulu.';
  if(!x.wallet || !S.wallets.find(w=>w.id===x.wallet)) return 'Dompet belum dipilih — tekan Ubah dulu.';
  if(x.type==='transfer' && (!x.to || x.to===x.wallet)) return 'Dompet tujuan transfer belum benar — tekan Ubah dulu.';
  if(x.type!=='transfer' && !x.cat) return 'Kategori belum dipilih — tekan Ubah dulu.';
  return null;
}
function approveDraft(id, override){
  const p=S.pending.find(x=>x.id===id); if(!p) return;
  const x = { ...p.parsed, ...(override||{}) }; x.owner = x.owner || p.owner;
  const err = validDraft(x); if(err){ toast(err,true); return; }
  run(()=>DB.approvePending(id, x), 'Disetujui & tercatat');
}
function newDraft(text, owner){
  text=String(text||'').trim(); if(!text) return;
  const parsed=parseUtterance(text, owner);
  const dur=Math.max(3,Math.min(15,Math.round(text.split(/\s+/).length*0.55)));
  UI.simText='';
  run(()=>DB.addPending(text, owner, parsed, dur), 'Draft masuk antrean review');
}
function txValid(f, o){
  if(!o.amount) return formErr(f,'Masukkan jumlah.');
  if(!o.wallet) return formErr(f,'Pilih dompet.');
  if(o.type==='transfer' && (!o.to || o.to===o.wallet)) return formErr(f,'Dompet asal dan tujuan harus berbeda.');
  if(o.type!=='transfer' && !o.cat) return formErr(f,'Pilih kategori.');
  if(o.date<LEDGER_START||o.date>TODAY) return formErr(f,'Tanggal di luar periode pencatatan ('+fDate(LEDGER_START)+' – hari ini).');
  const w=W(o.wallet); if(o.date<w.openingDate) return formErr(f,`Tanggal sebelum saldo awal ${w.short} (${fDate(w.openingDate)}).`);
  if(o.type==='transfer'){ const w2=W(o.to); if(o.date<w2.openingDate) return formErr(f,`Tanggal sebelum saldo awal ${w2.short} (${fDate(w2.openingDate)}).`); }
  return true;
}

/* ---------- submit form ---------- */
const FORMS = {
  auth: async (f,fd) => {
    const email=fd.email.trim().toLowerCase(), pass=fd.pass; const err=document.getElementById('lg-err');
    const btn=f.querySelector('[type=submit]'); btn.disabled=true; err.textContent='';
    try{
      if(UI.authMode==='signup'){
        const { data, error } = await sb.auth.signUp({ email, password:pass });
        if(error) throw error;
        if(!data.session){ const r = await sb.auth.signInWithPassword({ email, password:pass }); if(r.error) throw r.error; }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password:pass }); if(error) throw error;
      }
      await start();
    }catch(e){ err.textContent=errMsg(e); btn.disabled=false; }
  },
  tx: (f,fd) => {
    const o={ type:fd.type, amount:parseAmt(fd.amount), wallet:fd.wallet, to:fd.type==='transfer'?fd.to:null, cat:fd.type==='transfer'?null:fd.cat, date:fd.date, owner:fd.owner, fundedFrom:fd.fundedFrom||null };
    if(txValid(f,o)!==true) return;
    o.note = fd.note.trim() || (o.type==='transfer'?'Transfer ke '+W(o.to).short:cat(o.cat,o.type).label);
    if(fd.draft) return approveDraft(fd.draft, o);
    if(fd.id){ const old=S.txns.find(x=>x.id===fd.id); return run(()=>DB.updateTxn(fd.id,{...o, source:old.source, recurring:old.recurring}),'Perubahan disimpan'); }
    run(()=>DB.addTxn(o), `${TYPE_LABEL[o.type]} ${rp(o.amount)} tercatat`);
  },
  wallet: (f,fd) => { const name=fd.name.trim(); if(!name) return formErr(f,'Isi nama dompet.');
    const w={ name, short:(fd.short||name).trim().slice(0,10), type:fd.type, brand:fd.brand, owner:fd.owner };
    if(fd.id) return run(()=>DB.updateWallet(fd.id,w),'Dompet diperbarui');
    if(!fd.openingDate || fd.openingDate<LEDGER_START || fd.openingDate>TODAY) return formErr(f,'Tanggal saldo awal tidak valid.');
    run(()=>DB.addWallet({ ...w, opening:parseAmt(fd.amount), openingDate:fd.openingDate }),'Dompet ditambahkan'); },
  trade: (f,fd) => { const inv=INV(fd.id), h=holding(inv), dep=inv.type==='deposit';
    let qty, price, fee=parseAmt(fd.fee);
    if(dep){ const amt=parseAmt(fd.amount); if(!amt) return formErr(f,'Masukkan jumlah.'); if(fd.side==='sell' && amt>h.cost+0.5) return formErr(f,'Melebihi pokok deposito.');
      if(fd.side==='sell'){ qty=+(amt/h.cost*h.qty).toFixed(6); price=h.cost/h.qty; } else { qty=1; price=amt; } }
    else { qty=parseFloat(String(fd.qty).replace(',','.')); price=parseAmt(fd.price); if(!(qty>0)||!price) return formErr(f,'Isi jumlah dan harga.'); if(fd.side==='sell' && qty>h.qty+1e-9) return formErr(f,`Maksimal ${idn(h.qty,h.qty%1?4:0)} ${inv.unit}.`); }
    if(!fd.wallet) return formErr(f,'Pilih dompet.');
    const date=fd.date||TODAY; if(date<W(fd.wallet).openingDate) return formErr(f,'Tanggal sebelum saldo awal dompet.');
    const note=`${fd.side==='buy'?(dep?'Tambah':'Beli'):(dep?'Cairkan':'Jual')} ${inv.symbol||inv.name}${dep?'':' '+idn(qty,qty%1?4:0)+' '+inv.unit}`;
    run(()=>DB.trade({ inv:inv.id, side:fd.side, date, qty, price, fee, wallet:fd.wallet, note }), fd.side==='buy'?'Pembelian tercatat':'Penjualan tercatat'); },
  inv: (f,fd) => { const qty=parseFloat(String(fd.qty).replace(',','.')), price=parseAmt(fd.price); if(!fd.name.trim()||!(qty>0)||!price) return formErr(f,'Isi nama, jumlah, dan harga beli.');
    const wallet = fd.src==='initial' ? null : fd.src;
    if(wallet && (fd.date<LEDGER_START || fd.date<W(wallet).openingDate)) return formErr(f,'Pembelian dari dompet harus bertanggal setelah saldo awal dompet. Kalau sudah lama dimiliki, pilih "Sudah dimiliki sebelumnya".');
    const icons={gold:'🥇',fund:'📊',stock:'📈',deposit:'🏦',other:'💎'};
    run(()=>DB.createInvestment({ type:fd.type, name:fd.name.trim(), symbol:fd.symbol.trim().toUpperCase(), unit:fd.unit.trim()||(fd.type==='gold'?'gram':fd.type==='stock'?'lembar':'unit'), icon:icons[fd.type],
      note:fd.note.trim(), qty, price, fee:parseAmt(fd.fee), date:fd.date, current:fd.type==='deposit'?null:(parseAmt(fd.cur)||price), wallet }),'Investasi ditambahkan'); },
  price: (f,fd) => { const p=parseAmt(fd.amount); if(!p) return formErr(f,'Masukkan harga.'); run(()=>DB.setPrice(fd.id,p),'Harga diperbarui'); },
  recv: (f,fd) => { const amount=parseAmt(fd.amount); if(!fd.person.trim()||!amount) return formErr(f,'Isi nama dan jumlah.'); if(fd.due<fd.date) return formErr(f,'Jatuh tempo tidak boleh sebelum tanggal pinjam.'); if(!fd.wallet) return formErr(f,'Pilih dompet.');
    if(fd.date<W(fd.wallet).openingDate) return formErr(f,'Tanggal sebelum saldo awal dompet.');
    run(()=>DB.createReceivable({ person:fd.person.trim(), note:fd.note.trim(), amount, date:fd.date, due:fd.due, wallet:fd.wallet }),'Piutang dicatat'); },
  recvPay: (f,fd) => { const r=RECV(fd.id), i=recvInfo(r), amount=parseAmt(fd.amount); if(!amount) return formErr(f,'Masukkan jumlah.'); if(amount>i.out) return formErr(f,'Melebihi sisa piutang '+rp(i.out)+'.'); if(!fd.wallet) return formErr(f,'Pilih dompet.');
    run(()=>DB.addTxn({ date:fd.date, type:'recv_pay', amount, wallet:fd.wallet, recv:r.id, note:(amount===i.out?'Pelunasan dari ':'Cicilan dari ')+r.person }), amount===i.out?'Piutang lunas 🎉':'Pembayaran dicatat'); },
  budget: (f,fd) => { const m=UI.budgetMonth; const total=parseAmt(fd.__total); if(!total) return formErr(f,'Isi budget total.');
    const cats={}; S.expCats.forEach(c=>cats[c.id]=parseAmt(fd['c_'+c.id]));
    if(fd.scope==='default') run(async()=>{ await DB.setBudgetDefault(total,cats); if(S.budgetOverride[m]) await DB.clearBudgetMonth(m); },'Budget disimpan');
    else run(()=>DB.setBudgetMonth(m,total,cats),'Budget '+fMonth(m)+' disimpan'); },
  goalDep: (f,fd,sub) => { const g=S.goals.find(x=>x.id===fd.id); const a=parseAmt(fd.amount); if(!a) return formErr(f,'Masukkan jumlah.'); run(()=>DB.setGoalSaved(g.id, Math.max(0,g.saved+a*Number(sub?.value||1))),'Alokasi diperbarui'); },
  goal: (f,fd) => { const t=parseAmt(fd.amount); if(!fd.name.trim()||!t) return formErr(f,'Isi nama dan target.'); run(()=>DB.addGoal({ icon:fd.icon||'🎯', name:fd.name.trim(), target:t, saved:parseAmt(fd.saved) }),'Tujuan ditambahkan'); },
  cat: (f,fd) => { if(!fd.label.trim()) return formErr(f,'Isi nama kategori.'); run(()=>DB.addCategory({ kind:fd.ctype, label:fd.label.trim(), icon:fd.icon||'🏷️', budget:fd.ctype==='expense'?parseAmt(fd.budget):0 }),'Kategori ditambahkan'); },
  recurring: (f,fd) => { const amount=parseAmt(fd.amount), day=Number(fd.day); if(!fd.name.trim()||!amount) return formErr(f,'Isi nama dan jumlah.'); if(!(day>=1&&day<=31)) return formErr(f,'Tanggal 1–31.');
    if(!fd.wallet) return formErr(f,'Pilih dompet.'); if(fd.type==='transfer' && (!fd.to||fd.to===fd.wallet)) return formErr(f,'Dompet asal dan tujuan harus berbeda.');
    run(()=>DB.addRecurring({ name:fd.name.trim(), type:fd.type, amount, wallet:fd.wallet, to:fd.to||null, cat:fd.cat||null, day, owner:fd.owner }),'Transaksi berulang ditambahkan'); },
  invite: (f,fd) => { const email=fd.email.trim().toLowerCase(); if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return formErr(f,'Email tidak valid.'); if(Object.values(MEMBERS).some(m=>m.email.toLowerCase()===email)) return formErr(f,'Email ini sudah terdaftar.');
    run(()=>DB.inviteMember(email, fd.name.trim()||email.split('@')[0]),'Email diizinkan — minta ia daftar di website ini'); },
  defWallet: (f,fd) => run(()=>DB.updateMember(S.user,{ default_wallet_id:fd.w }),'Dompet default disimpan'),
  simVN: (f,fd) => newDraft(fd.t, UI.simAs||S.user),
  tgSend: (f,fd) => newDraft(fd.t, S.user),
};

/* ---------- event delegation ---------- */
document.addEventListener('click', e=>{
  const radio = e.target.closest('[data-radio] [data-val]');
  if(radio){ const wrap=radio.closest('[data-radio]'); wrap.querySelectorAll('[data-val]').forEach(b=>b.classList.toggle('on',b===radio)); const inp=wrap.parentElement.querySelector(`input[name="${wrap.dataset.radio}"]`); if(inp) inp.value=radio.dataset.val; return; }
  const a = e.target.closest('[data-act]'); if(!a) return;
  const fn = ACT[a.dataset.act]; if(fn){ e.preventDefault(); fn(a.dataset, a); }
});
document.addEventListener('submit', e=>{ const f=e.target.closest('[data-form]'); if(!f) return; e.preventDefault(); const fn=FORMS[f.dataset.form]; if(fn) fn(f, formData(f), e.submitter); });
document.addEventListener('input', e=>{
  const t=e.target;
  if(t.matches('[data-money]')){ const pos=t.value.length-t.selectionStart; fmtInput(t); try{ t.setSelectionRange(t.value.length-pos,t.value.length-pos); }catch(_){} }
  if(t.matches('[data-calc]')){ const f=t.closest('form'); const fd=formData(f); const inv=INV(fd.id); const h=holding(inv); const q=parseFloat(String(fd.qty).replace(',','.'))||0, p=parseAmt(fd.price), fee=parseAmt(fd.fee); const box=document.getElementById('trade-sum');
    if(box && q){ const total=fd.side==='buy'?q*p+fee:q*p-fee; box.innerHTML = fd.side==='buy' ? `Total dibayar <b class="m">${rp(total)}</b>` : `Diterima <b class="m">${rp(total)}</b> · estimasi realized P/L <b class="${total-h.avg*q>=0?'pos':'neg'}">${rp(total-h.avg*q,{sign:true})}</b>`; } }
  if(t.matches('[data-filter=q]')){ UI.hf.q=t.value; clearTimeout(t._d); t._d=setTimeout(()=>{ const pos=t.selectionStart; renderView(true); const ni=document.querySelector('[data-filter=q]'); if(ni){ ni.focus(); ni.setSelectionRange(pos,pos);} },220); }
});
document.addEventListener('change', e=>{
  const t=e.target;
  if(t.matches('[data-autosubmit]')){ t.form.requestSubmit(); return; }
  if(!t.matches('[data-filter]') || t.dataset.filter==='q') return;
  const F = UI.view==='income'?UI.ff.income : UI.view==='expense'?UI.ff.expense : UI.hf;
  F[t.dataset.filter]=t.value; if(t.dataset.filter==='period' && t.value==='custom' && !F.from){ F.from=CUR_MONTH+'-01'; F.to=TODAY; }
  renderView(true);
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeSheet(); });
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible' && S && S.user && !UI.busy && !document.getElementById('sheet').classList.contains('on')) reload(); });

/* ---------- boot ---------- */
async function start(){
  renderLoading();
  try{ await loadAll(); }
  catch(e){ console.error(e); renderLogin('Gagal memuat data: '+errMsg(e)); return; }
  if(!S){ renderLogin(); return; }
  if(S.noMember){ renderNoMember(); return; }
  UI.simAs = S.user;
  renderShell(); go(UI.view||'home');
}
async function boot(){
  applyTheme();
  document.body.insertAdjacentHTML('beforeend','<div class="scrim" id="scrim" hidden data-act="closeSheet"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true"></div><div class="toast" id="toast" role="status"></div>');
  const { data:{ session } } = await sb.auth.getSession();
  if(session) start(); else renderLogin();
}
boot();
