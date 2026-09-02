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

  if ((location.pathname.split('/').pop() || 'index.html') === 'index.html') {
    const art = document.querySelector('.hero-art');
    if (art) {
      art.innerHTML = '<img src="assets/homepage-hero.jpg" alt="TerraHash Energy renewable energy and digital infrastructure" style="display:block;width:100%;height:100%;object-fit:cover;border-radius:18px;">';
      art.style.width = 'min(62vw, 900px)';
      art.style.height = 'min(46vw, 600px)';
      art.style.top = '110px';
      art.style.right = '3%';
      art.style.borderRadius = '18px';
      art.style.overflow = 'hidden';
      art.style.boxShadow = '0 20px 60px rgba(0,0,0,.28)';
      art.style.background = '#061711';
    }
  }

  initMarketIntelligence();
  if (document.querySelector('#btc-price')) setInterval(initMarketIntelligence, 60000);
  initTradingViewTabs();
});

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
  const n=Number(value);
  el.textContent=Number.isFinite(n)?`${n>=0?'+':''}${n.toFixed(2)}%`:'—';
  el.classList.remove('positive','negative','neutral');
  el.classList.add(Number.isFinite(n)?(n>=0?'positive':'negative'):'neutral');
}
function safeNum(v) { const n=Number(v); return Number.isFinite(n)?n:NaN; }

async function jsonFetch(url, timeout=9000) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeout);
  try {
    const r=await fetch(url,{cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}});
    if(!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally { clearTimeout(timer); }
}

async function getCoinPaprikaAsset(id) {
  const d=await jsonFetch(`https://api.coinpaprika.com/v1/tickers/${id}?quotes=USD`);
  const q=d.quotes && d.quotes.USD; if(!q) throw new Error('CoinPaprika data missing');
  return {price:safeNum(q.price),change:safeNum(q.percent_change_24h),cap:safeNum(q.market_cap),volume:safeNum(q.volume_24h),source:'CoinPaprika'};
}
async function getCoinbaseAsset(id) {
  const d=await jsonFetch(`https://api.exchange.coinbase.com/products/${id}/stats`);
  const last=safeNum(d.last), open=safeNum(d.open), volume=safeNum(d.volume);
  return {price:last,change:Number.isFinite(open)&&open?((last-open)/open)*100:NaN,cap:NaN,volume:Number.isFinite(volume)&&Number.isFinite(last)?volume*last:NaN,source:'Coinbase'};
}
async function getBinanceAsset(id) {
  const d=await jsonFetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${id}`);
  return {price:safeNum(d.lastPrice),change:safeNum(d.priceChangePercent),cap:NaN,volume:safeNum(d.quoteVolume),source:'Binance'};
}
async function getAsset(key) {
  const a=MARKET_ASSETS[key];
  const attempts=[getCoinPaprikaAsset(a.coinpaprika),getCoinbaseAsset(a.coinbase),getBinanceAsset(a.binance)];
  try { return await Promise.any(attempts); }
  catch(e) { return {price:NaN,change:NaN,cap:NaN,volume:NaN,source:'Unavailable'}; }
}

function setOverview(key, asset) {
  const p=safeNum(asset.price), c=safeNum(asset.change);
  const upper=key==='bitcoin'?'btc':key==='ethereum'?'eth':'sol';
  setText(`overview-${upper}`,fmtPrice(p));
  setText(`overview-${upper}-foot`,Number.isFinite(c)?`${c>=0?'+':''}${c.toFixed(2)}% over 24H · ${asset.source}`:'Market feed unavailable');
  const bar=document.getElementById(`bar-${upper}`);
  if(bar) bar.style.width=Number.isFinite(c)?`${Math.min(100,Math.max(12,50+c*7))}%`:'20%';
}

async function initMarketIntelligence() {
  if(!document.querySelector('#btc-price')) return;
  const status=document.querySelector('#market-status');
  if(status) status.textContent='Refreshing public market feeds…';

  const [btc,eth,sol]=await Promise.all([getAsset('bitcoin'),getAsset('ethereum'),getAsset('solana')]);
  setText('btc-price',fmtPrice(btc.price)); setChange('btc-change',btc.change); setText('btc-cap',fmtCompact(btc.cap)); setText('btc-volume',fmtCompact(btc.volume));
  setText('eth-price',fmtPrice(eth.price)); setChange('eth-change',eth.change); setText('eth-cap',fmtCompact(eth.cap)); setText('eth-volume',fmtCompact(eth.volume));
  setText('sol-price',fmtPrice(sol.price)); setChange('sol-change',sol.change); setText('sol-volume',fmtCompact(sol.volume));
  setOverview('bitcoin',btc); setOverview('ethereum',eth); setOverview('solana',sol);

  let globalSource='';
  try {
    const g=await jsonFetch('https://api.coinpaprika.com/v1/global');
    const total=safeNum(g.market_cap_usd), volume=safeNum(g.volume_24h_usd);
    setText('total-cap',fmtCompact(total)); setText('indicator-total-cap',fmtCompact(total)); setText('total-volume',`24H volume: ${fmtCompact(volume)}`); setText('market-volume',fmtCompact(volume));
    setText('btc-dominance',Number.isFinite(Number(g.bitcoin_dominance_percentage))?Number(g.bitcoin_dominance_percentage).toFixed(2)+'%':'—');
    setText('eth-dominance',Number.isFinite(Number(g.ethereum_dominance_percentage))?Number(g.ethereum_dominance_percentage).toFixed(2)+'%':'—');
    globalSource='CoinPaprika';
  } catch(e) {
    setText('total-cap','—'); setText('indicator-total-cap','—'); setText('total-volume','24H volume: —'); setText('btc-dominance','—'); setText('eth-dominance','—'); setText('market-volume','—');
  }

  const loaded=[btc,eth,sol].filter(x=>x.source!=='Unavailable');
  const sources=[...new Set(loaded.map(x=>x.source))];
  if(status) status.textContent=loaded.length?`LIVE · ${sources.join(' / ')} · Updated ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}`:'Market feeds unavailable — retrying automatically';
  setText('data-source',`Sources: ${sources.length?sources.join(' / '):'public market feeds'}${globalSource?' · Global: '+globalSource:''} · TradingView chart`);
  setText('last-updated','Last update: '+new Date().toLocaleString('en-US',{hour:'2-digit',minute:'2-digit',month:'short',day:'numeric'}));

  const rel=(Number.isFinite(btc.price)&&Number.isFinite(eth.price)&&eth.price)?btc.price/eth.price:NaN;
  setText('btc-eth-relative',Number.isFinite(rel)?rel.toFixed(2)+' BTC/ETH':'—');
  const changes=[btc.change,eth.change,sol.change].filter(Number.isFinite);
  const avg=changes.length?changes.reduce((a,b)=>a+b,0)/changes.length:NaN;
  setText('momentum-signal',Number.isFinite(avg)?(avg>1.5?'Positive momentum':avg<-1.5?'Negative momentum':'Mixed / neutral'):'Insufficient data');
  setText('volatility-signal',changes.length>=2?(Math.max(...changes)-Math.min(...changes)>6?'Elevated':'Moderate'):'Monitoring');
  setText('liquidity-signal',loaded.length>=2?'Multi-source liquidity available':'Limited feed coverage');
  setText('breadth-signal',changes.length?`${changes.filter(x=>x>0).length} of ${changes.length} assets positive`:'Monitoring');
  setText('market-regime',Number.isFinite(avg)?(avg>1.5?'Risk-on bias':avg<-1.5?'Risk-off bias':'Balanced'):'Analyzing');
}

function chartUrl(symbol) {
  return `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&tvwidgetsymbol=${encodeURIComponent(symbol)}`;
}

function initTradingViewTabs(){
  const frame=document.getElementById('tv-chart'); if(!frame) return;
  const loader=document.getElementById('chart-loading');
  frame.addEventListener('load',()=>{ if(loader) loader.classList.add('hidden'); });
  document.querySelectorAll('.asset-tab[data-tv]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.asset-tab[data-tv]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-selected','false');});
    btn.classList.add('active'); btn.setAttribute('aria-selected','true');
    const symbol=btn.dataset.tv;
    const asset=btn.dataset.asset;
    if(loader) loader.classList.remove('hidden');
    frame.src=chartUrl(symbol);
    setText('chart-title',asset==='ethereum'?'Ethereum / USD':asset==='solana'?'Solana / USD':'Bitcoin / USD');
  }));
}
