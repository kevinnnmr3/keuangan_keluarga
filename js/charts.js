/* =========================================================
   CHARTS — SVG ringan, ukuran piksel asli, hover tooltip.
   Warna seri: --s1..--s5 (palet tervalidasi, tema terang/gelap).
   ========================================================= */
const CHARTS = {};   // id -> {draw(el), tip(i)}
function niceMax(v){ if(v<=0) return 1; const p=Math.pow(10,Math.floor(Math.log10(v))); const n=v/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p; }
function niceMin(v){ return v>=0 ? 0 : -niceMax(-v); }
function svgEl(w,h,inner){ return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img">${inner}</svg>`; }
function barPath(x,y0,w,h,r=4){ // ujung data membulat 4px, pangkal kotak
  if(h===0) return '';
  r=Math.min(r,w/2,Math.abs(h));
  if(h>0){ const y=y0-h; return `M${x},${y0}V${y+r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y+r}V${y0}Z`; }
  const y=y0-h; return `M${x},${y0}V${y-r}Q${x},${y} ${x+r},${y}H${x+w-r}Q${x+w},${y} ${x+w},${y-r}V${y0}Z`;
}
function yAxis(w,padL,top,plotH,min,max,ticks=4){
  let g=''; for(let i=0;i<=ticks;i++){ const v=min+(max-min)*i/ticks; const y=top+plotH-(v-min)/(max-min)*plotH;
    g+=`<line x1="${padL}" x2="${w}" y1="${y}" y2="${y}" stroke="var(${v===0?'--axis':'--grid'})" stroke-width="1"/>`;
    g+=`<text x="${padL-8}" y="${y+4}" text-anchor="end">${axisC(v)}</text>`; }
  return g;
}

/* Kolom berkelompok (mis. pemasukan vs pengeluaran per bulan) */
function drawGroupedBars(el, cfg){
  const w=Math.max(260,el.clientWidth), h=cfg.height||220, padL=44, top=12, bottom=26, plotH=h-top-bottom, plotW=w-padL;
  const all=cfg.series.flatMap(s=>s.values).concat((cfg.refs||[]).filter(v=>v>0)); const max=niceMax(Math.max(...all,0)), min=niceMin(Math.min(...all,0));
  const n=cfg.labels.length, band=plotW/n, k=cfg.series.length;
  const bw=Math.min(24,(band*0.62-(k-1)*2)/k), groupW=bw*k+(k-1)*2;
  const y0=top+plotH-(0-min)/(max-min)*plotH;
  let g=yAxis(w,padL,top,plotH,min,max);
  cfg.labels.forEach((lb,i)=>{
    const gx=padL+band*i+(band-groupW)/2;
    cfg.series.forEach((s,j)=>{ const v=s.values[i]; const hh=v/(max-min)*plotH; g+=`<path d="${barPath(gx+j*(bw+2),y0,bw,hh)}" fill="${s.color}" opacity="${cfg.dim&&cfg.dim[i]?.55:1}"/>`; });
    if(cfg.refs){ const rv=cfg.refs[i]; if(rv){ const ry=top+plotH-(rv-min)/(max-min)*plotH; g+=`<line x1="${gx-5}" x2="${gx+groupW+5}" y1="${ry}" y2="${ry}" stroke="var(--ink)" stroke-width="2" stroke-linecap="round"/>`; } }
    if(cfg.flags && cfg.flags[i]) g+=`<text x="${padL+band*i+band/2}" y="${top+8}" text-anchor="middle" style="font-weight:700;fill:var(--ink2)">${cfg.flags[i]}</text>`;
    g+=`<text x="${padL+band*i+band/2}" y="${h-6}" text-anchor="middle">${lb}</text>`;
    g+=`<rect class="hit" data-i="${i}" x="${padL+band*i}" y="${top}" width="${band}" height="${plotH}" fill="transparent"/>`;
  });
  el.innerHTML=svgEl(w,h,g);
}

/* Garis tunggal + area wash + crosshair */
function drawLine(el, cfg){
  const w=Math.max(260,el.clientWidth), h=cfg.height||200, padL=cfg.noAxis?8:48, padR=12, top=14, bottom=cfg.noX?10:26, plotH=h-top-bottom, plotW=w-padL-padR;
  const vals=cfg.values; let lo=Math.min(...vals), hi=Math.max(...vals);
  if(cfg.zero){ lo=Math.min(lo,0); hi=Math.max(hi,0); }
  const span=(hi-lo)||Math.abs(hi)||1; lo-=span*0.12; hi+=span*0.12;
  if(!cfg.zero){ const step=niceMax(span/3); lo=Math.floor(lo/step)*step; hi=Math.ceil(hi/step)*step; }
  const X=i=> padL + (vals.length===1?plotW/2:plotW*i/(vals.length-1)), Y=v=> top+plotH-(v-lo)/(hi-lo)*plotH;
  const color=cfg.color||'var(--ink)';
  let g='';
  if(!cfg.noAxis) g+=yAxis(w-padR,padL,top,plotH,lo,hi,3);
  if(cfg.zero && lo<0 && hi>0) g+=`<line x1="${padL}" x2="${w-padR}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--axis)"/>`;
  const pts=vals.map((v,i)=>[X(i),Y(v)]);
  const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+','+p[1].toFixed(1)).join('');
  const base = cfg.zero ? Y(0) : top+plotH;
  g+=`<path d="${d}L${pts[pts.length-1][0]},${base}L${pts[0][0]},${base}Z" fill="${color}" opacity=".1"/>`;
  g+=`<path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
  const e=pts[pts.length-1]; g+=`<circle cx="${e[0]}" cy="${e[1]}" r="5" fill="${color}" stroke="var(--card)" stroke-width="2"/>`;
  if(!cfg.noX) cfg.labels.forEach((lb,i)=>{ if(cfg.labels.length>7 && i%2 && i!==cfg.labels.length-1) return; g+=`<text x="${X(i)}" y="${h-6}" text-anchor="${i===0?'start':i===cfg.labels.length-1?'end':'middle'}">${lb}</text>`; });
  g+=`<line class="xh" x1="0" x2="0" y1="${top}" y2="${top+plotH}" stroke="var(--axis)" stroke-width="1" opacity="0"/><circle class="xd" r="5" fill="${color}" stroke="var(--card)" stroke-width="2" opacity="0"/>`;
  const step = vals.length>1 ? plotW/(vals.length-1) : plotW;
  vals.forEach((v,i)=>{ g+=`<rect class="hit" data-i="${i}" data-x="${X(i)}" data-y="${Y(v)}" x="${X(i)-step/2}" y="${top}" width="${step}" height="${plotH}" fill="transparent"/>`; });
  el.innerHTML=svgEl(w,h,g);
}

/* Donut alokasi, celah 2px */
function drawDonut(el, cfg){
  const size=el.clientWidth||150, r=size/2, rin=r*0.66, total=cfg.values.reduce((a,b)=>a+b,0)||1;
  let a0=-Math.PI/2, g='';
  cfg.values.forEach((v,i)=>{ if(v<=0) return; const a1=a0+v/total*Math.PI*2; const large=a1-a0>Math.PI?1:0;
    const p=(ang,rad)=>[r+rad*Math.cos(ang), r+rad*Math.sin(ang)];
    const [x0,y0]=p(a0,r),[x1,y1]=p(a1,r),[x2,y2]=p(a1,rin),[x3,y3]=p(a0,rin);
    g+=`<path class="hit" data-i="${i}" d="M${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${rin},${rin} 0 ${large} 0 ${x3},${y3}Z" fill="${cfg.colors[i]}" stroke="var(--card)" stroke-width="2"/>`;
    a0=a1; });
  g+=`<text x="${r}" y="${r-4}" text-anchor="middle" style="font-size:11px">${cfg.centerLabel||''}</text><text x="${r}" y="${r+14}" text-anchor="middle" class="m" style="font-size:15px;font-weight:750;fill:var(--ink)">${cfg.centerValue||''}</text>`;
  el.innerHTML=svgEl(size,size,g);
}

/* ---------- tooltip global ---------- */
const TIP = { el:null };
function tipShow(html, x, y){
  if(!TIP.el){ TIP.el=document.createElement('div'); TIP.el.className='tip'; document.body.appendChild(TIP.el); }
  TIP.el.innerHTML=html; TIP.el.classList.add('on');
  const r=TIP.el.getBoundingClientRect(); let left=x+14, top=y-r.height-12;
  if(left+r.width>innerWidth-8) left=x-r.width-14; if(left<8) left=8; if(top<8) top=y+16;
  TIP.el.style.left=left+'px'; TIP.el.style.top=top+'px';
}
function tipHide(){ if(TIP.el) TIP.el.classList.remove('on'); }
const tipRow = (color,label,val) => `<div class="tr"><span>${color?`<i class="sw" style="background:${color}"></i>`:''}${label}</span><b class="m">${val}</b></div>`;

function mountCharts(root=document){
  root.querySelectorAll('[data-chart]').forEach(el=>{
    const c=CHARTS[el.dataset.chart]; if(!c) return;
    c.draw(el);
    const svg=el.querySelector('svg'); if(!svg) return;
    const move=ev=>{ const hit=ev.target.closest('.hit'); if(!hit){ tipHide(); return; }
      const i=+hit.dataset.i; const pt=ev.touches?ev.touches[0]:ev;
      if(hit.dataset.x){ const xh=svg.querySelector('.xh'), xd=svg.querySelector('.xd'); xh.setAttribute('x1',hit.dataset.x); xh.setAttribute('x2',hit.dataset.x); xh.setAttribute('opacity',1); xd.setAttribute('cx',hit.dataset.x); xd.setAttribute('cy',hit.dataset.y); xd.setAttribute('opacity',1); }
      tipShow(c.tip(i), pt.clientX, pt.clientY); };
    svg.addEventListener('pointermove',move); svg.addEventListener('pointerdown',move);
    svg.addEventListener('pointerleave',()=>{ tipHide(); const xh=svg.querySelector('.xh'), xd=svg.querySelector('.xd'); if(xh){xh.setAttribute('opacity',0); xd.setAttribute('opacity',0);} });
  });
}
let _rz; addEventListener('resize',()=>{ clearTimeout(_rz); _rz=setTimeout(()=>mountCharts(),150); });
