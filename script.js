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

  // Use the clean SVG logo so the header never renders the old black JPEG block.
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

  // English-only website: remove any language selector left in legacy page markup.
  document.querySelectorAll('.lang, [data-lang]').forEach(control => control.remove());

  // Login / Sign Up has been removed from the public website.
  document.querySelectorAll('a.login, a[href="login.html"]').forEach(link => link.remove());

  initMarketIntelligence();
});

async function initMarketIntelligence() {
  const chart = document.querySelector('#btc-chart');
  const status = document.querySelector('#market-status');
  if (!chart) return;

  const BASE = 'https://pro-api.coinmarketcap.com/public-api';
  const ids = '1,1027,5426'; // BTC, ETH, SOL

  const fmtPrice = value => {
    if (!Number.isFinite(value)) return '—';
    if (value >= 1000) return '$' + value.toLocaleString('en-US', {maximumFractionDigits: 0});
    if (value >= 1) return '$' + value.toLocaleString('en-US', {maximumFractionDigits: 2});
    return '$' + value.toLocaleString('en-US', {maximumFractionDigits: 4});
  };
  const fmtCompact = value => {
    if (!Number.isFinite(value)) return '—';
    const abs = Math.abs(value);
    if (abs >= 1e12) return '$' + (value / 1e12).toFixed(2) + 'T';
    if (abs >= 1e9) return '$' + (value / 1e9).toFixed(2) + 'B';
    if (abs >= 1e6) return '$' + (value / 1e6).toFixed(2) + 'M';
    return '$' + Math.round(value).toLocaleString('en-US');
  };
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  const setChange = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    const num = Number(value);
    el.textContent = Number.isFinite(num) ? `${num >= 0 ? '+' : ''}${num.toFixed(2)}%` : '—';
    el.classList.toggle('negative', num < 0);
  };

  try {
    if (status) status.textContent = 'Updating market data…';

    const [quotesRes, globalRes, historyRes] = await Promise.all([
      fetch(`${BASE}/v3/cryptocurrency/quotes/latest?id=${ids}&convert=USD`, {headers: {Accept: 'application/json'}}),
      fetch(`${BASE}/v1/global-metrics/quotes/latest?convert=USD`, {headers: {Accept: 'application/json'}}),
      fetch(`${BASE}/v3/cryptocurrency/quotes/historical?id=1&count=31&interval=daily&convert=USD`, {headers: {Accept: 'application/json'}})
    ]);

    if (!quotesRes.ok || !globalRes.ok || !historyRes.ok) throw new Error('Market data request failed');
    const [quotesJson, globalJson, historyJson] = await Promise.all([quotesRes.json(), globalRes.json(), historyRes.json()]);
    if (String(quotesJson?.status?.error_code) !== '0') throw new Error(quotesJson?.status?.error_message || 'Quotes unavailable');

    const q = quotesJson.data || [];
    const byId = Object.fromEntries(q.map(item => [item.id, item]));
    const btc = byId[1]?.quote?.USD;
    const eth = byId[1027]?.quote?.USD;
    const sol = byId[5426]?.quote?.USD;

    if (btc) {
      setText('btc-price', fmtPrice(btc.price));
      setChange('btc-change', btc.percent_change_24h);
      setText('btc-cap', fmtCompact(btc.market_cap));
    }
    if (eth) {
      setText('eth-price', fmtPrice(eth.price));
      setChange('eth-change', eth.percent_change_24h);
      setText('eth-cap', fmtCompact(eth.market_cap));
    }
    if (sol) {
      setText('sol-price', fmtPrice(sol.price));
      setChange('sol-change', sol.percent_change_24h);
      setText('sol-volume', fmtCompact(sol.volume_24h));
    }

    const global = globalJson?.data?.quote?.USD;
    if (global) {
      setText('total-cap', fmtCompact(global.total_market_cap));
      setText('total-volume', fmtCompact(global.total_volume_24h));
      setText('btc-dominance', Number.isFinite(global.btc_dominance) ? global.btc_dominance.toFixed(2) + '%' : '—');
      setText('eth-dominance', Number.isFinite(global.eth_dominance) ? global.eth_dominance.toFixed(2) + '%' : '—');
    }

    const history = historyJson?.data?.quotes || historyJson?.data?.[0]?.quotes || [];
    const points = history.map(row => ({
      time: row.timestamp || row.time_close || row.time_open,
      price: Number(row.quote?.USD?.price ?? row.quote?.USD?.close)
    })).filter(p => p.time && Number.isFinite(p.price));
    drawMarketChart(chart, points);

    if (status) {
      const stamp = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});
      status.textContent = `Live source · Updated ${stamp}`;
    }
  } catch (error) {
    console.warn('Market Intelligence:', error);
    if (status) status.textContent = 'Live data temporarily unavailable';
    drawMarketChart(chart, []);
  }
}

function drawMarketChart(svg, points) {
  const width = 900, height = 340, padX = 36, padY = 28;
  svg.innerHTML = '';
  if (!points.length) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', width / 2); text.setAttribute('y', height / 2);
    text.setAttribute('text-anchor', 'middle'); text.setAttribute('fill', '#7a8881'); text.setAttribute('font-size', '14');
    text.textContent = 'Historical market data unavailable'; svg.appendChild(text); return;
  }
  const values = points.map(p => p.price);
  const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
  const x = i => padX + (i / Math.max(points.length - 1, 1)) * (width - padX * 2);
  const y = value => height - padY - ((value - min) / range) * (height - padY * 2);
  [0.2,0.4,0.6,0.8].forEach(r => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padX); line.setAttribute('x2', width - padX); line.setAttribute('y1', y(min + range * r)); line.setAttribute('y2', y(min + range * r)); line.setAttribute('class', 'chart-grid-line'); svg.appendChild(line);
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
  return '$' + Number(value).toLocaleString('en-US', {maximumFractionDigits: value >= 1000 ? 0 : 2});
}
