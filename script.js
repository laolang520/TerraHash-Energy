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

  initMarketIntelligence();
  if (document.querySelector('#btc-price')) setInterval(initMarketIntelligence, 60000);
  initTradingViewTabs();
});

const MARKET_ASSETS = {
  bitcoin: {symbol:'BTC', coinpaprika:'btc-bitcoin', coinbase:'BTC-USD', binance:'BTCUSDT'},
  ethereum: {symbol:'ETH', coinpaprika:'eth-ethereum', coinbase:'ETH-USD', binance:'ETHUSDT'},
  solana: {symbol:'SOL', coinpaprika:'sol-solana', coinbase:'SOL-USD', binance:'SOLUSDT'}
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
  el.classList.toggle('up', Number.isFinite(n)&&n>=0); el.classList.toggle('down', Number.isFinite(n)&&n<0); el.classList.toggle('negative', Number.isFinite(n)&&n<0);
}

async function jsonFetch(url, timeout=9000) {
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),timeout);
  try { const r=await fetch(url,{cache:'no-store',signal:controller.signal,headers:{Accept:'application/json'}}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return await r.json(); }
  finally { clearTimeout(timer); }
}

async function getCoinPaprikaAsset(id) {
  const d=await jsonFetch(`https://api.coinpaprika.com/v1/tickers/${id}?quotes=USD`);
  const q=d.quotes && d.quotes.USD; if(!q) throw new Error('CoinPaprika data missing');
  return {price:q.price, change:q.percent_change_24h, cap:q.market_cap, volume:q.volume_24h, source:'CoinPaprika'};
}
async function getCoinbaseAsset(id) {
  const d=await jsonFetch(`https://api.exchange.coinbase.com/products/${id}/stats`);
  const last=Number(d.last), open=Number(d.open), volume=Number(d.volume);
  return {price:last, change:open?((last-open)/open)*100:NaN, cap:NaN, volume:volume*last, source:'Coinbase'};
}
async function getBinanceAsset(id) {
  const d=await jsonFetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${id}`);
  return {price:Number(d.lastPrice), change:Number(d.priceChangePercent), cap:NaN, volume:Number(d.quoteVolume), source:'Binance'};
}

async function getAsset(key) {
  const a=MARKET_ASSETS[key];
  const attempts=[getCoinPaprikaAsset(a.coinpaprika),getCoinbaseAsset(a.coinbase),getBinanceAsset(a.binance)];
  try { return await Promise.any(attempts); } catch(e) { return {price:NaN,change:NaN,cap:NaN,volume:NaN,source:'Unavailable'}; }
}

async function initMarketIntelligence() {
  const chart=document.querySelector('#btc-chart');
  if(!chart && !document.querySelector('#btc-price')) return;
  const status=document.querySelector('#market-status');
  if(status) status.textContent='Connecting to live market feeds…';

  const [btc,eth,sol]=await Promise.all([getAsset('bitcoin'),getAsset('ethereum'),getAsset('solana')]);
  const assets={btc,eth,sol};
  setText('btc-price',fmtPrice(btc.price)); setChange('btc-change',btc.change); setText('btc-cap',fmtCompact(btc.cap)); setText('btc-volume',fmtCompact(btc.volume));
  setText('eth-price',fmtPrice(eth.price)); setChange('eth-change',eth.change); setText('eth-cap',fmtCompact(eth.cap)); setText('eth-volume',fmtCompact(eth.volume));
  setText('sol-price',fmtPrice(sol.price)); setChange('sol-change',sol.change); setText('sol-volume',fmtCompact(sol.volume));

  let globalSource='';
  try {
    const g=await jsonFetch('https://api.coinpaprika.com/v1/global');
    setText('total-cap',fmtCompact(g.market_cap_usd)); setText('total-volume',`24H volume: ${fmtCompact(g.volume_24h_usd)}`);
    setText('btc-dominance',Number(g.bitcoin_dominance_percentage).toFixed(2)+'%');
    setText('eth-dominance',Number(g.ethereum_dominance_percentage).toFixed(2)+'%');
    setText('market-volume',fmtCompact(g.volume_24h_usd)); globalSource='CoinPaprika';
  } catch(e) {
    setText('total-cap','—'); setText('total-volume','24H volume: —'); setText('btc-dominance','—'); setText('eth-dominance','—'); setText('market-volume','—');
  }

  const loaded=[btc,eth,sol].filter(x=>x.source!=='Unavailable');
  const sources=[...new Set(loaded.map(x=>x.source))];
  if(status) status.textContent=loaded.length ? `LIVE · ${sources.join(' / ')} · Updated ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}` : 'Market feeds unavailable — retrying automatically';
  setText('data-source',`Sources: ${sources.length?sources.join(' / '):'public market feeds'}${globalSource?' · Global: '+globalSource:''} · TradingView chart`);
  setText('last-updated','Last update: '+new Date().toLocaleString('en-US',{hour:'2-digit',minute:'2-digit',month:'short',day:'numeric'}));

  const rel=(Number(btc.price)&&Number(eth.price))?btc.price/eth.price:NaN;
  setText('btc-eth-relative',Number.isFinite(rel)?rel.toFixed(2)+' BTC/ETH':'—');
  const changes=[btc.change,eth.change,sol.change].filter(Number.isFinite);
  const avg=changes.length?changes.reduce((a,b)=>a+b,0)/changes.length:NaN;
  setText('momentum-signal',Number.isFinite(avg)?(avg>1.5?'Positive momentum':avg<-1.5?'Negative momentum':'Mixed / neutral'):'Insufficient data');
  setText('volatility-signal',changes.length>=2?(Math.max(...changes)-Math.min(...changes)>6?'Elevated':'Moderate'):'Monitoring');
  setText('liquidity-signal',loaded.length>=2?'Multi-source liquidity available':'Limited feed coverage');
  setText('breadth-signal',changes.length?`${changes.filter(x=>x>0).length} of ${changes.length} assets positive`:'Monitoring');
  setText('market-regime',Number.isFinite(avg)?(avg>1.5?'Risk-on bias':avg<-1.5?'Risk-off bias':'Balanced'):'Analyzing');
}

function initTradingViewTabs(){
  const frame=document.getElementById('tv-chart'); if(!frame) return;
  document.querySelectorAll('[data-tv-symbol]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-tv-symbol]').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    const symbol=encodeURIComponent(btn.dataset.tvSymbol);
    frame.src=`https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=60&hidesidetoolbar=1&symboledit=1&saveimage=0&toolbarbg=f1f3f6&theme=dark&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1`;
  }));
}
