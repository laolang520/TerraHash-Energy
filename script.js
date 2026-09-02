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
 * Primary: CoinGecko keyless public API.
 * Fallback: Coinbase public exchange API.
 * Both are browser-friendly public market-data endpoints and require no secret API key.
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
    const el = document.getElementById(id);
    if (!el) return;
    const num = Number(value);
    el.textContent = Number.isFinite(num) ? `${num >= 0 ? '+' : ''}${num.toFixed(2)}%` : '—';
    el.classList.toggle('negative', Number.isFinite(num) && num < 0);
  };

  let source = '';
  let loaded = false;

  // Primary source: CoinGecko public API.
  try {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&precision=4';
    const response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error(`CoinGecko HTTP ${response.status}`);
    const data = await response.json();
    if (!data.bitcoin || !data.ethereum || !data.solana) throw new Error('CoinGecko response incomplete');

    setText('btc-price', fmtPrice(data.bitcoin.usd));
    setChange('btc-change', data.bitcoin.usd_24h_change);
    setText('btc-cap', fmtCompact(data.bitcoin.usd_market_cap));
    setText('eth-price', fmtPrice(data.ethereum.usd));
    setChange('eth-change', data.ethereum.usd_24h_change);
    setText('eth-cap', fmtCompact(data.ethereum.usd_market_cap));
    setText('sol-price', fmtPrice(data.solana.usd));
    setChange('sol-change', data.solana.usd_24h_change);
    setText('sol-volume', fmtCompact(data.solana.usd_24h_vol));
    setText('total-cap', 'Live');
    setText('total-volume', 'Live');
    source = 'CoinGecko';
    loaded = true;
  } catch (error) {
    console.warn('CoinGecko market data unavailable:', error);
  }

  // Browser fallback: Coinbase public exchange API.
  if (!loaded) {
    try {
      const products = ['BTC-USD', 'ETH-USD', 'SOL-USD'];
      const rows = await Promise.all(products.map(async product => {
        const response = await fetch(`https://api.exchange.coinbase.com/products/${product}/stats`, {cache: 'no-store'});
        if (!response.ok) throw new Error(`Coinbase ${product} HTTP ${response.status}`);
        return response.json();
      }));
      const [btc, eth, sol] = rows;
      const change = row => {
        const open = Number(row.open), last = Number(row.last);
        return Number.isFinite(open) && open !== 0 ? ((last - open) / open) * 100 : NaN;
      };
      setText('btc-price', fmtPrice(btc.last));
      setChange('btc-change', change(btc));
      setText('btc-cap', '—');
      setText('eth-price', fmtPrice(eth.last));
      setChange('eth-change', change(eth));
      setText('eth-cap', '—');
      setText('sol-price', fmtPrice(sol.last));
      setChange('sol-change', change(sol));
      setText('sol-volume', fmtCompact(Number(sol.volume) * Number(sol.last)));
      setText('total-cap', '—');
      setText('total-volume', 'Live');
      source = 'Coinbase fallback';
      loaded = true;
    } catch (error) {
      console.warn('Coinbase fallback unavailable:', error);
    }
  }

  // Historical BTC chart: CoinGecko first, Coinbase fallback.
  if (chart) {
    let points = [];
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily', {cache: 'no-store'});
      if (!response.ok) throw new Error(`CoinGecko chart HTTP ${response.status}`);
      const json = await response.json();
      points = (json.prices || []).map(row => ({time: row[0], price: Number(row[1])})).filter(p => p.time && Number.isFinite(p.price));
    } catch (error) {
      console.warn('CoinGecko history unavailable:', error);
    }

    if (!points.length) {
      try {
        const end = Math.floor(Date.now() / 1000);
        const start = end - 30 * 24 * 60 * 60;
        const response = await fetch(`https://api.exchange.coinbase.com/products/BTC-USD/candles?granularity=86400&start=${start}&end=${end}`, {cache: 'no-store'});
        if (!response.ok) throw new Error(`Coinbase chart HTTP ${response.status}`);
        const rows = await response.json();
        points = rows.map(row => ({time: row[0] * 1000, price: Number(row[4])})).filter(p => p.time && Number.isFinite(p.price)).sort((a, b) => a.time - b.time);
        if (points.length) source = source ? `${source} + Coinbase chart` : 'Coinbase';
      } catch (error) {
        console.warn('Coinbase history unavailable:', error);
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
    svg.appendChild(text);
    return;
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

function fmtChartPrice(value) {
  const n = Number(value);
  return '$' + n.toLocaleString('en-US', {maximumFractionDigits: n >= 1000 ? 0 : 2});
}
