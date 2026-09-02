document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('[data-menu]');
  const nav = document.querySelector('.nav');
  if (menu && nav) menu.addEventListener('click', () => nav.classList.toggle('open'));

  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const out = form.querySelector('.form-message');
      if (out) {
        out.textContent = 'Thank you. This demo form is ready to connect to your CRM or email service.';
        out.hidden = false;
      }
      form.reset();
    });
  });

  document.querySelectorAll('.brand .logo').forEach(logo => {
    logo.textContent = '';
    logo.style.backgroundImage = 'url("logo.svg")';
    logo.style.backgroundRepeat = 'no-repeat';
    logo.style.backgroundPosition = 'center';
    logo.style.backgroundSize = 'contain';
    logo.style.width = '150px';
    logo.style.height = '52px';
    logo.style.flex = '0 0 150px';
    logo.style.border = '0';
    logo.style.borderRadius = '8px';
    logo.style.boxShadow = 'none';
    logo.style.backgroundColor = 'transparent';
  });

  document.querySelectorAll('.brand').forEach(brand => {
    const spans = brand.querySelectorAll(':scope > span');
    if (spans.length > 1) spans[1].style.display = 'none';
  });

  if (nav && !nav.querySelector('a[href="market-intelligence.html"]')) {
    const link = document.createElement('a');
    link.href = 'market-intelligence.html';
    link.textContent = 'Market Intelligence';
    const relations = nav.querySelector('a[href="investor-relations.html"]');
    nav.insertBefore(link, relations || nav.lastElementChild);
  }

  document.querySelectorAll('.lang, [data-lang]').forEach(control => control.remove());
  document.querySelectorAll('a.login, a[href="login.html"]').forEach(link => link.remove());
  initMarketIntelligence();
  if (document.querySelector('#btc-price')) setInterval(initMarketIntelligence, 60000);
});

/*
 * Live Market Intelligence
 * Primary: CoinCap public REST API.
 * Fallback: Binance public market data for price/change/volume and BTC history.
 * This keeps the static GitHub Pages site functional without exposing an API key.
 */
async function initMarketIntelligence() {
  const chart = document.querySelector('#btc-chart');
  const hasMarketCards = document.querySelector('#btc-price');
  if (!chart && !hasMarketCards) return;

  const fmtPrice = value => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';
    if (n >= 1000) return '$' + n.toLocaleString('en-US', {maximumFractionDigits: 0});
    if (n >= 1) return '$' + n.toLocaleString('en-US', {maximumFractionDigits: 2});
    return '$' + n.toLocaleString('en-US', {maximumFractionDigits: 4});
  };
  const fmtCompact = value => {
    const n = Number(value);
    if (!Number.isFinite(n)) return '—';
    const abs = Math.abs(n);
    if (abs >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
    if (abs >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    return '$' + Math.round(n).toLocaleString('en-US');
  };
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const setChange = (id, value) => {
    const el = document.getElementById(id); if (!el) return;
    const num = Number(value);
    el.textContent = Number.isFinite(num) ? `${num >= 0 ? '+' : ''}${num.toFixed(2)}%` : '—';
    el.classList.toggle('negative', Number.isFinite(num) && num < 0);
  };

  const assets = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL' };
  let source = '';
  let loaded = false;

  // Source 1: CoinCap. It provides price, market cap, 24h volume and change in one response.
  try {
    const response = await fetch('https://api.coincap.io/v2/assets?ids=bitcoin,ethereum,solana', {
      headers: {Accept: 'application/json'},
      cache: 'no-store'
    });
    if (!response.ok) throw new Error(`CoinCap HTTP ${response.status}`);
    const json = await response.json();
    const rows = Array.isArray(json.data) ? json.data : [];
    const byId = Object.fromEntries(rows.map(row => [row.id, row]));
    const btc = byId.bitcoin, eth = byId.ethereum, sol = byId.solana;
    if (!btc || !eth || !sol) throw new Error('CoinCap asset response incomplete');

    setText('btc-price', fmtPrice(btc.priceUsd));
    setChange('btc-change', btc.changePercent24Hr);
    setText('btc-cap', fmtCompact(btc.marketCapUsd));
    setText('eth-price', fmtPrice(eth.priceUsd));
    setChange('eth-change', eth.changePercent24Hr);
    setText('eth-cap', fmtCompact(eth.marketCapUsd));
    setText('sol-price', fmtPrice(sol.priceUsd));
    setChange('sol-change', sol.changePercent24Hr);
    setText('sol-volume', fmtCompact(sol.volumeUsd24Hr));
    setText('total-cap', 'Live');
    setText('total-volume', 'Live');
    source = 'CoinCap';
    loaded = true;
  } catch (error) {
    console.warn('CoinCap market data unavailable:', error);
  }

  // Source 2: Binance. Public endpoints require no API key and are useful as a browser fallback.
  if (!loaded) {
    try {
      const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'];
      const responses = await Promise.all(symbols.map(symbol =>
        fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`, {cache: 'no-store'})
      ));
      if (responses.some(r => !r.ok)) throw new Error('Binance ticker request failed');
      const rows = await Promise.all(responses.map(r => r.json()));
      const [btc, eth, sol] = rows;
      setText('btc-price', fmtPrice(btc.lastPrice));
      setChange('btc-change', btc.priceChangePercent);
      setText('btc-cap', '—');
      setText('eth-price', fmtPrice(eth.lastPrice));
      setChange('eth-change', eth.priceChangePercent);
      setText('eth-cap', '—');
      setText('sol-price', fmtPrice(sol.lastPrice));
      setChange('sol-change', sol.priceChangePercent);
      setText('sol-volume', fmtCompact(sol.quoteVolume));
      source = 'Binance fallback';
      loaded = true;
    } catch (error) {
      console.warn('Binance fallback unavailable:', error);
    }
  }

  if (chart) {
    let points = [];
    try {
      // CoinCap history needs no API key on its current public usage path.
      const end = Date.now();
      const start = end - 30 * 24 * 60 * 60 * 1000;
      const response = await fetch(`https://api.coincap.io/v2/assets/bitcoin/history?interval=d1&start=${start}&end=${end}`, {cache: 'no-store'});
      if (!response.ok) throw new Error(`CoinCap history HTTP ${response.status}`);
      const json = await response.json();
      points = (json.data || []).map(row => ({time: row.time, price: Number(row.priceUsd)})).filter(p => p.time && Number.isFinite(p.price));
    } catch (error) {
      console.warn('CoinCap history unavailable:', error);
    }

    if (!points.length) {
      try {
        const response = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=30', {cache: 'no-store'});
        if (!response.ok) throw new Error(`Binance history HTTP ${response.status}`);
        const rows = await response.json();
        points = rows.map(row => ({time: row[0], price: Number(row[4])})).filter(p => p.time && Number.isFinite(p.price));
        if (points.length) source = source ? `${source} + Binance chart` : 'Binance';
      } catch (error) {
        console.warn('Binance history unavailable:', error);
      }
    }

    drawMarketChart(chart, points);
  }

  const status = document.querySelector('#market-status');
  if (status) {
    if (loaded) {
      status.textContent = `Live source · ${source} · Updated ${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}`;
    } else {
      status.textContent = 'Live data temporarily unavailable — retrying automatically';
    }
  }
}

function drawMarketChart(svg, points) {
  const width = 900, height = 340, padX = 36, padY = 28;
  svg.innerHTML = '';
  if (!points.length) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', width / 2); text.setAttribute('y', height / 2); text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#7a8881'); text.setAttribute('font-size', '14'); text.textContent = 'Historical market data temporarily unavailable';
    svg.appendChild(text); return;
  }
  const values = points.map(p => p.price), min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const x = i => padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
  const y = value => height - padY - ((value - min) / range) * (height - padY * 2);
  [0.2,0.4,0.6,0.8].forEach(r => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padX); line.setAttribute('x2', width - padX); line.setAttribute('y1', y(min + range * r)); line.setAttribute('y2', y(min + range * r));
    line.setAttribute('class', 'chart-grid-line'); svg.appendChild(line);
  });
  const linePath = points.map((p, i) => `${i ? 'L' : 'M'} ${x(i).toFixed(1)} ${y(p.price).toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${x(points.length - 1)} ${height - padY} L ${x(0)} ${height - padY} Z`;
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path'); area.setAttribute('d', areaPath); area.setAttribute('class', 'btc-area'); svg.appendChild(area);
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'path'); line.setAttribute('d', linePath); line.setAttribute('class', 'btc-line'); svg.appendChild(line);
  [0, Math.floor(points.length / 2), points.length - 1].forEach(i => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); circle.setAttribute('cx', x(i)); circle.setAttribute('cy', y(points[i].price)); circle.setAttribute('r', 5); circle.setAttribute('class', 'chart-point');
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title'); title.textContent = `${new Date(points[i].time).toLocaleDateString('en-US')}: ${fmtChartPrice(points[i].price)}`; circle.appendChild(title); svg.appendChild(circle);
  });
}

function fmtChartPrice(value) { return '$' + Number(value).toLocaleString('en-US', {maximumFractionDigits: value >= 1000 ? 0 : 2}); }
