(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Brand cleanup and responsive navigation.
  $$('.brand .logo').forEach(logo => {
    logo.textContent = '';
    logo.style.background = 'url("logo.svg") center/contain no-repeat';
    logo.style.width = '150px';
    logo.style.height = '52px';
    logo.style.flex = '0 0 150px';
    logo.style.border = '0';
    logo.style.borderRadius = '0';
    logo.style.boxShadow = 'none';
  });
  $$('.brand').forEach(brand => {
    const spans = brand.querySelectorAll(':scope > span');
    if (spans.length > 1) spans[1].style.display = 'none';
  });
  $$('a.login, a[href="login.html"], .lang, [data-lang]').forEach(el => el.remove());

  $$('.menu[data-menu]').forEach(btn => {
    btn.addEventListener('click', () => {
      const nav = $('.nav');
      if (!nav) return;
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  });

  // Add image-rich editorial visuals to suitable sections without claiming third-party images as TerraHash projects.
  const path = location.pathname.split('/').pop() || 'index.html';
  const visualMap = {
    'index.html': [
      ['.hero', 'assets/hero-renewable.svg', 'hero-image', 'Illustrative renewable infrastructure landscape'],
      ['.feature-card:nth-child(1)', 'assets/solar-field-visual.svg', 'feature-image', 'Illustrative solar infrastructure'],
      ['.feature-card:nth-child(2)', 'assets/energy-storage-visual.svg', 'feature-image', 'Illustrative energy storage infrastructure'],
      ['.feature-card:nth-child(3)', 'assets/smart-building-visual.svg', 'feature-image', 'Illustrative smart energy systems'],
      ['.feature-card:nth-child(4)', 'assets/compute-visual.svg', 'feature-image', 'Illustrative digital infrastructure']
    ],
    'solutions.html': [
      ['.info-card:nth-child(1)', 'assets/solar-field-visual.svg', 'solution-image', 'Illustrative renewable energy infrastructure'],
      ['.info-card:nth-child(2)', 'assets/energy-storage-visual.svg', 'solution-image', 'Illustrative storage infrastructure'],
      ['.info-card:nth-child(3)', 'assets/smart-building-visual.svg', 'solution-image', 'Illustrative connected building systems']
    ],
    'news.html': [
      ['.plan-card:nth-child(1) .plan-art', 'assets/solar-field-visual.svg', 'plan-photo', 'Illustrative solar development visual'],
      ['.plan-card:nth-child(2) .plan-art', 'assets/ev-charging-visual.svg', 'plan-photo', 'Illustrative EV charging visual'],
      ['.plan-card:nth-child(3) .plan-art', 'assets/smart-building-visual.svg', 'plan-photo', 'Illustrative smart building visual'],
      ['.plan-card:nth-child(4) .plan-art', 'assets/compute-visual.svg', 'plan-photo', 'Illustrative renewable-powered compute visual'],
      ['.plan-card:nth-child(5) .plan-art', 'assets/energy-storage-visual.svg', 'plan-photo', 'Illustrative energy data and storage visual'],
      ['.plan-card:nth-child(6) .plan-art', 'assets/hero-renewable.svg', 'plan-photo', 'Illustrative strategic infrastructure visual']
    ]
  };
  (visualMap[path] || []).forEach(([selector, src, cls, alt]) => {
    const target = $(selector);
    if (!target || target.querySelector('.site-visual')) return;
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = `site-visual ${cls}`;
    img.loading = path === 'index.html' && selector === '.hero' ? 'eager' : 'lazy';
    img.style.display = 'block';
    img.style.objectFit = 'cover';
    if (cls === 'hero-image') {
      target.style.background = 'linear-gradient(90deg,rgba(2,11,18,.92),rgba(2,16,14,.48)),url("assets/hero-renewable.svg") center/cover no-repeat';
      img.style.display = 'none';
    } else if (cls === 'feature-image' || cls === 'solution-image') {
      img.style.width = 'calc(100% + 60px)';
      img.style.height = '118px';
      img.style.margin = '-30px -30px 24px';
      img.style.borderRadius = '12px 12px 0 0';
    } else if (cls === 'plan-photo') {
      img.style.position = 'absolute';
      img.style.inset = '0';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.opacity = '.42';
      img.style.zIndex = '0';
      target.querySelectorAll('*').forEach(el => { el.style.position = 'relative'; el.style.zIndex = '1'; });
    }
    target.prepend(img);
  });

  // TradingView tabs.
  $$('[data-tv]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-tv]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    const frame = $('#tv-chart');
    if (!frame) return;
    const symbol = btn.dataset.tv;
    frame.src = `https://www.tradingview.com/widgetembed/?symbol=${encodeURIComponent(symbol)}&interval=60&hidesidetoolbar=1&hidetoptoolbar=1&saveimage=0&toolbarbg=f7f9f7&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&hideideas=1&studies=[]&hide_volume=0&tvwidgetsymbol=${encodeURIComponent(symbol)}`;
  }));

  const feeds = {
    BTC: { paprika: 'btc-bitcoin', coinbase: 'BTC-USD', binance: 'BTCUSDT' },
    ETH: { paprika: 'eth-ethereum', coinbase: 'ETH-USD', binance: 'ETHUSDT' },
    SOL: { paprika: 'sol-solana', coinbase: 'SOL-USD', binance: 'SOLUSDT' }
  };
  const fmt = n => Number.isFinite(n) ? '$' + n.toLocaleString('en-US', {maximumFractionDigits: n < 10 ? 4 : 2}) : '—';
  async function fetchJson(url) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 9000);
    try { const r = await fetch(url, {cache:'no-store', signal:ctl.signal}); if (!r.ok) throw Error('feed'); return await r.json(); }
    finally { clearTimeout(timer); }
  }
  async function getAsset(k) {
    const f = feeds[k];
    const sources = [
      fetchJson(`https://api.coinpaprika.com/v1/tickers/${f.paprika}?quotes=USD`).then(x => ({price:Number(x.quotes.USD.price), change:Number(x.quotes.USD.percent_change_24h), source:'CoinPaprika'})),
      fetchJson(`https://api.exchange.coinbase.com/products/${f.coinbase}/stats`).then(x => ({price:Number(x.last), change:(Number(x.last)-Number(x.open))/Number(x.open)*100, source:'Coinbase'})),
      fetchJson(`https://api.binance.com/api/v3/ticker/24hr?symbol=${f.binance}`).then(x => ({price:Number(x.lastPrice), change:Number(x.priceChangePercent), source:'Binance'}))
    ];
    return Promise.any(sources);
  }
  async function refreshMarket() {
    for (const k of Object.keys(feeds)) {
      getAsset(k).then(d => {
        const p = $(`#${k.toLowerCase()}-price`), c = $(`#${k.toLowerCase()}-change`);
        if (p) p.textContent = fmt(d.price);
        if (c) { c.textContent = `${d.change >= 0 ? '+' : ''}${d.change.toFixed(2)}% · ${d.source}`; c.classList.toggle('negative', d.change < 0); }
      }).catch(() => {
        const p = $(`#${k.toLowerCase()}-price`), c = $(`#${k.toLowerCase()}-change`);
        if (p) p.textContent = '—';
        if (c) c.textContent = 'Market feeds unavailable — retrying automatically';
      });
    }
  }
  if ($('#btc-price') || $('.asset-card')) { refreshMarket(); setInterval(refreshMarket, 60000); }
})();