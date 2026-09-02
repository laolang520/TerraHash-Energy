document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('.nav');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const out = form.querySelector('.form-message');
      if (out) { out.textContent = 'Thank you. This demo form is ready to connect to your CRM or email service.'; out.hidden = false; }
      form.reset();
    });
  });

  document.querySelectorAll('.brand .logo').forEach(logo => {
    logo.textContent = '';
    logo.style.backgroundImage = 'url("logo.svg")';
    logo.style.backgroundRepeat = 'no-repeat';
    logo.style.backgroundPosition = 'center';
    logo.style.backgroundSize = 'contain';
    logo.style.width = '150px'; logo.style.height = '52px'; logo.style.flex = '0 0 150px';
    logo.style.border = '0'; logo.style.borderRadius = '8px'; logo.style.boxShadow = 'none'; logo.style.backgroundColor = 'transparent';
  });
  document.querySelectorAll('.brand').forEach(brand => {
    const spans = brand.querySelectorAll(':scope > span');
    if (spans.length > 1) spans[1].style.display = 'none';
  });
  if (nav && !nav.querySelector('a[href="market-intelligence.html"]')) {
    const link = document.createElement('a'); link.href = 'market-intelligence.html'; link.textContent = 'Market Intelligence';
    const relations = nav.querySelector('a[href="investor-relations.html"]'); nav.insertBefore(link, relations || nav.lastElementChild);
  }
  document.querySelectorAll('.lang, [data-lang]').forEach(control => control.remove());
  document.querySelectorAll('a.login, a[href="login.html"]').forEach(link => link.remove());

  addSiteVisuals();
  initMarketIntelligence();
  if (document.querySelector('#btc-price')) setInterval(initMarketIntelligence, 60000);
  initTradingViewTabs();
});

function addSiteVisuals(){
  const path = location.pathname.split('/').pop() || 'index.html';
  const maps = {
    'index.html': [
      ['.hero','assets/hero-renewable.svg','hero-image','Illustrative renewable infrastructure landscape'],
      ['.feature-card:nth-child(1)','assets/solar-field-visual.svg','feature-image','Illustrative solar infrastructure'],
      ['.feature-card:nth-child(2)','assets/energy-storage-visual.svg','feature-image','Illustrative energy storage infrastructure'],
      ['.feature-card:nth-child(3)','assets/smart-building-visual.svg','feature-image','Illustrative smart energy systems'],
      ['.feature-card:nth-child(4)','assets/compute-visual.svg','feature-image','Illustrative digital infrastructure']
    ],
    'solutions.html': [
      ['.info-card:nth-child(1)','assets/solar-field-visual.svg','solution-image','Illustrative renewable energy infrastructure'],
      ['.info-card:nth-child(2)','assets/energy-storage-visual.svg','solution-image','Illustrative storage infrastructure'],
      ['.info-card:nth-child(3)','assets/smart-building-visual.svg','solution-image','Illustrative connected building systems']
    ],
    'news.html': [
      ['.plan-card:nth-child(1) .plan-art','assets/solar-field-visual.svg','plan-photo','Illustrative solar development visual'],
      ['.plan-card:nth-child(2) .plan-art','assets/ev-charging-visual.svg','plan-photo','Illustrative EV charging visual'],
      ['.plan-card:nth-child(3) .plan-art','assets/smart-building-visual.svg','plan-photo','Illustrative smart building visual'],
      ['.plan-card:nth-child(4) .plan-art','assets/compute-visual.svg','plan-photo','Illustrative renewable-powered compute visual'],
      ['.plan-card:nth-child(5) .plan-art','assets/energy-storage-visual.svg','plan-photo','Illustrative energy data and storage visual'],
      ['.plan-card:nth-child(6) .plan-art','assets/hero-renewable.svg','plan-photo','Illustrative strategic infrastructure visual']
    ]
  };
  (maps[path] || []).forEach(([selector,src,kind,alt]) => {
    const target=document.querySelector(selector); if(!target || target.querySelector('.site-visual')) return;
    const img=document.createElement('img'); img.src=src; img.alt=alt; img.className='site-visual '+kind; img.loading=kind==='hero-image'?'eager':'lazy';
    img.style.display='block'; img.style.objectFit='cover';
    if(kind==='hero-image'){
      target.style.background='linear-gradient(90deg,rgba(2,11,18,.9),rgba(2,16,14,.45)),url("assets/hero-renewable.svg") center/cover no-repeat';
      img.style.display='none';
    } else if(kind==='feature-image' || kind==='solution-image'){
      img.style.width='calc(100% + 60px)'; img.style.height='118px'; img.style.margin='-30px -30px 24px'; img.style.borderRadius='12px 12px 0 0';
    } else {
      img.style.position='absolute'; img.style.inset='0'; img.style.width='100%'; img.style.height='100%'; img.style.opacity='.42'; img.style.zIndex='0';
      target.querySelectorAll(':scope > *').forEach(el=>{ if(el!==img){el.style.position='relative';el.style.zIndex='1';} });
    }
    target.prepend(img);
  });
}

const MARKET_ASSETS = {
  bitcoin: {symbol:'BTC', name:'Bitcoin', coinpaprika:'btc-bitcoin', coinbase:'BTC-USD', binance:'BTCUSDT'},
  ethereum: {symbol:'ETH', name:'Ethereum', coinpaprika:'eth-ethereum', coinbase:'ETH-USD', binance:'ETHUSDT'},
  solana: {symbol:'SOL', name:'Solana', coinpaprika:'sol-solana', coinbase:'SOL-USD', binance:'SOLUSDT'}
};

function fmtPrice(value) {
  const n = Number(value); if (!Number.isFinite(n)) return '—';
  if (n >= 1000) return '$' + n.toLocaleString('en-US', {maximumFractionDigits:0});
  if (n >= 1) return '$' + n.toLocaleString('en-US', {maximumFractionDigits:2});
  return '$' + n.toLocaleString('en-US', {maximumFractionDigits:5});
}
function fmtCompact(value) {
  const n = Number(value); if (!Number.isFinite(n)) return '—';
  const a = Math.abs(n); if (a >= 1e12) return '$' + (n/1e12).toFixed(2) + 'T';
  if (a >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B';
  if (a >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  return '$' + Math.round(n).toLocaleString('en-US');
}
function setText(id, value) { const el=document.getElementById(id); if(el) el.textContent=value; }
function setChange(id, value) {
  const el=document.getElementById(id); if(!el) return;
  const n=Number(value); el.textContent=Number.isFinite(n)?`${n>=0?'+':''}${n.toFixed(2)}%`:'—';
  el.classList.remove('positive','negative','neutral'); el.classList.add(Number.isFinite(n)?(n>=0?'positive':'negative'):'neutral');
}
function safeNum(v) { const n=Number(v); return Number.isFinite(n)?n:NaN; }
async function jsonFetch(url, timeout=9000) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeout);
  try { const r=await fetch(url,{cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); }
  finally { clearTimeout(timer); }
}
async function getCoinPaprikaAsset(id) {
  const d=await jsonFetch(`https://api.coinpaprika.com/v1/tickers/${id}?quotes=USD`); const q=d.quotes && d.quotes.USD; if(!q) throw new Error('CoinPaprika data missing');
  return {price:safeNum(q.price),change:safeNum(q.percent_change_24h),cap:safeNum(q.market_cap),volume:safeNum(q.volume_24h),source:'CoinPaprika'};
}
async function getCoinbaseAsset(id) {
  const d=await jsonFetch(`https://api.exchange.coinbase.com/products/${id}/stats`); const last=safeNum(d.last), open=safeNum(d.open), volume=safeNum(d.volume);
  return {price:last,change:Number.isFinite(open)&&open?((last-open)/open)*100:NaN,cap:NaN,volume:Number.isFinite(volume)&&Number.isFinite(last)?volume*last:NaN,source:'Coinbase'};
}
async function getBinanceAsset(id) {
  const d=await jsonFetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${id}`); return {price:safeNum(d.lastPrice),change:safeNum(d.priceChangePercent),cap:NaN,volume:safeNum(d.quoteVolume),source:'Binance'};
}
async function getAsset(key) {
  const a=MARKET_ASSETS[key];
  try { return await Promise.any([getCoinPaprikaAsset(a.coinpaprika),getCoinbaseAsset(a.coinbase),getBinanceAsset(a.binance)]); }
  catch(e) { return {price:NaN,change:NaN,cap:NaN,volume:NaN,source:'Unavailable'}; }
}
function setOverview(key, asset) {
  const p=safeNum(asset.price), c=safeNum(asset.change), upper=key==='bitcoin'?'btc':key==='ethereum'?'eth':'sol';
  setText(`overview-${upper}`,fmtPrice(p)); setText(`overview-${upper}-foot`,Number.isFinite(c)?`${c>=0?'+':''}${c.toFixed(2)}% over 24H · ${asset.source}`:'Market feed unavailable');
  const bar=document.getElementById(`bar-${upper}`); if(bar) bar.style.width=Number.isFinite(c)?`${Math.min(100,Math.max(12,50+c*7))}%`:'20%';
}
async function initMarketIntelligence() {
  if(!document.querySelector('#btc-price')) return;
  const status=document.querySelector('#market-status'); if(status) status.textContent='Refreshing public market feeds…';
  const [btc,eth,sol]=await Promise.all([getAsset('bitcoin'),getAsset('ethereum'),getAsset('solana')]);
  setText('btc-price',fmtPrice(btc.price)); setChange('btc-change',btc.change); setText('btc-cap',fmtCompact(btc.cap)); setText('btc-volume',fmtCompact(btc.volume));
  setText('eth-price',fmtPrice(eth.price)); setChange('eth-change',eth.change); setText('eth-cap',fmtCompact(eth.cap)); setText('eth-volume',fmtCompact(eth.volume));
  setText('sol-price',fmtPrice(sol.price)); setChange('sol-change',sol.change); setText('sol-volume',fmtCompact(sol.volume));
  setOverview('bitcoin',btc); setOverview('ethereum',eth); setOverview('solana',sol);
  let globalSource='';
  try {
    const g=await jsonFetch('https://api.coinpaprika.com/v1/global'); const total=safeNum(g.market_cap_usd), volume=safeNum(g.volume_24h_usd);
    setText('total-cap',fmtCompact(total)); setText('indicator-total-cap',fmtCompact(total)); setText('total-volume',`24H volume: ${fmtCompact(volume)}`); setText('market-volume',fmtCompact(volume));
    setText('btc-dominance',Number.isFinite(Number(g.bitcoin_dominance_percentage))?Number(g.bitcoin_dominance_percentage).toFixed(2)+'%':'—'); setText('eth-dominance',Number.isFinite(Number(g.ethereum_dominance_percentage))?Number(g.ethereum_dominance_percentage).toFixed(2)+'%':'—'); globalSource='CoinPaprika';
  } catch(e) { setText('total-cap','—'); setText('indicator-total-cap','—'); setText('total-volume','24H volume: —'); setText('btc-dominance','—'); setText('eth-dominance','—'); setText('market-volume','—'); }
  const loaded=[btc,eth,sol].filter(x=>x.source!=='Unavailable'); const sources=[...new Set(loaded.map(x=>x.source))];
  if(status) status.textContent=loaded.length?`LIVE · ${sources.join(' / ')} · Updated ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`:'Market feeds unavailable — retrying automatically';
  setText('data-source',`Sources: ${sources.length?sources.join(' / '):'public market feeds'}${globalSource?' · Global: '+globalSource:''} · TradingView chart`);
  setText('last-updated','Last update: '+new Date().toLocaleString('en-US',{hour:'2-digit',minute:'2-digit',month:'short',day:'numeric'}));
  const rel=(Number.isFinite(btc.price)&&Number.isFinite(eth.price)&&eth.price)?btc.price/eth.price:NaN; setText('btc-eth-relative',Number.isFinite(rel)?rel.toFixed(2)+' BTC/ETH':'—');
  const changes=[btc.change,eth.change,sol.change].filter(Number.isFinite), avg=changes.length?changes.reduce((a,b)=>a+b,0)/changes.length:NaN;
  setText('momentum-signal',Number.isFinite(avg)?(avg>1.5?'Positive momentum':avg<-1.5?'Negative momentum':'Mixed / neutral'):'Insufficient data'); setText('volatility-signal',changes.length>=2?(Math.max(...changes)-Math.min(...changes)>6?'Elevated':'Moderate'):'Monitoring'); setText('liquidity-signal',loaded.length>=2?'Multi-source liquidity available':'Limited feed coverage'); setText('breadth-signal',changes.length?`${changes.filter(x=>x>0).length} of ${changes.length} assets positive`:'Monitoring'); setText('market-regime',Number.isFinite(avg)?(avg>1.5?'Risk-on bias':avg<-1.5?'Risk-off bias':'Balanced'):'Analyzing');
}
function chartUrl(symbol) { return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&tvwidgetsymbol=${encodeURIComponent(symbol)}`; }
function initTradingViewTabs(){
  const frame=document.getElementById('tv-chart'); if(!frame) return; const loader=document.getElementById('chart-loading'); frame.addEventListener('load',()=>{ if(loader) loader.classList.add('hidden'); });
  document.querySelectorAll('.asset-tab[data-tv]').forEach(btn=>btn.addEventListener('click',()=>{ document.querySelectorAll('.asset-tab[data-tv]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');}); btn.classList.add('active'); btn.setAttribute('aria-selected','true'); if(loader) loader.classList.remove('hidden'); frame.src=chartUrl(btn.dataset.tv); setText('chart-title',btn.dataset.asset==='ethereum'?'Ethereum / USD':btn.dataset.asset==='solana'?'Solana / USD':'Bitcoin / USD'); }));
}

/* Homepage hero: professional English terminology over the renewable infrastructure visual. */
document.addEventListener('DOMContentLoaded', () => {
  if ((location.pathname.split('/').pop() || 'index.html') !== 'index.html') return;
  const art=document.querySelector('.hero-art');
  if(!art || art.querySelector('.corporate-hero-labels')) return;
  const labels=[
    ['High-Purity Silicon','high-purity'],['Silicon Ingots','ingots'],['Wafers','wafers'],
    ['Silicon Powder','powder'],['Industrial Chemicals','chemicals'],['Battery Production','production'],
    ['Battery Cells','cells'],['Energy Storage Systems','storage'],['Solar Power Systems','solar'],
    ['Power Grid Connection','grid'],['Renewable Energy','renewable'],['Digital Infrastructure','digital']
  ];
  art.innerHTML=`<div class="corporate-hero-visual"><img src="assets/hero-renewable.svg" alt="Renewable energy, storage and infrastructure systems">${labels.map(([text,cls])=>`<span class="corporate-hero-label ${cls}">${text}</span>`).join('')}</div>`;
  const style=document.createElement('style');
  style.textContent=`
    .hero-art{min-height:470px!important;overflow:hidden!important;border-radius:18px!important;background:#061711!important;border:1px solid rgba(119,228,62,.18)!important;position:relative!important}
    .corporate-hero-visual{position:relative;width:100%;height:470px;overflow:hidden}
    .corporate-hero-visual img{width:100%;height:100%;display:block;object-fit:cover;opacity:.9}
    .corporate-hero-label{position:absolute;z-index:2;padding:7px 10px;border:1px solid rgba(119,228,62,.48);background:rgba(3,20,15,.84);color:#eef8f0;border-radius:6px;font:700 8px/1.15 Arial,sans-serif;letter-spacing:.055em;text-transform:uppercase;white-space:nowrap;box-shadow:0 5px 16px rgba(0,0,0,.22)}
    .corporate-hero-label:before{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:#77e43e;margin-right:6px;vertical-align:1px}
    .high-purity{left:8%;top:24%}.ingots{left:31%;top:19%}.wafers{left:52%;top:15%}.powder{left:6%;bottom:26%}.chemicals{left:29%;bottom:36%}.production{left:35%;bottom:8%}.cells{left:54%;bottom:19%}.storage{left:72%;bottom:13%}.solar{right:5%;top:32%}.grid{right:3%;top:54%}.renewable{left:8%;top:57%}.digital{left:53%;top:41%}
    @media(max-width:900px){.hero-art{min-height:360px!important}.corporate-hero-visual{height:360px}.corporate-hero-label{font-size:7px;padding:6px 7px}.chemicals,.powder,.renewable{display:none}}
    @media(max-width:650px){.hero-art{min-height:270px!important}.corporate-hero-visual{height:270px}.corporate-hero-label{font-size:6px;padding:5px 6px}.high-purity,.ingots,.wafers,.chemicals,.powder,.production,.cells{display:none}.solar{right:4%;top:25%}.grid{right:3%;top:55%}.storage{left:50%;bottom:10%}.digital{left:48%;top:43%}}
  `;
  document.head.appendChild(style);
});
