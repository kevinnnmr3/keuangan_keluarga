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

const WALLET_ALIASES = { bca:['bca','m-banking bca','mybca'], mandiri:['mandiri','livin'], bri:['bri','brimo','simpedes'], jago:['jago'], gopay:['gopay','go pay'], seabank:['seabank','sea bank'], shopeepay:['shopeepay','shopee pay','spay'], cimb:['cimb','cimb niaga','octo','payroll'], bsi:['bsi','byond'], bni:['bni','wondr'], tunai:['cash','tunai','uang tunai','kes'] };
// Urutan penting: yang spesifik dulu, yang umum (mis. 'makan') belakangan. Kunci = code sub-kategori.
const CAT_KEYWORDS = {
  bensin:['bensin','pertalite','pertamax','solar','isi bensin','spbu'],
  servis:['servis','service','bengkel','ganti oli','oli','ban','cuci mobil','cuci motor','aki'],
  listrik:['listrik','token','pln'],
  internet:['internet','indihome','wifi','biznet','first media','myrepublic'],
  air:['pdam','tagihan air'],
  gas:['gas','elpiji','lpg'],
  pulsa:['pulsa','paket data','kuota'],
  rumah:['sewa','kontrakan','kos','kosan','kpr','renovasi'],
  cicilan:['cicilan','angsuran','kredit','paylater','utang','hutang','pinjol'],
  suplemen:['suplemen','vitamin'],
  anak:['susu','popok','pampers','diaper','mainan','daycare','sekolah','anak','mamypoko','sgm'],
  obat:['obat','apotek','apotik'],
  kesehatan:['dokter','klinik','rumah sakit','bpjs','vaksin','puskesmas','periksa'],
  skincare:['skincare','salon','facial','perawatan','creambath','serum'],
  baju:['baju','celana','sepatu','kaos','kemeja','jilbab','kerudung','sandal'],
  pribadi:['shopee','tokopedia','lazada','potong rambut','cukur','sabun mandi','perlengkapan'],
  ortu:['orang tua','ortu','mamah','mama','bapak','ibu','mertua'],
  keluarga:['kondangan','sumbangan','zakat','sedekah','infaq','arisan','hadiah','kado','ulang tahun','adik','kakak','ponakan','keponakan'],
  hiburan:['nonton','bioskop','netflix','spotify','youtube premium','game','liburan','jalan-jalan','wisata'],
  darurat:['darurat'],
  groceries:['indomaret','alfamart','alfamidi','sabun','deterjen','tisu','sampo','pasta gigi'],
  dapur:['superindo','pasar','sayur','beras','galon','minyak goreng','telur','yogya','borma','hypermart','dapur','daging','ayam potong','bumbu'],
  jajan:['jajan','cemilan','camilan','snack','gorengan','es krim','boba'],
  transport:['parkir','tol','ojol','ojek','gojek','grab','kereta','krl','busway','transjakarta','bus','angkot','tiket'],
  makan:['makan','kopi','ngopi','bakso','nasi','gofood','grabfood','shopeefood','sarapan','martabak','warteg','padang','minum','seblak','mie','sate','soto','restoran','cafe'],
};
const INC_KEYWORDS = { freelance:['edulab','edulabs','freelance','proyek','project','klien','konsultasi'], gaji:['gaji','gajian','thr','bonus'], usaha:['jualan','usaha','omzet','dagangan'], hasilinv:['bunga','dividen','kupon'] };
const INCOME_HINT = ['gaji','gajian','terima','nerima','dapet','dapat','masuk','transferan','bonus','thr','freelance','cashback','bunga','dividen','jualan','omzet'];
const TRANSFER_HINT = ['top up','topup','isi saldo','tarik tunai','pindahin','pindah ke','pindahkan','transfer ke','setor ke'];

/* Speech-to-text sering salah tulis nama bank (mis. "seabank" → "c bank"). Samakan dulu sebelum dicocokkan. */
const STT_FIX = [
  [/\b(c|si|see|sea|shi|ci)\s?-?\s?(bank|bang|beng)\b/g,'seabank'], [/\bseabang\b/g,'seabank'],
  [/\b(shopee|shopi|sopi|syopi|shoppe)\s?-?\s?(pay|pei|pe)\b/g,'shopeepay'], [/\bs\s?pay\b/g,'shopeepay'],
  [/\bgo\s?-?\s?(pay|pei)\b/g,'gopay'],
  [/\b(b\s?c\s?a|be\s?ce\s?a|bece\s?a|beca)\b/g,'bca'], [/\b(b\s?s\s?i|be\s?es\s?i)\b/g,'bsi'],
  [/\b(b\s?n\s?i|be\s?en\s?i)\b/g,'bni'], [/\b(b\s?r\s?i|be\s?er\s?i)\b/g,'bri'],
  [/\b(c\s?i\s?m\s?b|cimbi|simbi|sim\s?b|cim\s?b)\b/g,'cimb'], [/\bman\s?diri\b/g,'mandiri'], [/\bbank\s+jago\b/g,'jago'],
];
function normalizeSTT(s){ STT_FIX.forEach(([re,to])=>{ s=s.replace(re,to); }); return s; }
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
  text = normalizeSTT(text.toLowerCase().replace(/\s+/g,' ')).replace(/^./,c=>c.toUpperCase());
  const s = ' '+text.toLowerCase()+' ';
  const amt = findAmount(text);
  const wallets = findWallets(s);
  let type = 'expense';
  if(TRANSFER_HINT.some(k=>has(s,k))) type='transfer';
  else if(INCOME_HINT.some(k=>has(s,k))) type='income';
  // kategori
  let catId=null, catConf='low', kw=null;
  // 1) nama sub-kategori/kategori milik sendiri yang disebut langsung (mis. 'parkir', 'pendidikan')
  let catLeafId=null;
  if(type!=='transfer'){ const leaves=leafCats(type).filter(c=>c.label.length>=4).sort((a,b)=>b.label.length-a.label.length);
    const hit=leaves.find(c=>has(s,c.label.toLowerCase())); if(hit){ catLeafId=hit.id; catConf='high'; } }
  if(!catLeafId && type==='expense'){ for(const [c,arr] of Object.entries(CAT_KEYWORDS)){ const k=arr.find(a=>has(s,a)); if(k){ catId=c; kw=k; catConf='high'; break; } } if(!catId && has(s,'belanja')){ catId='dapur'; catConf='low'; } if(!catId) catId='lainnya'; }
  if(!catLeafId && type==='income'){ for(const [c,arr] of Object.entries(INC_KEYWORDS)){ const k=arr.find(a=>has(s,a)); if(k){ catId=c; kw=k; catConf='high'; break; } } if(!catId) catId='lainmasuk'; }
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
  wallets.forEach(w=> note = note.replace(new RegExp('\\b(menggunakan|memakai|pakai|pake|via|lewat|dari|ke|masuk|bayar pakai|bayar pake|bayar)?\\s*(dompet|rekening|saldo)?\\s*'+w.alias+'\\b','i'),' '));
  note = note.replace(/\b(sebesar|senilai|seharga)\b/gi,' ');
  note = note.replace(/\b(tadi|barusan|kemarin|hari ini|aku|saya|udah|sudah|nih|ya|dong|terus|trus|bayar|cash|tunai)\b/gi,' ').replace(/\s+/g,' ').trim();
  note = note.replace(/\b(tanggal|tgl)\s+\d{1,2}\b/gi,' ').replace(/\s+/g,' ').trim();
  note = note.charAt(0).toUpperCase()+note.slice(1);
  if(type==='transfer') note = /tarik tunai/.test(s) ? 'Tarik tunai' : /top ?up|isi saldo/.test(s) ? 'Top up '+W(to).short : 'Transfer ke '+W(to).short;
  if(note.length>48) note = note.slice(0,46).trim()+'…';
  if(catLeafId){ catId=catLeafId; } else if(type!=='transfer'){ const leaves=leafCats(type); const c = leaves.find(x=>x.code===catId) || leaves.find(x=>x.code===(type==='income'?'lainmasuk':'lainnya')) || leaves[0]; if(c && c.code!==catId) catConf='low'; catId = c ? c.id : null; } else catId=null;
  if(!note) note = catId ? cat(catId,type).label : 'Transfer';
  return { type, amount:amt.value, amtConf:amt.conf, cat:catId, catConf, wallet, to, wConf, date, dConf, note, owner };
}
