/* =========================================================
   PARSER VOICE NOTE (rule-based)
   Di versi final: Telegram VN → speech-to-text (mis. Whisper) → teks →
   parser ini (atau LLM) → draft di tabel pending_transactions → review → approve.
   Di prototipe, transkrip diketik/diambil dari contoh.
   ========================================================= */
const NUM_WORDS = { nol:0, satu:1, dua:2, tiga:3, empat:4, lima:5, enam:6, tujuh:7, delapan:8, sembilan:9 };
const SCALE = { ribu:1e3, rb:1e3, juta:1e6, jt:1e6, miliar:1e9, milyar:1e9 };
const NUM_TOKENS = new Set([...Object.keys(NUM_WORDS),'sepuluh','sebelas','belas','puluh','ratus','seratus','seribu','sejuta','setengah',...Object.keys(SCALE)]);

function wordsToNumber(tokens){
  let total=0, cur=0, last=0, lastScale=0;
  for(let i=0;i<tokens.length;i++){
    const t=tokens[i];
    if(t in NUM_WORDS){ last = NUM_WORDS[t]; }
    else if(t==='sepuluh'){ cur+=10; }
    else if(t==='sebelas'){ cur+=11; }
    else if(t==='belas'){ cur+=last+10; last=0; }
    else if(t==='puluh'){ cur+=last*10; last=0; }
    else if(t==='seratus'){ cur+=100; }
    else if(t==='ratus'){ cur+=last*100; last=0; }
    else if(t==='seribu'){ total+=1000; lastScale=1000; }
    else if(t==='sejuta'){ total+=1e6; lastScale=1e6; }
    else if(t==='setengah'){ if(lastScale && !cur && !last){ total+=lastScale/2; } else { last=0.5; } }
    else if(SCALE[t]){ const v=(cur+last)||1; total+=v*SCALE[t]; lastScale=SCALE[t]; cur=0; last=0; }
  }
  return Math.round(total+cur+last);
}

function findAmount(text){
  const s = text.toLowerCase();
  // 1) angka: "Rp 25.000", "50rb", "1,5 juta", "50k"
  const re = /(?:rp\.?\s*)?(\d{1,3}(?:[.,]\d{3})+|\d+(?:[.,]\d+)?)\s*(ribu|rb|k|juta|jt|miliar|m)?\b/g;
  let m, best=null;
  while((m=re.exec(s))){
    let raw=m[1], unit=m[2], v;
    const scale = unit ? ({ribu:1e3,rb:1e3,k:1e3,juta:1e6,jt:1e6,miliar:1e9,m:1e9})[unit] : 1;
    if(unit && /^\d+[.,]\d{1,2}$/.test(raw)) v = parseFloat(raw.replace(',','.'))*scale;
    else v = parseInt(raw.replace(/[.,]/g,''),10)*scale;
    if(/^(tanggal|tgl)$/.test(s.slice(Math.max(0,m.index-8),m.index).trim().split(' ').pop())) continue;
    if(v>=500 && (!best || v>best.v)) best={v, span:m[0]};
  }
  if(best) return { value:Math.round(best.v), span:best.span, conf:'high' };
  // 2) kata: "seratus delapan puluh tujuh ribu lima ratus"
  const toks = s.replace(/[^a-z\s]/g,' ').split(/\s+/).filter(Boolean);
  let i=0, bestRun=null;
  while(i<toks.length){
    if(NUM_TOKENS.has(toks[i])){ let j=i; while(j<toks.length && NUM_TOKENS.has(toks[j])) j++; const run=toks.slice(i,j); const v=wordsToNumber(run); if(v>=500 && (!bestRun||v>bestRun.v)) bestRun={v,span:run.join(' ')}; i=j; }
    else i++;
  }
  if(bestRun) return { value:bestRun.v, span:bestRun.span, conf:'high' };
  return { value:0, span:'', conf:'low' };
}

const WALLET_ALIASES = { bca:['bca','m-banking bca','mybca'], mandiri:['mandiri','livin'], bri:['bri','brimo','simpedes'], jago:['jago'], gopay:['gopay','go pay'], tunai:['cash','tunai','uang tunai','kes'] };
const CAT_KEYWORDS = {
  dapur:['superindo','indomaret','alfamart','pasar','sayur','beras','galon','gas elpiji','minyak goreng','telur','yogya','borma','dapur'],
  makan:['makan','kopi','ngopi','bakso','nasi','gofood','grabfood','jajan','sarapan','martabak','warteg','padang','minum','seblak','mie'],
  transport:['bensin','pertalite','pertamax','parkir','tol','ojol','ojek','servis','cuci mobil','cuci motor','ban'],
  tagihan:['listrik','token','pln','internet','indihome','wifi','pdam','pulsa','paket data','bpjs'],
  anak:['susu','popok','pampers','diaper','mainan','daycare','anak'],
  kesehatan:['obat','apotek','dokter','klinik','vitamin','rumah sakit','vaksin'],
  hiburan:['nonton','bioskop','netflix','spotify','game','liburan','jalan-jalan'],
  pribadi:['shopee','tokopedia','baju','sepatu','skincare','potong rambut','kaos'],
  sosial:['kondangan','sumbangan','zakat','sedekah','infaq','orang tua','ortu','arisan','hadiah','kado','ulang tahun'],
  rumah:['sewa','kontrakan','kos','perabot','renovasi'],
};
const INC_KEYWORDS = { gaji:['gaji','gajian','thr','bonus'], freelance:['freelance','proyek','project','klien','konsultasi'], usaha:['jualan','usaha','omzet','dagangan'], hasilinv:['bunga','dividen','kupon'] };
const INCOME_HINT = ['gaji','gajian','terima','nerima','dapet','dapat','masuk','transferan','bonus','thr','freelance','cashback','bunga','dividen','jualan','omzet'];
const TRANSFER_HINT = ['top up','topup','isi saldo','tarik tunai','pindahin','pindah ke','pindahkan','transfer ke','setor ke'];

const has = (s,k) => new RegExp('(^|[^a-z])'+k.replace(/[-]/g,'\\-')+'($|[^a-z])').test(s);
const escRe = x => x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function findWallets(s){
  const hits=[];
  S.wallets.filter(w=>!w.archived).forEach(w=>{
    const al=new Set([w.short.toLowerCase(), ...(WALLET_ALIASES[w.brand]||[])]);
    if(w.type==='cash') WALLET_ALIASES.tunai.forEach(a=>al.add(a));
    al.forEach(a=>{ if(!a) return; const re=new RegExp('(^|[^a-z0-9])('+escRe(a)+')(?=$|[^a-z0-9])','g'); let m; while((m=re.exec(s))) hits.push({id:w.id, idx:m.index+m[1].length, len:a.length, alias:a}); });
  });
  hits.sort((a,b)=>a.idx-b.idx);
  const uniq=[]; hits.forEach(h=>{ if(!uniq.find(u=>u.id===h.id)) uniq.push(h); });
  return uniq;
}

function parseUtterance(text, owner){
  const s = ' '+text.toLowerCase().replace(/\s+/g,' ')+' ';
  const amt = findAmount(text);
  const wallets = findWallets(s);
  let type = 'expense';
  if(TRANSFER_HINT.some(k=>has(s,k))) type='transfer';
  else if(INCOME_HINT.some(k=>has(s,k))) type='income';
  // kategori
  let catId=null, catConf='low', kw=null;
  if(type==='expense'){ for(const [c,arr] of Object.entries(CAT_KEYWORDS)){ const k=arr.find(a=>has(s,a)); if(k){ catId=c; kw=k; catConf='high'; break; } } if(!catId && has(s,'belanja')){ catId='dapur'; catConf='low'; } if(!catId) catId='lainnya'; }
  if(type==='income'){ for(const [c,arr] of Object.entries(INC_KEYWORDS)){ const k=arr.find(a=>has(s,a)); if(k){ catId=c; kw=k; catConf='high'; break; } } if(!catId) catId='lainmasuk'; }
  // dompet
  let wallet=null, to=null, wConf='low';
  const firstW = (S.wallets.find(w=>!w.archived)||{}).id || null;
  const def = MEMBERS[owner]?.defWallet || firstW;
  const cashW = (S.wallets.find(w=>w.type==='cash' && !w.archived)||{}).id || null;
  if(type==='transfer'){
    const keIdx = s.search(/\b(ke|top ?up|isi saldo)\b/);
    const after = wallets.filter(w=>w.idx>keIdx), before = wallets.filter(w=>w.idx<keIdx);
    if(/tarik tunai/.test(s)){ to=cashW; wallet=(wallets.find(w=>w.id!==cashW)||{}).id||def; }
    else { to=(after[0]||{}).id || null; wallet=(before[0]||after.find(w=>w.id!==to)||{}).id || def; }
    wConf = to && wallet ? 'high' : 'low';
    if(to===wallet) to=null;
  } else if(wallets.length){ wallet=wallets[0].id; wConf='high'; }
  else { wallet=def; }
  // tanggal
  let date=TODAY, dConf='high';
  if(/\bkemarin\b/.test(s)) date=dAdd(TODAY,-1);
  else if(/\b(kemarin lusa|dua hari lalu)\b/.test(s)) date=dAdd(TODAY,-2);
  else { const tm = s.match(/\b(?:tanggal|tgl)\s+(\d{1,2})\b/); if(tm){ const d=Math.min(Number(tm[1]),TODAY_DAY); date=CUR_MONTH+'-'+String(d).padStart(2,'0'); } }
  // catatan: buang angka, dompet, kata pengisi
  let note = text;
  if(amt.span) note = note.replace(new RegExp(amt.span.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),' ');
  note = note.replace(/\b(rp\.?|rupiah)\b/gi,' ');
  wallets.forEach(w=> note = note.replace(new RegExp('\\b(pakai|pake|via|lewat|dari|ke|masuk|bayar pakai|bayar pake|bayar)?\\s*'+w.alias+'\\b','i'),' '));
  note = note.replace(/\b(tadi|barusan|kemarin|hari ini|aku|saya|udah|sudah|nih|ya|dong|terus|trus|bayar|cash|tunai)\b/gi,' ').replace(/\s+/g,' ').trim();
  note = note.replace(/\b(tanggal|tgl)\s+\d{1,2}\b/gi,' ').replace(/\s+/g,' ').trim();
  note = note.charAt(0).toUpperCase()+note.slice(1);
  if(type==='transfer') note = /tarik tunai/.test(s) ? 'Tarik tunai' : /top ?up|isi saldo/.test(s) ? 'Top up '+W(to).short : 'Transfer ke '+W(to).short;
  if(note.length>48) note = note.slice(0,46).trim()+'…';
  if(type!=='transfer'){ const list = type==='income'?S.incCats:S.expCats; const c = list.find(x=>x.code===catId) || list.find(x=>x.code===(type==='income'?'lainmasuk':'lainnya')) || list[0]; catId = c ? c.id : null; } else catId=null;
  if(!note) note = catId ? cat(catId,type).label : 'Transfer';
  return { type, amount:amt.value, amtConf:amt.conf, cat:catId, catConf, wallet, to, wConf, date, dConf, note, owner };
}
